import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSupabaseClient } from "../../../lib/supabase/admin";
import { createServerSupabaseClient } from "../../../lib/supabase/server";
import {
  PREMIUM_COOKIE_NAME,
  parsePremiumCookie
} from "../../../lib/premiumCookie";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = String(body.password || "");

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Use a password with at least 8 characters." },
        { status: 400 }
      );
    }

    let userId = null;

    try {
      const supabase = createServerSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch (err) {
      console.warn("[auth/set-password] session check failed", err.message);
    }

    if (!userId) {
      const secret = process.env.ACCESS_COOKIE_SECRET;
      const raw = cookies().get(PREMIUM_COOKIE_NAME)?.value;
      const parsed = secret ? parsePremiumCookie(secret, raw) : null;
      if (parsed?.uid) userId = parsed.uid;
    }

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "We could not verify your account on this device. Use the email login link first, then set a password."
        },
        { status: 401 }
      );
    }

    const admin = createAdminSupabaseClient();
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth/set-password]", err);
    return NextResponse.json(
      { error: err.message || "Could not set password." },
      { status: 500 }
    );
  }
}
