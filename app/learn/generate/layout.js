import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminEmail, isCronAuthorized } from "../../lib/adminAccess";
import { createServerSupabaseClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GenerateArticleLayout({ children }) {
  const headerList = headers();
  const requestUrl =
    headerList.get("x-dgps-request-url") || "http://localhost/learn/generate";

  if (!isCronAuthorized({ url: requestUrl, headers: headerList })) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    if (!isAdminEmail(data?.user?.email)) {
      redirect("/login");
    }
  }

  return children;
}
