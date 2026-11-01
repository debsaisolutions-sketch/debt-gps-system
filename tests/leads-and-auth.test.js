import assert from "node:assert/strict";
import { test, beforeEach, afterEach } from "node:test";
import {
  adminEmails,
  authorizeArticleGenerator,
  isAdminEmail,
  isCronHeaderAuthorized
} from "../app/lib/articleGeneratorAuth.js";
import {
  allowLeadRequest,
  buildCalculatorUnlockLeadRow,
  resetLeadColumnSupportCache,
  resetLeadRateLimit,
  saveCalculatorUnlockLead,
  supabaseLeadStore,
  validateLeadEmail
} from "../app/lib/saveCalculatorUnlockLead.js";
import { BOOKING_URL } from "../app/lib/bookingUrl.js";
import { BOOKING_GATE_NOTE } from "../app/lib/calculatorUnlock.js";

const ORIGINAL_ENV = {
  CRON_SECRET: process.env.CRON_SECRET,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS
};

beforeEach(() => {
  resetLeadRateLimit();
  resetLeadColumnSupportCache();
  delete process.env.CRON_SECRET;
  delete process.env.ADMIN_EMAILS;
});

afterEach(() => {
  if (ORIGINAL_ENV.CRON_SECRET === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = ORIGINAL_ENV.CRON_SECRET;
  if (ORIGINAL_ENV.ADMIN_EMAILS === undefined) delete process.env.ADMIN_EMAILS;
  else process.env.ADMIN_EMAILS = ORIGINAL_ENV.ADMIN_EMAILS;
});

function mockSupabase({ missingColumns = false, duplicateOnInsert = false } = {}) {
  const stored = [];
  return {
    stored,
    from() {
      const filters = [];
      const api = {
        select() {
          return api;
        },
        eq(column, value) {
          filters.push([column, value]);
          return api;
        },
        limit() {
          const data = stored.filter((row) =>
            filters.every(([column, value]) => row[column] === value)
          );
          return Promise.resolve({ data, error: null });
        },
        insert(payload) {
          const hasExtra =
            Object.prototype.hasOwnProperty.call(payload, "name") ||
            Object.prototype.hasOwnProperty.call(payload, "inputs_summary");
          if (missingColumns && hasExtra) {
            return Promise.resolve({
              error: {
                message:
                  "Could not find the 'inputs_summary' column of 'leads' in the schema cache"
              }
            });
          }
          if (duplicateOnInsert) {
            return Promise.resolve({
              error: { code: "23505", message: "duplicate key value violates unique constraint" }
            });
          }
          stored.push({ ...payload });
          return Promise.resolve({ error: null });
        }
      };
      return api;
    }
  };
}

test("calculator unlock lead matches existing columns and keeps name plus totals", () => {
  const row = buildCalculatorUnlockLeadRow(
    {
      email: "  Ada@Example.com ",
      name: "Ada Lovelace",
      summary: {
        debtCount: 2,
        totalBalance: 12000,
        totalMinPayment: 350,
        monthlyIncome: 5000,
        monthlyExpenses: 2800
      }
    },
    new Date("2026-11-01T00:00:00.000Z")
  );

  assert.equal(row.email, "ada@example.com");
  assert.equal(row.source, "calculator_unlock");
  assert.equal(row.plan, "free");
  assert.equal(row.created_at, "2026-11-01T00:00:00.000Z");
  assert.equal(row.name, "Ada Lovelace");
  assert.match(row.inputs_summary, /totalBalance=12000/);
  assert.match(row.inputs_summary, /debts=2/);
  assert.equal(Object.hasOwn(row, "password"), false);
});

test("validateLeadEmail rejects blanks and accepts a normal address", () => {
  assert.equal(validateLeadEmail("  "), "email is required");
  assert.equal(validateLeadEmail("not-an-email"), "email is invalid");
  assert.equal(validateLeadEmail("person@example.com"), null);
});

test("save inserts one row and treats the same email as a duplicate", async () => {
  const supabase = mockSupabase();
  const store = supabaseLeadStore(supabase);
  const input = {
    email: "person@example.com",
    name: "Pat",
    summary: { debtCount: 1, totalBalance: 4000, totalMinPayment: 80, monthlyIncome: 3000, monthlyExpenses: 1500 }
  };

  const first = await saveCalculatorUnlockLead(store, input, new Date("2026-11-01T01:00:00.000Z"));
  const second = await saveCalculatorUnlockLead(store, input, new Date("2026-11-01T02:00:00.000Z"));

  assert.equal(first.ok, true);
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(supabase.stored.length, 1);
  assert.equal(supabase.stored[0].source, "calculator_unlock");
  assert.equal(supabase.stored[0].name, "Pat");
  assert.match(supabase.stored[0].inputs_summary, /totalBalance=4000/);
});

test("save falls back to existing leads columns when name and summary are missing", async () => {
  const supabase = mockSupabase({ missingColumns: true });
  const store = supabaseLeadStore(supabase);
  const result = await saveCalculatorUnlockLead(
    store,
    {
      email: "fallback@example.com",
      name: "Fallback",
      summary: { totalBalance: 10, debtCount: 1, totalMinPayment: 1, monthlyIncome: 1, monthlyExpenses: 1 }
    },
    new Date("2026-11-01T03:00:00.000Z")
  );

  assert.equal(result.ok, true);
  assert.equal(supabase.stored.length, 1);
  assert.deepEqual(Object.keys(supabase.stored[0]).sort(), [
    "created_at",
    "email",
    "plan",
    "source"
  ]);
  assert.equal(supabase.stored[0].email, "fallback@example.com");
  assert.equal(supabase.stored[0].source, "calculator_unlock");
});

test("unique violation is a successful duplicate", async () => {
  const supabase = mockSupabase({ duplicateOnInsert: true });
  const result = await saveCalculatorUnlockLead(
    supabaseLeadStore(supabase),
    { email: "dup@example.com" },
    new Date("2026-11-01T04:00:00.000Z")
  );
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(supabase.stored.length, 0);
});

test("invalid email does not insert", async () => {
  const supabase = mockSupabase();
  const result = await saveCalculatorUnlockLead(supabaseLeadStore(supabase), {
    email: "nope"
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.equal(supabase.stored.length, 0);
});

test("lead rate limit allows 10 calls per key then blocks", () => {
  for (let i = 0; i < 10; i += 1) {
    assert.equal(allowLeadRequest("203.0.113.5", 1_000 + i), true);
  }
  assert.equal(allowLeadRequest("203.0.113.5", 1_010), false);
  assert.equal(allowLeadRequest("203.0.113.6", 1_010), true);
});

test("cron secret is accepted from headers and ignored on the query string", async () => {
  process.env.CRON_SECRET = "top-secret";
  const withQuery = new Request(
    "http://localhost/api/generate-article?cron_secret=top-secret"
  );
  assert.equal(isCronHeaderAuthorized(withQuery.headers), false);

  const denied = await authorizeArticleGenerator(withQuery.headers, async () => null);
  assert.deepEqual(denied, { ok: false, status: 401 });

  const bearer = new Headers({ authorization: "Bearer top-secret" });
  assert.equal(isCronHeaderAuthorized(bearer), true);
  const allowed = await authorizeArticleGenerator(bearer, async () => {
    throw new Error("user lookup should be skipped");
  });
  assert.deepEqual(allowed, { ok: true, via: "cron" });

  const alt = new Headers({ "x-cron-secret": "top-secret" });
  assert.equal(isCronHeaderAuthorized(alt), true);

  const wrong = new Headers({ authorization: "Bearer nope" });
  assert.equal(isCronHeaderAuthorized(wrong), false);
});

test("admin gate is 401 anonymous, 403 signed-in, ok for ADMIN_EMAILS", async () => {
  process.env.ADMIN_EMAILS = "owner@example.com, Staff@Example.com ";
  assert.deepEqual(adminEmails(), ["owner@example.com", "staff@example.com"]);
  assert.equal(isAdminEmail("STAFF@example.com"), true);
  assert.equal(isAdminEmail("other@example.com"), false);

  const headers = new Headers();
  const anon = await authorizeArticleGenerator(headers, async () => null);
  assert.deepEqual(anon, { ok: false, status: 401 });

  const member = await authorizeArticleGenerator(headers, async () => ({
    email: "member@example.com"
  }));
  assert.deepEqual(member, { ok: false, status: 403 });

  const admin = await authorizeArticleGenerator(headers, async () => ({
    email: "Owner@Example.com"
  }));
  assert.deepEqual(admin, { ok: true, via: "admin" });
});

test("booking copy and calendar url stay the same", () => {
  assert.equal(
    BOOKING_URL,
    "https://link.agent-crm.com/widget/booking/3g7EgtS4IewV5fuPcKO8"
  );
  assert.equal(
    BOOKING_GATE_NOTE,
    "Run your numbers first so we can make the most of your call."
  );
});
