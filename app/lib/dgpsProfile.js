import { createAdminSupabaseClient } from "./supabase/admin";

export const DGPS_PREMIUM_STATUSES = new Set(["active", "trialing"]);

/**
 * @param {string | null | undefined} status
 * @returns {boolean}
 */
export function isDgpsPremiumStatus(status) {
  return DGPS_PREMIUM_STATUSES.has(String(status || "").toLowerCase());
}

/**
 * Ensure a dgps_profiles row exists for this auth user (service role upsert).
 * @param {{ id: string, email?: string | null }} user
 */
export async function ensureDgpsProfile(user) {
  if (!user?.id) {
    throw new Error("ensureDgpsProfile: missing user.id");
  }

  const admin = createAdminSupabaseClient();
  const email = user.email ? String(user.email).trim().toLowerCase() : null;

  const { data, error } = await admin
    .from("dgps_profiles")
    .upsert(
      {
        user_id: user.id,
        email,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(`ensureDgpsProfile failed: ${error.message}`);
  }

  return data;
}

/**
 * @param {string} userId
 */
export async function getDgpsProfile(userId) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("dgps_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`getDgpsProfile failed: ${error.message}`);
  }

  return data;
}

/**
 * @param {string} email
 */
export async function getDgpsProfileByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return null;

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("dgps_profiles")
    .select("*")
    .eq("email", normalized);

  if (error) {
    throw new Error(`getDgpsProfileByEmail failed: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  if (!rows.length) return null;

  return (
    rows.find((row) => isDgpsPremiumStatus(row.subscription_status)) ||
    rows[0]
  );
}

/**
 * Apply Stripe subscription fields onto dgps_profiles.
 * @param {object} args
 * @param {string} [args.userId]
 * @param {string} [args.stripeCustomerId]
 * @param {string} [args.stripeSubscriptionId]
 * @param {string} [args.subscriptionStatus]
 * @param {'month'|'year'|null} [args.planInterval]
 * @param {number|null} [args.currentPeriodEndUnix]
 * @param {string|null} [args.email]
 */
export async function upsertDgpsSubscriptionState(args) {
  const admin = createAdminSupabaseClient();

  let userId = args.userId || null;

  if (!userId && args.stripeCustomerId) {
    const { data: byCustomer } = await admin
      .from("dgps_profiles")
      .select("user_id")
      .eq("stripe_customer_id", args.stripeCustomerId)
      .maybeSingle();
    userId = byCustomer?.user_id || null;
  }

  if (!userId && args.stripeSubscriptionId) {
    const { data: bySub } = await admin
      .from("dgps_profiles")
      .select("user_id")
      .eq("stripe_subscription_id", args.stripeSubscriptionId)
      .maybeSingle();
    userId = bySub?.user_id || null;
  }

  if (!userId && args.email) {
    const { data: byEmail } = await admin
      .from("dgps_profiles")
      .select("user_id")
      .eq("email", String(args.email).trim().toLowerCase())
      .limit(1)
      .maybeSingle();
    userId = byEmail?.user_id || null;
  }

  if (!userId) {
    throw new Error(
      "upsertDgpsSubscriptionState: could not resolve user_id from Stripe ids"
    );
  }

  const patch = {
    updated_at: new Date().toISOString()
  };

  if (args.email) patch.email = String(args.email).trim().toLowerCase();
  if (args.stripeCustomerId) patch.stripe_customer_id = args.stripeCustomerId;
  if (args.stripeSubscriptionId != null) {
    patch.stripe_subscription_id = args.stripeSubscriptionId || null;
  }
  if (args.subscriptionStatus) {
    patch.subscription_status = args.subscriptionStatus;
  }
  if (args.planInterval !== undefined) {
    patch.plan_interval = args.planInterval;
  }
  if (args.currentPeriodEndUnix != null) {
    patch.current_period_end = new Date(
      args.currentPeriodEndUnix * 1000
    ).toISOString();
  } else if (args.currentPeriodEndUnix === null) {
    patch.current_period_end = null;
  }

  const { data, error } = await admin
    .from("dgps_profiles")
    .update(patch)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`upsertDgpsSubscriptionState failed: ${error.message}`);
  }

  return data;
}

/**
 * Find an auth user by email, or create a confirmed user (no password).
 * Used after Stripe Checkout so login is not required before pay.
 * @param {string} email
 * @returns {Promise<{ id: string, email?: string | null }>}
 */
export async function findOrCreateAuthUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    throw new Error("findOrCreateAuthUserByEmail: missing email");
  }

  const admin = createAdminSupabaseClient();

  const { data: profiles, error: profileError } = await admin
    .from("dgps_profiles")
    .select("user_id")
    .eq("email", normalized)
    .limit(1);

  if (profileError) {
    console.warn("[dgps] email profile lookup failed", profileError.message);
  }

  const existingId = profiles?.[0]?.user_id;
  if (existingId) {
    const { data, error } = await admin.auth.admin.getUserById(existingId);
    if (!error && data?.user) return data.user;
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: normalized,
    email_confirm: true,
    user_metadata: { app: "debt_gps" }
  });

  if (created?.user) return created.user;

  const duplicate = /already|registered|exists/i.test(
    String(createError?.message || createError?.code || "")
  );

  if (duplicate) {
    const { data: linkData, error: linkError } =
      await admin.auth.admin.generateLink({
        type: "magiclink",
        email: normalized
      });
    if (linkData?.user) return linkData.user;
    throw new Error(
      `findOrCreateAuthUserByEmail: existing user lookup failed: ${
        linkError?.message || createError.message
      }`
    );
  }

  throw new Error(
    `findOrCreateAuthUserByEmail failed: ${createError?.message || "unknown error"}`
  );
}

/**
 * Create/link auth user + dgps_profiles from a paid Stripe Checkout.
 * @param {object} args
 * @param {string} args.email
 * @param {string} [args.stripeCustomerId]
 * @param {string} [args.stripeSubscriptionId]
 * @param {string} [args.subscriptionStatus]
 * @param {'month'|'year'|null} [args.planInterval]
 * @param {number|null} [args.currentPeriodEndUnix]
 */
export async function provisionPaidDgpsProfile(args) {
  const user = await findOrCreateAuthUserByEmail(args.email);
  const email = String(args.email || user.email || "")
    .trim()
    .toLowerCase();
  await ensureDgpsProfile({ id: user.id, email });
  return upsertDgpsSubscriptionState({
    userId: user.id,
    stripeCustomerId: args.stripeCustomerId,
    stripeSubscriptionId: args.stripeSubscriptionId,
    subscriptionStatus: args.subscriptionStatus,
    planInterval: args.planInterval,
    currentPeriodEndUnix: args.currentPeriodEndUnix,
    email
  });
}

/**
 * @param {import('stripe').Stripe.Subscription} subscription
 * @returns {'month'|'year'|null}
 */
export function planIntervalFromSubscription(subscription) {
  const interval = subscription?.items?.data?.[0]?.price?.recurring?.interval;
  if (interval === "year") return "year";
  if (interval === "month") return "month";
  return null;
}
