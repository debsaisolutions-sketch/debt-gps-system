import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authorizeArticleGenerator } from "../../lib/articleGeneratorAuth";
import { createServerSupabaseClient } from "../../lib/supabase/server";
import GenerateArticleForm from "./GenerateArticleForm";

export const dynamic = "force-dynamic";

export default async function GenerateArticlePage() {
  const headerList = headers();
  const decision = await authorizeArticleGenerator(headerList, async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  });

  if (!decision.ok) {
    if (decision.status === 401) {
      redirect("/login");
    }
    return (
      <main className="page" style={{ maxWidth: "720px", paddingTop: "48px" }}>
        <h1 style={{ marginBottom: "12px" }}>Not allowed</h1>
        <p className="help" style={{ marginBottom: 0 }}>
          This page is limited to Debt GPS admins.
        </p>
      </main>
    );
  }

  return <GenerateArticleForm />;
}
