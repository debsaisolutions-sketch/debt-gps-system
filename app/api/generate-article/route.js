import { readFile, writeFile } from "fs/promises";
import path from "path";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const ARTICLE_FILE_PATH = path.join(process.cwd(), "app/lib/seoArticles.js");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeArticle(article, fallbackTopic = "") {
  const slugBase = cleanText(article?.slug) || cleanText(article?.title) || cleanText(fallbackTopic);
  const slug = slugify(slugBase);

  const normalizedSections = Array.isArray(article?.sections)
    ? article.sections
        .map((section) => ({
          heading: cleanText(section?.heading),
          body: cleanText(section?.body)
        }))
        .filter((section) => section.heading && section.body)
    : [];

  const normalizedFaq = Array.isArray(article?.faq)
    ? article.faq
        .map((item) => ({
          question: cleanText(item?.question),
          answer: cleanText(item?.answer)
        }))
        .filter((item) => item.question && item.answer)
    : [];

  return {
    slug,
    title: cleanText(article?.title),
    description: cleanText(article?.description),
    intro: cleanText(article?.intro),
    sections: normalizedSections,
    faq: normalizedFaq,
    ctaTitle: cleanText(article?.ctaTitle),
    ctaText: cleanText(article?.ctaText)
  };
}

function validateArticle(article) {
  if (!article.slug) return "Missing slug";
  if (!article.title) return "Missing title";
  if (!article.description) return "Missing description";
  if (!article.intro) return "Missing intro";
  if (!Array.isArray(article.sections) || article.sections.length === 0) return "Missing sections";
  if (!Array.isArray(article.faq) || article.faq.length === 0) return "Missing faq";
  if (!article.ctaTitle) return "Missing ctaTitle";
  if (!article.ctaText) return "Missing ctaText";
  return null;
}

function extractArticleArrayFromFile(fileContents) {
  const prefix = "export const seoArticles = ";
  const suffix = ";\n\nexport function getSeoArticleBySlug(slug) {";
  const start = fileContents.indexOf(prefix);
  const end = fileContents.indexOf(suffix);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not parse seoArticles.js structure");
  }

  const arraySource = fileContents.slice(start + prefix.length, end).trim();
  const parsed = Function(`"use strict"; return (${arraySource});`)();

  if (!Array.isArray(parsed)) {
    throw new Error("seoArticles export is not an array");
  }

  return parsed;
}

function buildSeoArticlesModule(articles) {
  const serialized = JSON.stringify(articles, null, 2);
  return `export const seoArticles = ${serialized};

export function getSeoArticleBySlug(slug) {
  return seoArticles.find((article) => article.slug === slug) || null;
}
`;
}

async function generateArticleFromOpenAI(topic) {
  const systemPrompt = `
You are an expert SEO content writer for Debt GPS System.
Write for beginners with simple language, short sentences, and practical examples.
Focus only on debt payoff strategies and credit card debt education.
Avoid hype and avoid fluff.
Return strict JSON only (no markdown, no code fences).
`;

  const userPrompt = `
Generate one SEO article for this topic: "${topic}".

Return exactly this shape:
{
  "slug": "kebab-case",
  "title": "string",
  "description": "string",
  "intro": "string",
  "sections": [{ "heading": "string", "body": "string" }],
  "faq": [{ "question": "string", "answer": "string" }],
  "ctaTitle": "string",
  "ctaText": "string"
}

Rules:
- Use 3 to 5 sections.
- Use 3 to 5 FAQ items.
- Include practical examples.
- Keep content useful and clear for first-time learners.
- Ensure slug is URL-safe kebab-case.
`;

  console.log("env key prefix:", process.env.OPENAI_API_KEY?.slice(0, 12));
  console.log("using auth header prefix:", `Bearer ${process.env.OPENAI_API_KEY}`.slice(0, 19));

  const upstream = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() }
      ]
    })
  });

  const text = await upstream.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("OpenAI returned non-JSON response");
  }

  if (!upstream.ok) {
    const message = parsed?.error?.message || `OpenAI request failed (${upstream.status})`;
    throw new Error(message);
  }

  const content = parsed?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response was missing generated content");
  }

  let articlePayload;
  try {
    articlePayload = JSON.parse(content);
  } catch {
    throw new Error("Generated content was not valid JSON");
  }

  return articlePayload;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = cleanText(body?.action || "generate");

    if (action === "save") {
      const normalized = normalizeArticle(body?.article);
      const validationError = validateArticle(normalized);
      if (validationError) {
        return new Response(
          JSON.stringify({ success: false, error: `Invalid article: ${validationError}` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const currentFileContents = await readFile(ARTICLE_FILE_PATH, "utf8");
      const currentArticles = extractArticleArrayFromFile(currentFileContents);
      const existingSlug = currentArticles.some((item) => item.slug === normalized.slug);

      if (existingSlug) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "An article with this slug already exists. Regenerate or edit before saving."
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      const updatedArticles = [...currentArticles, normalized];
      const updatedFile = buildSeoArticlesModule(updatedArticles);
      await writeFile(ARTICLE_FILE_PATH, updatedFile, "utf8");

      return new Response(
        JSON.stringify({ success: true, saved: true, article: normalized }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const topic = cleanText(body?.topic);
    if (!topic) {
      return new Response(
        JSON.stringify({ success: false, error: "topic is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "OPENAI_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const generated = await generateArticleFromOpenAI(topic);
    const normalized = normalizeArticle(generated, topic);
    const validationError = validateArticle(normalized);

    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: `Generated article invalid: ${validationError}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, article: normalized }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-article error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to generate article" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
