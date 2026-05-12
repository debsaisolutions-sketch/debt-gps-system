import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function generateArticleFromTopic(topic) {
  const prompt = `
You are writing a debt-help SEO article for Debt GPS System.

Return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "slug": "string",
  "description": "string",
  "intro": "string",
  "sections": [
    { "heading": "string", "body": "string" }
  ],
  "faq": [
    { "question": "string", "answer": "string" }
  ],
  "ctaTitle": "string",
  "ctaText": "string"
}

Requirements:
- Topic: ${topic}
- Clear, practical, beginner-friendly language
- 4 to 6 sections
- 4 to 6 FAQs
- Slug must be lowercase with hyphens only
- Make content specific to debt payoff, budgeting, payoff strategy, or cash flow
- No markdown
- No code fences
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: "You write structured SEO articles in strict JSON." },
      { role: "user", content: prompt }
    ]
  });

  const text = response.choices?.[0]?.message?.content || "";
  const article = JSON.parse(text);

  if (!article.slug) {
    article.slug = slugify(article.title || topic);
  }

  return article;
}

function requireCronAuth(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const authHeader = request.headers.get("authorization");
  const xCronSecret = request.headers.get("x-cron-secret");
  const querySecret = new URL(request.url).searchParams.get("cron_secret");
  const bearerOk = authHeader === `Bearer ${secret}`;
  const secretHeaderOk = xCronSecret === secret;
  const queryOk = querySecret === secret;
  if (!bearerOk && !secretHeaderOk && !queryOk) {
    console.log({
      route: "bulk-generate-articles",
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      hasAuthorizationHeader: Boolean(authHeader),
      hasXCronSecretHeader: Boolean(xCronSecret),
      hasCronSecretQuery: Boolean(querySecret),
      authHeaderStartsWithBearer: Boolean(authHeader && authHeader.startsWith("Bearer ")),
      bearerOk,
      secretHeaderOk,
      queryOk,
      requestUrlPath: new URL(request.url).pathname,
      requestUrlHasCronSecretParam: new URL(request.url).searchParams.has("cron_secret")
    });
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) {
    return unauthorized;
  }

  const { data: topics, error: topicError } = await supabase
    .from("seo_article_topics")
    .select("*")
    .eq("status", "pending")
    .order("id", { ascending: true })
    .limit(5);

  if (topicError) {
    return Response.json({ success: false, error: topicError.message }, { status: 500 });
  }

  if (!topics || topics.length === 0) {
    return Response.json({ success: true, message: "No pending topics found.", processed: 0 });
  }

  const results = [];

  for (const item of topics) {
    try {
      const article = await generateArticleFromTopic(item.topic);

      const { error: articleError } = await supabase
        .from("seo_articles")
        .upsert({
          slug: article.slug,
          title: article.title,
          description: article.description,
          intro: article.intro,
          sections: article.sections || [],
          faq: article.faq || [],
          cta_title: article.ctaTitle,
          cta_text: article.ctaText
        });

      if (articleError) {
        throw new Error(articleError.message);
      }

      const { error: updateError } = await supabase
        .from("seo_article_topics")
        .update({
          status: "completed",
          slug: article.slug,
          error_message: null,
          processed_at: new Date().toISOString()
        })
        .eq("id", item.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      results.push({
        topic: item.topic,
        slug: article.slug,
        status: "completed"
      });
    } catch (error) {
      await supabase
        .from("seo_article_topics")
        .update({
          status: "failed",
          error_message: error.message,
          processed_at: new Date().toISOString()
        })
        .eq("id", item.id);

      results.push({
        topic: item.topic,
        status: "failed",
        error: error.message
      });
    }
  }

  return Response.json({
    success: true,
    processed: results.length,
    results
  });
}
