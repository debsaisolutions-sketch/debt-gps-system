import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { CALCULATOR_UNLOCK_COOKIE } from "../../lib/calculatorUnlock";
import { createAdminSupabaseClient } from "../../lib/supabase/admin";
import {
  allowLeadRequest,
  saveCalculatorUnlockLead,
  supabaseLeadStore
} from "../../lib/saveCalculatorUnlockLead";

export const dynamic = "force-dynamic";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function clientAddress(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "local";
}

function withUnlockCookie(request, body, status) {
  const response = NextResponse.json(body, { status });
  response.cookies.set(CALCULATOR_UNLOCK_COOKIE, "1", {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
    httpOnly: false,
    secure: request.nextUrl.protocol === "https:"
  });
  return response;
}

async function readMockRows(filePath) {
  try {
    const text = await readFile(filePath, "utf8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }
}

function fileLeadStore(filePath) {
  return {
    async findByEmailSource(email, source) {
      const rows = await readMockRows(filePath);
      return rows.some((row) => row.email === email && row.source === source);
    },
    async insert(row) {
      const rows = await readMockRows(filePath);
      rows.push(row);
      await writeFile(filePath, JSON.stringify(rows, null, 2));
    }
  };
}

function leadStore() {
  const mockPath = process.env.LEADS_MOCK_PATH;
  if (mockPath) return fileLeadStore(mockPath);
  return supabaseLeadStore(createAdminSupabaseClient());
}

export async function POST(request) {
  if (!allowLeadRequest(clientAddress(request))) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    const result = await saveCalculatorUnlockLead(leadStore(), {
      email: body?.email,
      name: body?.name,
      summary: body?.summary
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return withUnlockCookie(
      request,
      { success: true, duplicate: Boolean(result.duplicate) },
      200
    );
  } catch (error) {
    console.warn("[leads] calculator unlock save failed", error?.message || error);
    return NextResponse.json(
      { success: false, error: "Could not save lead" },
      { status: 500 }
    );
  }
}
