const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_SOURCE = "calculator_unlock";
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 10;

const hitsByKey = new Map();
let extraLeadColumnsSupported = null;

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function validateLeadEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return "email is required";
  if (normalized.length > 254 || !EMAIL_PATTERN.test(normalized)) {
    return "email is invalid";
  }
  return null;
}

function cleanName(name) {
  const cleaned = String(name ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 120);
  return cleaned || null;
}

function finiteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Short text that fits the leads table. Totals only — not a full debt list. */
export function buildInputsSummary(summary) {
  if (!summary || typeof summary !== "object") return null;
  const text = [
    `debts=${finiteNumber(summary.debtCount)}`,
    `totalBalance=${finiteNumber(summary.totalBalance)}`,
    `totalMinPayment=${finiteNumber(summary.totalMinPayment)}`,
    `monthlyIncome=${finiteNumber(summary.monthlyIncome)}`,
    `monthlyExpenses=${finiteNumber(summary.monthlyExpenses)}`
  ].join("; ");
  return text.slice(0, 500);
}

export function buildCalculatorUnlockLeadRow(input, now = new Date()) {
  const email = normalizeEmail(input?.email);
  const name = cleanName(input?.name);
  const inputs_summary = buildInputsSummary(input?.summary);
  const row = {
    email,
    source: LEAD_SOURCE,
    plan: "free",
    created_at: now.toISOString()
  };
  if (name) row.name = name;
  if (inputs_summary) row.inputs_summary = inputs_summary;
  return row;
}

export function isMissingLeadColumnError(error) {
  const message = String(error?.message || "");
  return /column/i.test(message) && /(does not exist|schema cache|could not find)/i.test(message);
}

export function isDuplicateLeadError(error) {
  const message = String(error?.message || "");
  return error?.code === "23505" || /duplicate key|unique constraint/i.test(message);
}

/**
 * Basic in-memory limiter (per server instance). Key should be an IP.
 * @returns {boolean} true when the call is allowed
 */
export function allowLeadRequest(key, now = Date.now()) {
  const id = String(key || "unknown");
  const recent = (hitsByKey.get(id) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hitsByKey.set(id, recent);
    return false;
  }
  recent.push(now);
  hitsByKey.set(id, recent);
  return true;
}

/** Test helpers. */
export function resetLeadRateLimit() {
  hitsByKey.clear();
}

export function resetLeadColumnSupportCache() {
  extraLeadColumnsSupported = null;
}

function basicLeadRow(row) {
  return {
    email: row.email,
    source: row.source,
    plan: row.plan,
    created_at: row.created_at
  };
}

async function insertLeadRow(supabase, row) {
  const payload =
    extraLeadColumnsSupported === false ? basicLeadRow(row) : { ...row };
  const first = await supabase.from("leads").insert(payload);
  if (!first.error) {
    if ("name" in payload || "inputs_summary" in payload) {
      extraLeadColumnsSupported = true;
    }
    return null;
  }
  if (extraLeadColumnsSupported !== false && isMissingLeadColumnError(first.error)) {
    extraLeadColumnsSupported = false;
    const second = await supabase.from("leads").insert(basicLeadRow(row));
    return second.error || null;
  }
  return first.error;
}

export function supabaseLeadStore(supabase) {
  return {
    async findByEmailSource(email, source) {
      const { data, error } = await supabase
        .from("leads")
        .select("id")
        .eq("email", email)
        .eq("source", source)
        .limit(1);
      if (error) throw error;
      return Array.isArray(data) && data.length > 0;
    },
    async insert(row) {
      const error = await insertLeadRow(supabase, row);
      if (error) {
        const wrapped = new Error(error.message || "insert failed");
        wrapped.code = error.code;
        throw wrapped;
      }
    }
  };
}

/**
 * Insert a calculator_unlock lead. Duplicate email+source is success.
 * `store` is `{ findByEmailSource, insert }` so tests can pass a mock.
 */
export async function saveCalculatorUnlockLead(store, input, now = new Date()) {
  const emailError = validateLeadEmail(input?.email);
  if (emailError) {
    return { ok: false, status: 400, error: emailError };
  }

  const row = buildCalculatorUnlockLeadRow(input, now);
  const existing = await store.findByEmailSource(row.email, row.source);
  if (existing) {
    return { ok: true, status: 200, duplicate: true, row };
  }

  try {
    await store.insert(row);
  } catch (error) {
    if (isDuplicateLeadError(error)) {
      return { ok: true, status: 200, duplicate: true, row };
    }
    throw error;
  }

  return { ok: true, status: 200, duplicate: false, row };
}
