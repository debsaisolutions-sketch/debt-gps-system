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
 * @param {import('stripe').Stripe.Subscription} subscription
 * @returns {'month'|'year'|null}
 */
export function planIntervalFromSubscription(subscription) {
  const interval = subscription?.items?.data?.[0]?.price?.recurring?.interval;
  if (interval === "year") return "year";
  if (interval === "month") return "month";
  return null;
}
