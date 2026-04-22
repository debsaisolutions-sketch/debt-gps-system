import { supabase } from "./lib/supabaseClient";

export default async function sitemap() {
  const baseUrl = "https://debtgpssystem.com";

  const { data: articles } = await supabase
    .from("seo_articles")
    .select("slug");

  const articleUrls = articles?.map((article) => ({
    url: `${baseUrl}/learn/${article.slug}`,
    lastModified: new Date(),
  })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}
