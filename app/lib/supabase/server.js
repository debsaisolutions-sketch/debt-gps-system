import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://egyruxwhldsmxhiqcekl.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_9AsiDMx2RM8e657vv0w0lg__glnZ3hv";

/**
 * Server Supabase client that reads/writes the user auth session via cookies.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          /* Called from a Server Component — middleware will refresh. */
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          /* ignore */
        }
      }
    }
  });
}
