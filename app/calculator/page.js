"use client";

// Enhanced Professional SaaS-style Financial Dashboard Layout Helpers
//
// VERSION: WIDE, CRISP, PREMIUM (as seen in best-in-class fintech dashboards)

import React from "react";

// DashboardGrid component: 
// - Wider maxWidth (1400px), 
// - Left = fixed width (380–420px), 
// - Right = dominant, flexible
export function DashboardGrid({ left, right, className = "", style = {}, ...props }) {
  return (
    <div
      className={`dashboard-pro-grid wide-dashboard ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(380px,420px) 1fr",
        gap: "44px",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        alignItems: "flex-start",
        ...style,
      }}
      {...props}
    >
      <aside
        className="dashboard-pro-grid-sidebar"
        style={{
          position: "relative",
          minWidth: 380,
          maxWidth: 420,
          width: "100%",
          paddingRight: 0,
        }}
      >
        {left}
      </aside>
      <main
        className="dashboard-pro-grid-main"
        style={{
          width: "100%",
          minWidth: 0,
          // The right column is visually wider/dominant
        }}
      >
        {right}
      </main>
    </div>
  );
}

// Professional, visually strong section header utility
export function SectionHeader({ children, style = {}, className = "" }) {
  return (
    <h2
      className={`dashboard-section-header ${className}`}
      style={{
        fontSize: "1.45rem",
        fontWeight: 800,
        letterSpacing: "0.01em",
        marginBottom: "18px",
        marginTop: "0",
        lineHeight: 1.18,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

// KPIGrid: Grid for KPIs (2–3 columns, numbers big, labels muted & small)
export function KPIGrid({ children, columns = 3, className = "", style = {}, ...props }) {
  return (
    <div
      className={`kpi-grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "20px 24px",
        margin: "24px 0 34px 0",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// KPITile: Big number, small muted label
export function KPITile({ value, label, extra = null, style = {}, className = "", ...props }) {
  return (
    <div
      className={`kpi-tile card ${className}`}
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "14px",
        padding: "26px 20px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        ...style,
      }}
      {...props}
    >
      <div
        className="kpi-value"
        style={{
          fontSize: "2.1rem",
          fontWeight: 800,
          color: "var(--accent)",
          lineHeight: 1.07,
          letterSpacing: "0.01em",
        }}
      >
        {value}
      </div>
      {extra && <div className="kpi-extra">{extra}</div>}
      <div
        className="kpi-label"
        style={{
          fontSize: "0.96rem",
          color: "var(--muted)",
          fontWeight: 500,
          letterSpacing: 0,
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// StrategyComparisonPanel: Wide cards, spaced, centered important numbers.
export function StrategyComparisonPanel({ children, className = "", style = {}, ...props }) {
  return (
    <section
      className={`strategy-comparison-panel ${className}`}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "28px",
        justifyContent: "center",
        margin: "36px 0 38px 0",
        padding: "0",
        ...style,
      }}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          style: {
            minWidth: "320px",
            flex: 1,
            padding: "30px 28px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
            ...((child.props && child.props.style) || {}),
          },
        })
      )}
    </section>
  );
}

// BankingEngineSection: Enforced side-by-side on desktop, large padding inside cards
export function BankingEngineSection({ left, right, className = "", style = {}, ...props }) {
  return (
    <section
      className={`banking-engine-section wide-cards ${className}`}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "32px",
        width: "100%",
        margin: "38px 0",
        ...style,
      }}
      {...props}
    >
      <div
        className="banking-engine-card"
        style={{
          flex: 1,
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          padding: "34px 32px 30px",
          minWidth: 0,
        }}
      >
        {left}
      </div>
      <div
        className="banking-engine-card"
        style={{
          flex: 2.2,
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          padding: "34px 32px 30px",
          minWidth: 0,
        }}
      >
        {right}
      </div>
    </section>
  );
}

// MonthTable: Max height & scroll, sticky header
export function MonthTable({ columns, rows, className = "", style = {}, ...props }) {
  return (
    <div
      className={`month-table-container ${className}`}
      style={{
        maxHeight: "480px",
        overflowY: "auto",
        borderRadius: "12px",
        border: "1px solid var(--line)",
        background: "var(--card)",
        margin: "30px 0",
        ...style,
      }}
      {...props}
    >
      <table
        className="month-table"
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--card)" }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col}
                style={{
                  position: "sticky",
                  top: 0,
                  background: "var(--card)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--heading)",
                  borderBottom: "2px solid var(--line)",
                  padding: "14px 16px",
                  zIndex: 3,
                }}
              >
                {col.label || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key || i}>
              {columns.map((col) => (
                <td
                  key={col.key || col}
                  style={{
                    fontSize: "0.98rem",
                    color: "var(--text)",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {row[col.key || col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useMemo, useState, useCallback, useEffect, useRef, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  aggregateDebts,
  computeDebtCashAllocation,
  computeLayeredProjection,
  getDebtPayoffDisplayOrder,
  PAYOFF_METHODS,
  ACCELERATION_METHODS,
  AUTO_PROJECTION_CAP_MONTHS
} from "../lib/finance";
import { toCurrency } from "../lib/format";
import {
  appendScenario,
  deleteScenarioById,
  readScenarioList
} from "../lib/localScenarios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const STRATEGY_CALL_URL =
  process.env.NEXT_PUBLIC_STRATEGY_CALL_URL ?? "";

function normalizeSnapshotDebtNumber(v) {
  if (v === "" || v == null) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}

/** Old app default first row; clear only when it still looks like the template (empty name). */
function stripLegacyTemplateDebtRow(d) {
  const name = d.name != null ? String(d.name).trim() : "";
  if (name !== "") return d;
  const b = Number(d.balance);
  const r = Number(d.rate);
  const mp = Number(d.minPayment);
  if (b === 50000 && r === 18 && mp === 500) {
    return { ...d, balance: "", rate: "", minPayment: "" };
  }
  return d;
}

function newDebtRow(id) {
  return {
    id,
    name: "",
    balance: "",
    rate: "",
    minPayment: ""
  };
}

function buildDefaultForm() {
  return {
    client_name: "",
    email: "",
    notes: "",
    monthly_income: "",
    monthly_expenses: "",
    debts: [
      {
        id: "1",
        name: "",
        balance: "",
        rate: "",
        minPayment: ""
      }
    ],
    payoff_method: PAYOFF_METHODS.SNOWBALL,
    acceleration_method: ACCELERATION_METHODS.BANKING,
    use_capital_vehicle: true,
    monthly_policy_contribution: 400,
    annual_policy_growth: 4.5,
    policy_loan_interest_rate: 5.5,
    starting_policy_cash_value: 2500,
    policy_loan_ltv_percent: 90,
    heloc_interest_rate: 8,
    heloc_starting_balance: 0,
    heloc_credit_limit: 0,
    /** Legacy field for older saved scenarios; not shown in UI. Engine does not use it. */
    max_monthly_heloc_draw: 0,
    advanced_projection_years: "",
    amount_toward_debt_strategy: ""
  };
}

/** One empty row for a clean test slate (no sample balances). */
function newBlankDebtRow(id) {
  return {
    id,
    name: "",
    balance: "",
    rate: "",
    minPayment: ""
  };
}

/** Fresh form for quick testing: Standard acceleration, Snowball, blank client, default income/expense & banking defaults. */
/** Label for payoff engine “current target”: prefer stored name, then form debt row name, then “Debt n” — never raw internal ids. */
function payoffTargetLabel(targetName, targetId, debts) {
  const tn = targetName != null ? String(targetName).trim() : "";
  if (tn) return tn;
  if (targetId == null || targetId === "") return "—";
  const idStr = String(targetId);
  if (!Array.isArray(debts) || debts.length === 0) return "—";
  const idx = debts.findIndex((d) => String(d.id) === idStr);
  if (idx < 0) return "—";
  const dn = debts[idx].name != null ? String(debts[idx].name).trim() : "";
  if (dn) return dn;
  return `Debt ${idx + 1}`;
}

function buildTestResetForm() {
  const defaults = buildDefaultForm();
  return {
    ...defaults,
    client_name: "",
    email: "",
    notes: "",
    monthly_income: "",
    monthly_expenses: "",
    debts: [newBlankDebtRow(`d-${Date.now()}`)],
    payoff_method: PAYOFF_METHODS.SNOWBALL,
    acceleration_method: ACCELERATION_METHODS.STANDARD,
    advanced_projection_years: "",
    amount_toward_debt_strategy: ""
  };
}

/** Restore a snapshot from localStorage; fills missing keys from defaults. */
function normalizeFormSnapshot(raw) {
  const base = buildDefaultForm();
  if (!raw || typeof raw !== "object") return base;

  const debtsIn = Array.isArray(raw.debts) ? raw.debts : base.debts;
  const debts =
    debtsIn.length > 0
      ? debtsIn
          .map((d, i) => ({
            id: String(d.id ?? `d-${i}-${Date.now()}`),
            name: d.name != null ? String(d.name) : "",
            balance: normalizeSnapshotDebtNumber(d.balance),
            rate: normalizeSnapshotDebtNumber(d.rate),
            minPayment: normalizeSnapshotDebtNumber(d.minPayment)
          }))
          .map(stripLegacyTemplateDebtRow)
      : [newDebtRow(`d-${Date.now()}`)];

  let monthlyIncomeNorm =
    raw.monthly_income === "" || raw.monthly_income == null
      ? ""
      : Number(raw.monthly_income) || 0;
  let monthlyExpensesNorm =
    raw.monthly_expenses === "" || raw.monthly_expenses == null
      ? ""
      : Number(raw.monthly_expenses) || 0;
  const clientNorm =
    raw.client_name != null ? String(raw.client_name) : base.client_name;
  const emailNorm = raw.email != null ? String(raw.email) : base.email;
  /** Known template/example pairs from older builds or placeholders saved into session. */
  const legacyBlankIncomeExpense =
    (monthlyIncomeNorm === 10000 && monthlyExpensesNorm === 6500) ||
    (monthlyIncomeNorm === 4000 && monthlyExpensesNorm === 1500);
  if (
    String(clientNorm).trim() === "" &&
    String(emailNorm).trim() === "" &&
    legacyBlankIncomeExpense
  ) {
    monthlyIncomeNorm = "";
    monthlyExpensesNorm = "";
  }

  return {
    ...base,
    client_name: clientNorm,
    email: emailNorm,
    notes: raw.notes != null ? String(raw.notes) : base.notes,
    monthly_income: monthlyIncomeNorm,
    monthly_expenses: monthlyExpensesNorm,
    debts,
    payoff_method:
      raw.payoff_method === PAYOFF_METHODS.AVALANCHE
        ? PAYOFF_METHODS.AVALANCHE
        : raw.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE
          ? PAYOFF_METHODS.FASTEST_ROUTE
          : PAYOFF_METHODS.SNOWBALL,
    acceleration_method:
      raw.acceleration_method === ACCELERATION_METHODS.HELOC
        ? ACCELERATION_METHODS.HELOC
        : raw.acceleration_method === ACCELERATION_METHODS.BANKING
          ? ACCELERATION_METHODS.BANKING
          : ACCELERATION_METHODS.STANDARD,
    use_capital_vehicle: Boolean(raw.use_capital_vehicle),
    monthly_policy_contribution:
      Number(raw.monthly_policy_contribution) || base.monthly_policy_contribution,
    annual_policy_growth: Number(raw.annual_policy_growth) || base.annual_policy_growth,
    policy_loan_interest_rate:
      Number(raw.policy_loan_interest_rate) || base.policy_loan_interest_rate,
    starting_policy_cash_value:
      Number(raw.starting_policy_cash_value) || base.starting_policy_cash_value,
    policy_loan_ltv_percent:
      raw.policy_loan_ltv_percent != null &&
      String(raw.policy_loan_ltv_percent).trim() !== ""
        ? Math.min(
            100,
            Math.max(0, Number(raw.policy_loan_ltv_percent) || 0)
          )
        : base.policy_loan_ltv_percent,
    heloc_interest_rate: Number(raw.heloc_interest_rate) || base.heloc_interest_rate,
    heloc_starting_balance:
      Number(raw.heloc_starting_balance) || base.heloc_starting_balance,
    heloc_credit_limit: Number(raw.heloc_credit_limit) || 0,
    max_monthly_heloc_draw:
      Number(raw.max_monthly_heloc_draw) || base.max_monthly_heloc_draw,
    advanced_projection_years:
      raw.advanced_projection_years != null
        ? String(raw.advanced_projection_years)
        : base.advanced_projection_years,
    amount_toward_debt_strategy:
      raw.amount_toward_debt_strategy != null
        ? String(raw.amount_toward_debt_strategy)
        : base.amount_toward_debt_strategy
  };
}

function ProjectionChart({ rows, showPolicy, debtLineLabel, ariaLabel }) {
  if (!rows?.length) return null;

  const w = 960;
  const h = 300;
  const pad = { t: 20, r: 24, b: 40, l: 56 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const n = rows.length;
  const last = rows[n - 1];
  const maxDebt = Math.max(...rows.map((r) => r.debtBalance), 1);
  const maxPol = showPolicy
    ? Math.max(...rows.map((r) => r.policyValue), 1)
    : 0;
  const maxY = Math.max(maxDebt, maxPol, 1);

  const sx = (month) => pad.l + ((month - 1) / Math.max(1, n - 1)) * iw;
  const sy = (v) => pad.t + ih - (v / maxY) * ih;

  const debtPts = rows.map((r) => `${sx(r.month)},${sy(r.debtBalance)}`).join(" ");
  const polPts = showPolicy
    ? rows.map((r) => `${sx(r.month)},${sy(r.policyValue)}`).join(" ")
    : "";

  const ticks = 4;
  const yLabels = [];
  for (let i = 0; i <= ticks; i++) {
    const val = (maxY * (ticks - i)) / ticks;
    yLabels.push({
      y: sy(val),
      label: toCurrency(val)
    });
  }

  const xLabelEnd = `Month ${last.month}`;

  return (
    <div className="chart-card" aria-label={ariaLabel}>
      <svg
        className="projection-svg"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {yLabels.map((t, i) => (
          <g key={i}>
            <line
              x1={pad.l}
              y1={t.y}
              x2={w - pad.r}
              y2={t.y}
              className="chart-grid-line"
            />
            <text x={8} y={t.y + 4} className="chart-axis-label">
              {t.label}
            </text>
          </g>
        ))}
        <polyline fill="none" className="chart-line-debt" points={debtPts} />
        {showPolicy && polPts ? (
          <polyline fill="none" className="chart-line-policy" points={polPts} />
        ) : null}
      </svg>
      <div className="chart-legend">
        <span className="legend-debt">
          <i /> {debtLineLabel}
        </span>
        {showPolicy ? (
          <span className="legend-policy">
            <i /> Banking Strategy net (cash value − policy loan)
          </span>
        ) : null}
        <span className="chart-x-end subtle">{xLabelEnd}</span>
      </div>
    </div>
  );
}

function payoffLabel(m) {
  if (m === PAYOFF_METHODS.AVALANCHE) return "Avalanche";
  if (m === PAYOFF_METHODS.FASTEST_ROUTE) return "Fastest Route";
  return "Snowball";
}

function accelerationLabel(m) {
  if (m === ACCELERATION_METHODS.BANKING) return "Banking Strategy";
  if (m === ACCELERATION_METHODS.HELOC) return "HELOC";
  return "Standard";
}

function CalculatorPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const paid = sessionStorage.getItem("paid_user");
    if (paid === "true") {
      setIsUnlocked(true);
      setIsPremium(true);
    }
  }, []);
  const handleUnlockClick = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setUnlockError("Please enter your email first.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setUnlockError("Please enter a valid email address.");
      return;
    }

    setUnlockError("");

    try {
      const { data: paidLead, error: paidLeadError } = await supabase
        .from("leads")
        .select("plan")
        .eq("email", trimmedEmail.toLowerCase())
        .maybeSingle();

      if (!paidLeadError && paidLead?.plan === "paid") {
        setUnlockError("");
        setIsUnlocked(true);
        setIsPremium(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return;
      }
    } catch (err) {
      console.warn("[leads] paid lookup failed", err);
    }

    console.log("[leads] sending email to GHL:", trimmedEmail);
    fetch("/api/send-to-ghl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: trimmedEmail,
        source: "Debt GPS",
        plan: "free"
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          console.warn("[leads] send-to-ghl failed", res.status, await res.text());
        }
      })
      .catch((err) => {
        console.warn("[leads] send-to-ghl error", err);
      });

    setIsUnlocked(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const [form, setForm] = useState(() => buildDefaultForm());
  const [saveStatus, setSaveStatus] = useState("");
  const [localScenarios, setLocalScenarios] = useState([]);
  const [loadScenarioSelect, setLoadScenarioSelect] = useState("");
  const [deleteScenarioId, setDeleteScenarioId] = useState("");
  const [email, setEmail] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [step1NotesOpen, setStep1NotesOpen] = useState(false);
  /** Step 2: simulated month for Debt Payoff Order / Paid Off Debts timeline (0 = start). */
  const [payoffTimelineCurrentMonth, setPayoffTimelineCurrentMonth] = useState(0);

  useEffect(() => {
    setLocalScenarios(readScenarioList());
  }, []);

  const aggregated = useMemo(() => aggregateDebts(form.debts), [form.debts]);

  /** Step 1: only show strategy-budget availability / warnings after real debt + min payment exist. */
  const step1StrategyBudgetReady = useMemo(
    () =>
      form.debts.some(
        (d) => Number(d.balance) > 0 && Number(d.minPayment) > 0
      ),
    [form.debts]
  );

const hasMeaningfulInputs = useMemo(() => {
  if (aggregated.total <= 0) return false;

  const inc = Number(form.monthly_income) || 0;
  const expRaw = form.monthly_expenses;

  // allow results as soon as debt exists
  if (inc === 0 && (expRaw === "" || expRaw == null)) return false;

  return true;
}, [aggregated.total, form.monthly_income, form.monthly_expenses]);
  
  const cashAllocationPreview = useMemo(
    () =>
      computeDebtCashAllocation(
        Number(form.monthly_income) || 0,
        Number(form.monthly_expenses) || 0,
        aggregated.totalMin,
        form.amount_toward_debt_strategy
      ),
    [
      form.monthly_income,
      form.monthly_expenses,
      aggregated.totalMin,
      form.amount_toward_debt_strategy
    ]
  );

  const projection = useMemo(() => {
    const advRaw = (form.advanced_projection_years || "").trim();
    const advNum = Number(advRaw);
    const advancedProjectionYears =
      advRaw !== "" && Number.isFinite(advNum) && advNum > 0 ? advNum : null;

    return computeLayeredProjection({
      debts: form.debts,
      payoffMethod: form.payoff_method,
      accelerationMethod: form.acceleration_method,
      aggregated,
      monthlyIncome: Number(form.monthly_income) || 0,
      monthlyExpenses: Number(form.monthly_expenses) || 0,
      advancedProjectionYears,
      useCapitalVehicle: form.use_capital_vehicle,
      monthlyPolicyContribution: form.monthly_policy_contribution,
      annualPolicyGrowth: form.annual_policy_growth,
      policyLoanInterestRate: form.policy_loan_interest_rate,
      policyLoanLtvPct: form.policy_loan_ltv_percent,
      startingPolicyCashValue: form.starting_policy_cash_value,
      helocInterestRate: form.heloc_interest_rate,
      helocCreditLimit:
        Number(form.heloc_credit_limit) > 0
          ? form.heloc_credit_limit
          : aggregated.total,
      maxMonthlyHelocDraw: form.max_monthly_heloc_draw,
      startingHelocBalance: form.heloc_starting_balance,
      amountTowardDebtStrategyRaw: form.amount_toward_debt_strategy
    });
  }, [
    form.debts,
    form.payoff_method,
    form.acceleration_method,
    form.monthly_income,
    form.monthly_expenses,
    form.advanced_projection_years,
    form.use_capital_vehicle,
    form.monthly_policy_contribution,
    form.annual_policy_growth,
    form.policy_loan_interest_rate,
    form.policy_loan_ltv_percent,
    form.starting_policy_cash_value,
    form.heloc_interest_rate,
    form.heloc_starting_balance,
    form.heloc_credit_limit,
    form.max_monthly_heloc_draw,
    form.amount_toward_debt_strategy,
    aggregated
  ]);

  const debtPayoffOrder = useMemo(
    () =>
      getDebtPayoffDisplayOrder(
        form.debts,
        projection.effectivePayoffMethod ??
          (form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE
            ? PAYOFF_METHODS.SNOWBALL
            : form.payoff_method)
      ),
    [form.debts, form.payoff_method, projection.effectivePayoffMethod]
  );

  /** Side-by-side compare: same inputs; includes minimum-only and three acceleration paths (engine unchanged). */
  const strategyComparisonProjections = useMemo(() => {
    const advRaw = (form.advanced_projection_years || "").trim();
    const advNum = Number(advRaw);
    const advancedProjectionYears =
      advRaw !== "" && Number.isFinite(advNum) && advNum > 0 ? advNum : null;
    const helocCreditLimit =
      Number(form.heloc_credit_limit) > 0
        ? form.heloc_credit_limit
        : aggregated.total;

    const shared = {
      debts: form.debts,
      aggregated,
      monthlyIncome: Number(form.monthly_income) || 0,
      monthlyExpenses: Number(form.monthly_expenses) || 0,
      advancedProjectionYears,
      useCapitalVehicle: form.use_capital_vehicle,
      monthlyPolicyContribution: form.monthly_policy_contribution,
      annualPolicyGrowth: form.annual_policy_growth,
      policyLoanInterestRate: form.policy_loan_interest_rate,
      policyLoanLtvPct: form.policy_loan_ltv_percent,
      startingPolicyCashValue: form.starting_policy_cash_value,
      helocInterestRate: form.heloc_interest_rate,
      helocCreditLimit,
      maxMonthlyHelocDraw: form.max_monthly_heloc_draw,
      startingHelocBalance: form.heloc_starting_balance,
      amountTowardDebtStrategyRaw: form.amount_toward_debt_strategy
    };

    const minimumCore = computeLayeredProjection({
      ...shared,
      payoffMethod: PAYOFF_METHODS.SNOWBALL,
      accelerationMethod: ACCELERATION_METHODS.STANDARD,
      amountTowardDebtStrategyRaw: 0
    });

    return {
      minimum: { ...minimumCore, interestSaved: 0 },
      standardSnowball: computeLayeredProjection({
        ...shared,
        payoffMethod: PAYOFF_METHODS.SNOWBALL,
        accelerationMethod: ACCELERATION_METHODS.STANDARD
      }),
      standardAvalanche: computeLayeredProjection({
        ...shared,
        payoffMethod: PAYOFF_METHODS.AVALANCHE,
        accelerationMethod: ACCELERATION_METHODS.STANDARD
      }),
      banking: computeLayeredProjection({
        ...shared,
        payoffMethod: PAYOFF_METHODS.SNOWBALL,
        accelerationMethod: ACCELERATION_METHODS.BANKING
      }),
      heloc: computeLayeredProjection({
        ...shared,
        payoffMethod: PAYOFF_METHODS.SNOWBALL,
        accelerationMethod: ACCELERATION_METHODS.HELOC
      })
    };
  }, [
    form.debts,
    form.payoff_method,
    form.monthly_income,
    form.monthly_expenses,
    form.advanced_projection_years,
    form.use_capital_vehicle,
    form.monthly_policy_contribution,
    form.annual_policy_growth,
    form.policy_loan_interest_rate,
    form.policy_loan_ltv_percent,
    form.starting_policy_cash_value,
    form.heloc_interest_rate,
    form.heloc_starting_balance,
    form.heloc_credit_limit,
    form.max_monthly_heloc_draw,
    form.amount_toward_debt_strategy,
    aggregated
  ]);

  const {
    schedule,
    surplus,
    availableForStrategy,
    appliedTowardStrategy,
    budgetExtraDebtPayoff,
    appliedExceedsAvailableForStrategy,
    policyContributionExceedsAppliedStrategy,
    interestSavedVsMinimum,
    monthlyPaymentToDebt,
    policyContrib,
    endingNetPolicyEquity,
    endingHelocBalance,
    simulationMonths,
    hitProjectionCap,
    projectionMaxMonths,
    consumerDebtFreeMonth,
    bankingPayoffWarning,
    bankingPayoffTriggerMonth1,
    bankingStateLatest,
    cumulativePolicyLoanPrincipalPaid,
    helocPayoffTriggerMonth1,
    helocStateLatest,
    totalHelocInterestPaid,
    consumerDebtPayoffMonthById,
    totalInterestPaid: totalInterest
  } = projection;

  const maxPayoffMonthFromProjection = useMemo(() => {
    const m = consumerDebtPayoffMonthById;
    if (!m || typeof m !== "object") return 0;
    let max = 0;
    for (const k of Object.keys(m)) {
      const v = m[k];
      if (typeof v === "number" && Number.isFinite(v) && v > max) max = v;
    }
    return Math.max(0, Math.floor(max));
  }, [consumerDebtPayoffMonthById]);

  const payoffTimelineNextDebtId = useMemo(() => {
    const map = consumerDebtPayoffMonthById;
    const month = payoffTimelineCurrentMonth;
    for (const d of debtPayoffOrder) {
      const pm = map?.[d.id];
      const paidThrough = pm != null && pm <= month;
      if (!paidThrough) return d.id;
    }
    return null;
  }, [debtPayoffOrder, consumerDebtPayoffMonthById, payoffTimelineCurrentMonth]);

  useEffect(() => {
    setPayoffTimelineCurrentMonth((mc) =>
      Math.max(0, Math.min(mc, maxPayoffMonthFromProjection))
    );
  }, [maxPayoffMonthFromProjection]);

  const rows = schedule.rows;
  const debtFreeMonth = schedule.debtFreeMonth;
  const finalPolicy = endingNetPolicyEquity;

  const strategy = Number(form.amount_toward_debt_strategy);
  const shouldShowError =
    Number.isFinite(strategy) &&
    strategy > 0 &&
    Number(form.monthly_policy_contribution) > strategy;

  const capYearsLabel = Math.round(projectionMaxMonths / 12);
  const bankingActive =
    form.acceleration_method === ACCELERATION_METHODS.BANKING &&
    form.use_capital_vehicle;
  const isBankingAcceleration =
    form.acceleration_method === ACCELERATION_METHODS.BANKING;
  const helocAcceleration =
    form.acceleration_method === ACCELERATION_METHODS.HELOC;
  const hasHelocLimit = Number(form.heloc_credit_limit) > 0;
  const timelineDebtFreeMonth =
    bankingActive && consumerDebtFreeMonth != null
      ? consumerDebtFreeMonth
      : debtFreeMonth;

  const formatDebtFreeMonths = (m) =>
    m != null ? `${m} mo (${(m / 12).toFixed(1)} yr)` : null;
  const debtTimelineCapOrDash = hitProjectionCap
    ? `Not cleared within ${capYearsLabel}-yr cap`
    : "—";

  const formatStrategyComparisonTimeline = (p, which) => {
    if (p.policyContributionExceedsAppliedStrategy) return "—";
    const m =
      which === "consumer"
        ? p.consumerDebtFreeMonth
        : p.schedule.debtFreeMonth;
    const formatted = formatDebtFreeMonths(m);
    if (formatted) return formatted;
    const capY = Math.round(p.projectionMaxMonths / 12);
    return p.hitProjectionCap ? `Not cleared within ${capY}-yr cap` : "—";
  };

  const renderStrategyComparisonTimelineInCards = (p, which) => {
    if (p.policyContributionExceedsAppliedStrategy) return "—";

    const m =
      which === "consumer"
        ? p.consumerDebtFreeMonth
        : p.schedule.debtFreeMonth;

    if (m === null || m === undefined) return "—";

    return (
      <span className="strategy-comparison-timeline-value">
        <span className="strategy-comparison-timeline-line">{m} mo</span>
        <span className="strategy-comparison-timeline-line">
          {(m / 12).toFixed(1)} yr
        </span>
      </span>
    );
  };

  const showPolicySeries =
    bankingActive &&
    (policyContrib > 0 ||
      finalPolicy > 0 ||
      (Number(form.starting_policy_cash_value) || 0) > 0);

  const chartDebtLineLabel = helocAcceleration
    ? "Total Balance (Consumer + HELOC)"
    : "Consumer debt balance";
  const chartAriaLabel = helocAcceleration
    ? "Total balance: consumer debt plus HELOC, by month"
    : showPolicySeries
      ? "Consumer debt and Banking Strategy net equity, by month"
      : "Consumer debt balance, by month";

  const scenarioSummary = `${payoffLabel(form.payoff_method)} · ${accelerationLabel(form.acceleration_method)}`;

  /** Ranks strategy-comparison scenarios by modeled consumer debt-free month, then interest saved, then total debt-free month. */
  const step2RecommendationRanking = useMemo(() => {
    const scenarioLabels = {
      standardSnowball: "Snowball (Standard)",
      standardAvalanche: "Avalanche (Standard)",
      banking: "Banking Strategy",
      heloc: "HELOC"
    };

    const scp = strategyComparisonProjections;
    const scenarios = [
      { id: "standardSnowball", projection: scp.standardSnowball },
      { id: "standardAvalanche", projection: scp.standardAvalanche },
      { id: "banking", projection: scp.banking },
      { id: "heloc", projection: scp.heloc }
    ];

    const isValid = (s) => {
      if (aggregated.total <= 0) return false;
      if (
        s.id === "banking" &&
        s.projection.policyContributionExceedsAppliedStrategy
      ) {
        return false;
      }
      if (s.id === "heloc" && !hasHelocLimit) return false;
      return true;
    };

    const sortKey = (p) => {
      const c = p.consumerDebtFreeMonth;
      const t = p.schedule?.debtFreeMonth;
      const interest = Number(p.interestSavedVsMinimum) || 0;
      const consumerM =
        c != null && Number.isFinite(c) ? c : Number.POSITIVE_INFINITY;
      const totalM =
        t != null && Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
      return [consumerM, -interest, totalM];
    };

    const compare = (a, b) => {
      const ka = sortKey(a.projection);
      const kb = sortKey(b.projection);
      for (let i = 0; i < 3; i++) {
        if (ka[i] !== kb[i]) return ka[i] - kb[i];
      }
      return 0;
    };

    const valid = scenarios.filter(isValid);
    const ranked = [...valid].sort(compare);

    const standardOnly = scenarios.filter(
      (s) =>
        isValid(s) &&
        (s.id === "standardSnowball" || s.id === "standardAvalanche")
    );
    const rankedStd = [...standardOnly].sort(compare);

    const bankingScenario = scenarios.find((s) => s.id === "banking");
    const bankingValid = !!(bankingScenario && isValid(bankingScenario));

    let bestOverall;
    let nextBestOverall;
    if (bankingValid) {
      bestOverall = bankingScenario;
      nextBestOverall = ranked.find((s) => s.id !== "banking") ?? null;
    } else {
      bestOverall = ranked[0] ?? null;
      nextBestOverall = ranked[1] ?? null;
    }

    return {
      scenarioLabels,
      bestOverall,
      nextBestOverall,
      bestStandardAccelerated: rankedStd[0] ?? null,
      labelFor: (id) => scenarioLabels[id] ?? id
    };
  }, [strategyComparisonProjections, aggregated.total, hasHelocLimit]);

  const strategyComparisonRankBadge = useMemo(() => {
    const { bestOverall, nextBestOverall } = step2RecommendationRanking;
    const forId = (id) => {
      if (bestOverall?.id === id) return { text: "Best", tone: "best" };
      if (nextBestOverall?.id === id) return { text: "Next Best", tone: "next" };
      return null;
    };
    return {
      standardSnowball: forId("standardSnowball"),
      standardAvalanche: forId("standardAvalanche"),
      heloc: forId("heloc"),
      banking: forId("banking")
    };
  }, [step2RecommendationRanking]);

  const strategyComparisonRankBadgeSx = {
    base: {
      display: "inline-block",
      marginLeft: 6,
      padding: "2px 7px",
      borderRadius: 6,
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      verticalAlign: "0.12em",
      lineHeight: 1.2
    },
    best: { background: "rgba(29, 107, 196, 0.12)", color: "var(--accent)" },
    next: { background: "rgba(100, 116, 139, 0.16)", color: "#475569" }
  };

  const renderStrategyComparisonRankBadge = (scenarioKey) => {
    const b = strategyComparisonRankBadge[scenarioKey];
    if (!b) return null;
    return (
      <span
        style={{
          ...strategyComparisonRankBadgeSx.base,
          ...(b.tone === "best"
            ? strategyComparisonRankBadgeSx.best
            : strategyComparisonRankBadgeSx.next)
        }}
      >
        {b.text}
      </span>
    );
  };

  const selectedComparisonScenarioKey = useMemo(() => {
    if (form.acceleration_method === ACCELERATION_METHODS.BANKING) {
      return "banking";
    }
    if (form.acceleration_method === ACCELERATION_METHODS.HELOC) {
      return "heloc";
    }
    if (form.payoff_method === PAYOFF_METHODS.AVALANCHE) {
      return "standardAvalanche";
    }
    if (form.payoff_method === PAYOFF_METHODS.SNOWBALL) {
      return "standardSnowball";
    }
    if (form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE) {
      return projection.effectivePayoffMethod === PAYOFF_METHODS.AVALANCHE
        ? "standardAvalanche"
        : "standardSnowball";
    }
    return "standardSnowball";
  }, [
    form.acceleration_method,
    form.payoff_method,
    projection.effectivePayoffMethod
  ]);

  const currentSelectionStatusMessage = useMemo(() => {
    const { bestOverall, nextBestOverall } = step2RecommendationRanking;
    const sel = selectedComparisonScenarioKey;

    if (!isPremium && (sel === "banking" || sel === "heloc")) {
      return "Advanced strategy available after unlock.";
    }
    if (form.acceleration_method === ACCELERATION_METHODS.BANKING) {
      return "You are currently viewing the recommended long-term strategy.";
    }
    if (bestOverall && sel === bestOverall.id) {
      return "You are currently viewing the recommended path for this comparison.";
    }
    if (nextBestOverall && sel === nextBestOverall.id) {
      return "You are currently viewing the strongest alternative option.";
    }
    return isPremium
      ? "You are viewing another payoff path (for example Standard acceleration or HELOC). It can still work well—it is simply not ranked #1 or #2 for your numbers in this model."
      : "You are viewing another payoff path. It can still work well—it is simply not ranked #1 or #2 for your numbers in this model.";
  }, [
    isPremium,
    form.acceleration_method,
    step2RecommendationRanking,
    selectedComparisonScenarioKey
  ]);

  const displayScenarioLabel = (id) =>
    !isPremium && (id === "banking" || id === "heloc")
      ? "Advanced strategy available after unlock"
      : step2RecommendationRanking.labelFor(id);

  const formatRankingScenarioMetrics = (scenarioId, p) => {
    if (!p) return "—";
    if (!isPremium && (scenarioId === "banking" || scenarioId === "heloc")) {
      return "--";
    }
    const capY = Math.round(p.projectionMaxMonths / 12);
    const consumerLine =
      formatDebtFreeMonths(p.consumerDebtFreeMonth) ??
      (p.hitProjectionCap
        ? `Not cleared within ${capY}-yr cap (consumer)`
        : "—");
    return `${consumerLine} · Interest saved ${toCurrency(p.interestSavedVsMinimum ?? 0)}`;
  };

  const updateField = useCallback((name, value) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: [
          "client_name",
          "email",
          "notes",
          "monthly_income",
          "monthly_expenses",
          "payoff_method",
          "acceleration_method",
          "advanced_projection_years",
          "amount_toward_debt_strategy"
        ].includes(name)
          ? value
          : name === "use_capital_vehicle"
            ? Boolean(value)
            : Number(value)
      };

      if (name !== "monthly_income" && name !== "monthly_expenses") {
        return next;
      }

      if (!next.monthly_income || !next.monthly_expenses) {
        next.amount_toward_debt_strategy = "";
        return next;
      }

      const incomeRaw = String(next.monthly_income ?? "").trim();
      const expensesRaw = String(next.monthly_expenses ?? "").trim();

      if (incomeRaw === "" || expensesRaw === "") {
        return { ...next, amount_toward_debt_strategy: "" };
      }

      const income = Number(incomeRaw);
      const expenses = Number(expensesRaw);
      if (!Number.isFinite(income) || !Number.isFinite(expenses)) {
        return next;
      }

      // Do not auto-fill Monthly Strategy Budget from income − expenses (user enters it;
      // projection still treats blank as "use full available" via computeDebtCashAllocation).
      return next;
    });
  }, []);

  const updateDebt = useCallback((id, field, raw) => {
    setForm((prev) => ({
      ...prev,
      debts: prev.debts.map((d) =>
        d.id === id
          ? {
              ...d,
              [field]: raw
            }
          : d
      )
    }));
  }, []);

  const addDebt = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      debts: [...prev.debts, newDebtRow(`d-${Date.now()}`)]
    }));
  }, []);

  const removeDebt = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      debts: prev.debts.length > 1 ? prev.debts.filter((d) => d.id !== id) : prev.debts
    }));
  }, []);

  async function saveScenario() {
    const defaultName =
      (form.client_name || "").trim() ||
      `Scenario ${new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
    const name =
      typeof window !== "undefined"
        ? window.prompt("Scenario name (saved in this browser):", defaultName)
        : null;
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setSaveStatus("error|Please enter a scenario name.");
      return;
    }

    try {
      const next = appendScenario(trimmed, form);
      setLocalScenarios(next);
    } catch (e) {
      setSaveStatus(`error|Could not save locally: ${e?.message || "unknown error"}`);
      return;
    }

    if (!supabase) {
      setSaveStatus(`success|Saved locally: ${trimmed}`);
      return;
    }

    setSaveStatus("saving|Saved locally; syncing to cloud…");
    const poolLine = isBankingAcceleration
      ? `Cash flow after contribution (modeled): ${budgetExtraDebtPayoff}`
      : `Extra above minimums (modeled): ${budgetExtraDebtPayoff}`;
    const noteExtra = `\n\n---\nPayoff: ${payoffLabel(form.payoff_method)}\nAcceleration: ${accelerationLabel(form.acceleration_method)}\nMonthly income: ${form.monthly_income}\nLiving expenses (excluding debt payments): ${form.monthly_expenses}\nAvailable for strategy: ${availableForStrategy}\nApplied toward strategy: ${appliedTowardStrategy}\nBanking Strategy contribution: ${policyContrib}\n${poolLine}\nBanking Strategy capital vehicle: ${form.use_capital_vehicle ? "yes" : "no"}\nLocal scenario name: ${trimmed}`;
    const payload = {
      client_name: form.client_name || null,
      email: form.email || null,
      notes: (form.notes || "") + noteExtra,
      total_debt: Math.round(aggregated.total),
      interest_rate: Math.round(aggregated.weightedRate * 10) / 10,
      current_monthly_payment: Math.round(monthlyPaymentToDebt),
      redirect_payment: 0,
      monthly_policy_contribution: Math.round(policyContrib),
      annual_policy_growth: Number(form.annual_policy_growth) || 0,
      projection_years: Math.max(1, Math.ceil(simulationMonths / 12)),
      debt_free_month: timelineDebtFreeMonth,
      projected_policy_value: Math.round(endingNetPolicyEquity),
      interest_saved: Math.round(interestSavedVsMinimum)
    };
    const { error } = await supabase.from("client_scenarios").insert([payload]);
    if (error) {
      setSaveStatus(
        `success|Saved locally as "${trimmed}". Cloud sync failed: ${error.message}`
      );
      return;
    }
    setSaveStatus(`success|Saved locally as "${trimmed}" and synced to cloud.`);
  }

  function handleLoadScenario(e) {
    const id = e.target.value;
    setLoadScenarioSelect(id);
    if (!id) return;
    const entry = localScenarios.find((s) => s.id === id);
    setLoadScenarioSelect("");
    if (entry?.form) {
      setForm(normalizeFormSnapshot(entry.form));
      setSaveStatus(`success|Loaded "${entry.name}".`);
    } else {
      setSaveStatus("error|Could not load that scenario.");
    }
  }

  function handleDeleteScenario() {
    if (!deleteScenarioId) return;
    const entry = localScenarios.find((s) => s.id === deleteScenarioId);
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Delete saved scenario "${entry?.name || "this scenario"}"?`
      )
    ) {
      return;
    }
    setLocalScenarios(deleteScenarioById(deleteScenarioId));
    setDeleteScenarioId("");
    setSaveStatus("success|Removed saved scenario.");
  }

  const handleResetTestScenario = useCallback(() => {
    console.log("RESET CLICKED");
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Reset the form to a blank test scenario? Saved scenarios in this browser are not deleted."
      )
    ) {
      return;
    }
    const next = { ...buildTestResetForm(), amount_toward_debt_strategy: "" };
    console.log("RESET NEXT", next);
    setForm(next);
    setLoadScenarioSelect("");
    setDeleteScenarioId("");
    setSaveStatus("success|Form reset — ready for a new test case.");
  }, []);

  const statusType = saveStatus.split("|")[0];
  const statusText = saveStatus.split("|")[1] || "";

  return (
    <main className="page dashboard">
      <header className="hero hero-dashboard">
        <div className="hero-inner" style={{ maxWidth: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <div style={{ flex: 1, maxWidth: "760px" }}>
              <p className="hero-eyebrow">Financial Strategy Dashboard</p>
              <h1 style={{ margin: 0, minWidth: 0 }}>
                Debt GPS System
              </h1>
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(1.02rem, 2.1vw, 1.125rem)",
                  lineHeight: 1.55,
                  opacity: 0.96,
                  maxWidth: "680px",
                  fontWeight: 550,
                  letterSpacing: "-0.01em",
                }}
              >
                Help clients eliminate debt faster, compare payoff strategies, and see how
                capital-building approaches like Banking Strategy and HELOC can change the
                outcome.
              </p>
              <p
                className="hero-lead"
                style={{
                  margin: "0 0 6px",
                  fontSize: "0.98rem",
                  lineHeight: 1.6,
                  opacity: 0.88,
                  maxWidth: "640px",
                }}
              >
                A dedicated modeling workspace: set debt order, acceleration rules, and
                monthly cash-flow behavior, then watch projections respond in real time.
                When you are ready to continue, open a saved scenario to pick up where you
                left off.
              </p>
              <div style={{ marginTop: 18 }}>
                <Link
                  href="https://calendly.com/debsaisolutions/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: "#111827",
                    color: "#ffffff",
                    padding: "10px 16px",
                    borderRadius: 10,
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: 14
                  }}
                >
                  Book Your Free Strategy Call
                </Link>
              </div>
              <div className="top-actions">
                <Link className="button-link ghost" href="/scenarios">
                  Saved scenarios
                </Link>
              </div>
            </div>
            <div
              style={{
                width: "220px",
                minWidth: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Link
                href="/"
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  lineHeight: 0,
                }}
                aria-label="True Freedom Financial home"
              >
                <Image
                  src="/logo.png"
                  alt="True Freedom Financial"
                  height={240}
                  width={240}
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="step-indicator">
        <div className="step-dot active">
          <span>1</span> Inputs
        </div>
        <div className="step-line" />
        <div className="step-dot active">
          <span>2</span> Live results
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card step-card" aria-labelledby="step1-heading">
          <div className="step-badge">Step 1</div>
          <h2 id="step1-heading">Your numbers</h2>

          <div className="local-scenarios-panel step1-scenario-controls">
            <p className="help tight local-scenarios-lead">
              Your progress saves automatically on this device. You can come back
              anytime and continue where you left off.
            </p>
            <p
              className="help tight"
              style={{
                marginTop: 4,
                marginBottom: 12,
                fontWeight: 600,
                color: "var(--text)",
                fontSize: "0.875rem",
                lineHeight: 1.45
              }}
            >
              First time here? Skip this and start entering your numbers below.
            </p>
            <div className="local-scenarios-controls">
              <div className="field load-scenario-field">
                <label htmlFor="load-local-scenario">Continue where you left off</label>
                <select
                  id="load-local-scenario"
                  value={loadScenarioSelect}
                  onChange={handleLoadScenario}
                >
                  <option value="">— Choose a saved scenario —</option>
                  {[...localScenarios]
                    .sort(
                      (a, b) =>
                        new Date(b.savedAt).getTime() -
                        new Date(a.savedAt).getTime()
                    )
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="field delete-scenario-field">
                <label htmlFor="delete-local-scenario">Delete a saved plan</label>
                <select
                  id="delete-local-scenario"
                  value={deleteScenarioId}
                  onChange={(e) => setDeleteScenarioId(e.target.value)}
                >
                  <option value="">— Select to remove —</option>
                  {[...localScenarios]
                    .sort(
                      (a, b) =>
                        new Date(b.savedAt).getTime() -
                        new Date(a.savedAt).getTime()
                    )
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="button"
                className="button-danger-outline"
                disabled={!deleteScenarioId}
                onClick={handleDeleteScenario}
              >
                Delete
              </button>
            </div>
          </div>

          {statusText ? (
            <div
              className={`status ${
                statusType === "success"
                  ? "success"
                  : statusType === "error"
                    ? "error"
                    : ""
              }`}
            >
              {statusText}
            </div>
          ) : null}

          <div className="form-grid">
            <div className="field">
              <label>Client name</label>
              <input
                value={form.client_name || ""}
                onChange={(e) => updateField("client_name", e.target.value)}
                placeholder="e.g. Jane Smith"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="e.g. jane@email.com"
                autoComplete="off"
              />
            </div>
            <div className="field full">
              <div
                role="note"
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(29, 107, 196, 0.28)",
                  borderLeft: "4px solid rgba(29, 107, 196, 0.6)",
                  background: "rgba(29, 107, 196, 0.1)"
                }}
              >
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.55,
                    color: "var(--text)",
                    fontSize: 15,
                    fontWeight: 600
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(29, 107, 196, 0.18)",
                      color: "#1d4ed8",
                      fontWeight: 700,
                      fontSize: 13.5,
                      letterSpacing: "0.4px",
                      marginRight: 8
                    }}
                  >
                    START HERE
                  </span>
                  Enter your income, expenses, and debts to calculate your payoff strategy.
                </p>
              </div>
            </div>
            <div className="field">
              <label>Monthly income ($)</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280"
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={form.monthly_income || ""}
                  onChange={(e) => updateField("monthly_income", e.target.value)}
                  placeholder="Enter monthly income"
                  autoComplete="off"
                  style={{ paddingLeft: 24 }}
                />
              </div>
            </div>
            <div className="field">
              <label>Living expenses ($)</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280"
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={form.monthly_expenses || ""}
                  onChange={(e) => updateField("monthly_expenses", e.target.value)}
                  placeholder="Enter living expenses (no debt payments)"
                  autoComplete="off"
                  style={{ paddingLeft: 24 }}
                />
              </div>
            </div>
          </div>

          {step1StrategyBudgetReady && appliedExceedsAvailableForStrategy ? (
            <div className="inline-warn" role="alert">
              Amount exceeds available for strategy
            </div>
          ) : null}

          <div className="debt-section-header">
            <div className="debt-section-header-text">
              <h3 className="subsection-title debt-section-title">Debts</h3>
              <p className="help tight">
                Outside obligations first—your payoff approach only affects the order
                extra cash attacks balances after all active minimums are paid.
              </p>
            </div>
          </div>
          <div className="debt-list">
            {form.debts.map((d, idx) => (
              <div key={d.id} className="debt-row">
                <div className="field debt-name">
                  <label>{idx === 0 ? "Description" : `Debt ${idx + 1}`}</label>
                  <input
                    value={d.name}
                    onChange={(e) => updateDebt(d.id, "name", e.target.value)}
                    placeholder="Card / loan"
                  />
                </div>
                <div className="field">
                  <label>Balance ($)</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6b7280"
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={d.balance || ""}
                      onChange={(e) => updateDebt(d.id, "balance", e.target.value)}
                      placeholder="e.g. 15000"
                      style={{ paddingLeft: 24 }}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>APR %</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={d.rate || ""}
                    onChange={(e) => updateDebt(d.id, "rate", e.target.value)}
                    placeholder="e.g. 18.99"
                  />
                </div>
                <div className="field">
                  <label>Min. payment ($)</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6b7280"
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={d.minPayment || ""}
                      onChange={(e) => updateDebt(d.id, "minPayment", e.target.value)}
                      placeholder="e.g. 300"
                      style={{ paddingLeft: 24 }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="icon-remove"
                  onClick={() => removeDebt(d.id)}
                  disabled={form.debts.length < 2}
                  aria-label="Remove debt"
                  title="Remove debt"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="button-link quiet" onClick={addDebt}>
            + Add debt
          </button>

          <div className="field full">
            <label>Monthly Strategy Budget (Flexible)</label>
            <p className="help tight">
              This is the amount you choose to apply toward your strategy each month.
              It can be adjusted anytime based on your situation.
            </p>
            <p className="help tight">
              {isBankingAcceleration
                ? "Used to fund your policy and support the Banking Strategy. Debt payoff occurs through policy loans and redirected payments — not direct extra payments."
                : "Used as extra payment above minimums for Snowball or Avalanche payoff."}
            </p>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280"
                }}
              >
                $
              </span>
              <input
                type="number"
                min={0}
                placeholder={
                  step1StrategyBudgetReady
                    ? `Leave blank to use full amount (${toCurrency(cashAllocationPreview.availableForStrategy)})`
                    : "Enter your debts to calculate your strategy budget."
                }
                value={form.amount_toward_debt_strategy}
                onChange={(e) =>
                  updateField("amount_toward_debt_strategy", e.target.value)
                }
                style={{ paddingLeft: 24 }}
              />
            </div>
            {step1StrategyBudgetReady ? (
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
                Available for strategy: {toCurrency(availableForStrategy)}
                <div>(income - expenses - minimum payments)</div>
              </div>
            ) : (
              <p className="help tight" style={{ marginTop: 6 }}>
                Enter your debts to calculate your strategy budget.
              </p>
            )}

            {step1StrategyBudgetReady && appliedExceedsAvailableForStrategy ? (
              <div style={{ fontSize: 13, color: "#DC2626", marginTop: 6 }}>
                You’re trying to use{" "}
                {toCurrency(Number(form.amount_toward_debt_strategy) || 0)} but only{" "}
                {toCurrency(availableForStrategy)} is available after required minimum
                payments.
              </div>
            ) : null}

          <div
            className="standard-payoff-compare-panel"
            aria-label="Compare your Snowball and Avalanche payoff options"
          >
            <h4 className="panel-title standard-payoff-compare-heading">
              Compare Your Payoff Options
            </h4>
            <p className="help tight standard-payoff-compare-lead">
              {isPremium ? (
                <>
                  See which payoff option gets you out of debt faster.
                  <br />
                  Then choose how you want to accelerate it.
                  <br />
                  Same numbers you entered above—timeline and interest saved for each
                  approach, side by side. Use the buttons below or choose Fastest Route next;
                  Step 2 updates immediately.
                </>
              ) : (
                <>
                  Pick how you want consumer debts ordered. Full timelines and interest
                  comparisons appear in Step 2 after you continue.
                </>
              )}
            </p>
              <div className="standard-payoff-compare-grid">
                <div
                  className={`standard-payoff-compare-card${
                    form.payoff_method === PAYOFF_METHODS.SNOWBALL ||
                    (form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE &&
                      projection.effectivePayoffMethod === PAYOFF_METHODS.SNOWBALL)
                      ? " standard-payoff-compare-card--current"
                      : ""
                  }`}
                >
                  <h5 className="standard-payoff-compare-title">Snowball</h5>
                  <p className="standard-payoff-compare-sub subtle">
                    Smallest balance first
                  </p>
                  {isPremium ? (
                    <dl className="standard-payoff-compare-dl">
                      <div className="standard-payoff-compare-metric">
                        <dt>Consumer Debt-Free Timeline</dt>
                        <dd>
                          {formatStrategyComparisonTimeline(
                            strategyComparisonProjections.standardSnowball,
                            "consumer"
                          )}
                        </dd>
                      </div>
                      <div className="standard-payoff-compare-metric">
                        <dt>Interest saved</dt>
                        <dd>
                          {toCurrency(
                            strategyComparisonProjections.standardSnowball
                              .interestSavedVsMinimum
                          )}
                        </dd>
                      </div>
                    </dl>
                  ) : null}
                  <button
                    type="button"
                    className="primary standard-payoff-compare-action"
                    onClick={() =>
                      updateField("payoff_method", PAYOFF_METHODS.SNOWBALL)
                    }
                  >
                    Use Snowball
                  </button>
                </div>
                <div
                  className={`standard-payoff-compare-card${
                    form.payoff_method === PAYOFF_METHODS.AVALANCHE ||
                    (form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE &&
                      projection.effectivePayoffMethod === PAYOFF_METHODS.AVALANCHE)
                      ? " standard-payoff-compare-card--current"
                      : ""
                  }`}
                >
                  <h5 className="standard-payoff-compare-title">Avalanche</h5>
                  <p className="standard-payoff-compare-sub subtle">
                    Highest APR first
                  </p>
                  {isPremium ? (
                    <dl className="standard-payoff-compare-dl">
                      <div className="standard-payoff-compare-metric">
                        <dt>Consumer Debt-Free Timeline</dt>
                        <dd>
                          {formatStrategyComparisonTimeline(
                            strategyComparisonProjections.standardAvalanche,
                            "consumer"
                          )}
                        </dd>
                      </div>
                      <div className="standard-payoff-compare-metric">
                        <dt>Interest saved</dt>
                        <dd>
                          {toCurrency(
                            strategyComparisonProjections.standardAvalanche
                              .interestSavedVsMinimum
                          )}
                        </dd>
                      </div>
                    </dl>
                  ) : null}
                  <button
                    type="button"
                    className="primary standard-payoff-compare-action"
                    onClick={() =>
                      updateField("payoff_method", PAYOFF_METHODS.AVALANCHE)
                    }
                  >
                    Use Avalanche
                  </button>
                </div>
              </div>
            </div>

          <h3 className="subsection-title">Choose Your Payoff Approach</h3>
          <p className="help tight">
            Ordering for consumer debt: smallest balance first (Snowball), highest APR
            first (Avalanche), or Fastest Route (the model runs both and uses whichever
            reaches total debt-free sooner; ties default to Snowball).
          </p>
          <div
            className="strategy-select"
            role="group"
            aria-label="Choose your payoff approach"
          >
            <button
              type="button"
              className={
                form.payoff_method === PAYOFF_METHODS.SNOWBALL ? "pill active" : "pill"
              }
              onClick={() => updateField("payoff_method", PAYOFF_METHODS.SNOWBALL)}
            >
              Snowball
            </button>
            <button
              type="button"
              className={
                form.payoff_method === PAYOFF_METHODS.AVALANCHE
                  ? "pill active"
                  : "pill"
              }
              onClick={() => updateField("payoff_method", PAYOFF_METHODS.AVALANCHE)}
            >
              Avalanche
            </button>
            <button
              type="button"
              className={
                form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE
                  ? "pill active"
                  : "pill"
              }
              onClick={() =>
                updateField("payoff_method", PAYOFF_METHODS.FASTEST_ROUTE)
              }
            >
              Fastest Route
            </button>
          </div>

          <h3 className="subsection-title">Acceleration Options</h3>
          <p className="help tight">
            Standard (baseline) uses income − living expenses for debt only. Banking
            Strategy adds contributions, cash value growth, and policy-loan access.
            HELOC models the line as your cash-flow hub: income pays it down, expenses
            and consumer payoffs use available credit, with interest on the balance.
          </p>
          <div
            className="strategy-select strategy-select-wide"
            role="group"
            aria-label="Acceleration options"
          >
            <button
              type="button"
              className={
                form.acceleration_method === ACCELERATION_METHODS.STANDARD
                  ? "pill active"
                  : "pill"
              }
              onClick={() =>
                updateField("acceleration_method", ACCELERATION_METHODS.STANDARD)
              }
            >
              Standard (baseline)
            </button>
            {isPremium ? (
              <>
            <button
              type="button"
              className={
                form.acceleration_method === ACCELERATION_METHODS.BANKING
                  ? "pill active"
                  : "pill"
              }
              onClick={() =>
                updateField("acceleration_method", ACCELERATION_METHODS.BANKING)
              }
            >
              Banking Strategy
            </button>
            <button
              type="button"
              className={
                form.acceleration_method === ACCELERATION_METHODS.HELOC
                  ? "pill active"
                  : "pill"
              }
              onClick={() =>
                updateField("acceleration_method", ACCELERATION_METHODS.HELOC)
              }
            >
              HELOC
            </button>
              </>
            ) : null}
          </div>

          {isPremium && form.acceleration_method === ACCELERATION_METHODS.BANKING ? (
            <div className="banking-panel">
              <h4 className="panel-title">Banking Strategy inputs</h4>
              <div className="field checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.use_capital_vehicle}
                    onChange={(e) =>
                      updateField("use_capital_vehicle", e.target.checked)
                    }
                  />
                  <span>
                    Include Banking Strategy capital vehicle (whole life or similar)
                  </span>
                </label>
              </div>

              <div
                className={
                  bankingActive ? "form-grid banking-grid" : "form-grid muted-block"
                }
              >
                <div className="field">
                  <label>Monthly Banking Strategy contribution</label>
                  <input
                    type="number"
                    min={0}
                    disabled={!bankingActive}
                    value={form.monthly_policy_contribution}
                    onChange={(e) =>
                      updateField("monthly_policy_contribution", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Annual cash value growth %</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    disabled={!bankingActive}
                    value={form.annual_policy_growth}
                    onChange={(e) =>
                      updateField("annual_policy_growth", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Loan interest rate % (policy loan)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    disabled={!bankingActive}
                    value={form.policy_loan_interest_rate}
                    onChange={(e) =>
                      updateField("policy_loan_interest_rate", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Starting illustrated cash value</label>
                  <input
                    type="number"
                    min={0}
                    disabled={!bankingActive}
                    value={form.starting_policy_cash_value}
                    onChange={(e) =>
                      updateField("starting_policy_cash_value", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Loan-to-Value % (Borrowing Limit)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    disabled={!bankingActive}
                    value={form.policy_loan_ltv_percent}
                    onChange={(e) =>
                      updateField("policy_loan_ltv_percent", e.target.value)
                    }
                  />
                </div>
              </div>
              {isPremium && bankingActive && shouldShowError ? (
                <div className="inline-warn" role="alert">
                  Banking Strategy contribution cannot exceed the amount applied
                  toward strategy.
                </div>
              ) : null}
              {bankingActive &&
              !policyContributionExceedsAppliedStrategy &&
              bankingPayoffWarning ? (
                <div className="inline-warn" role="alert">
                  This contribution level may slow payoff unless policy capital is
                  actively deployed.
                </div>
              ) : null}
              {!bankingActive ? (
                <p className="help tight">
                  Turn on the Banking Strategy capital vehicle to model contributions,
                  credited cash value growth, draws from the policy loan toward debt,
                  and redirected paydown after debts are gone.
                </p>
              ) : null}
            </div>
          ) : null}

          {isPremium && form.acceleration_method === ACCELERATION_METHODS.HELOC ? (
            <div className="heloc-panel">
              <h4 className="panel-title">HELOC acceleration</h4>
              <p className="help tight">
                Monthly model: income pays down the line and living expenses draw on it
                (within the limit), with interest on the balance. Minimum payments use
                income − living expenses first; the line covers only any shortfall. A
                one-time HELOC draw pays off the current target only when available
                credit can clear the full balance (no partial line paydowns). Cleared
                debts redirect their minimums toward HELOC principal each month.
              </p>
              <div className="form-grid">
                <div className="field">
                  <label>HELOC interest rate (APR %)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={form.heloc_interest_rate}
                    onChange={(e) =>
                      updateField("heloc_interest_rate", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Current HELOC balance ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.heloc_starting_balance}
                    onChange={(e) =>
                      updateField("heloc_starting_balance", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Credit limit ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.heloc_credit_limit || ""}
                    placeholder={`Default ${toCurrency(aggregated.total)}`}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateField(
                        "heloc_credit_limit",
                        v === "" ? 0 : Number(v)
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {isPremium ? (
          <details className="advanced-details">
            <summary>Advanced settings</summary>
            <div className="advanced-details-body">
              <p className="help tight">
                By default the model runs month-by-month until every balance in the
                scenario is paid (including policy loan and HELOC when used), or{" "}
                {AUTO_PROJECTION_CAP_MONTHS / 12} years—whichever comes first. Use
                this only if you need a shorter or longer hard cap.
              </p>
              <div className="field">
                <label>Max projection horizon (years)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  step={1}
                  placeholder={`Auto (${AUTO_PROJECTION_CAP_MONTHS / 12} years)`}
                  value={form.advanced_projection_years}
                  onChange={(e) =>
                    updateField("advanced_projection_years", e.target.value)
                  }
                />
              </div>
            </div>
          </details>
          ) : null}

          <div className="field full">
            <button
              type="button"
              className="button-link quiet"
              onClick={() => setStep1NotesOpen((o) => !o)}
              aria-expanded={step1NotesOpen}
              aria-controls="step1-notes"
              id="step1-notes-toggle"
            >
              {step1NotesOpen ? "Hide notes" : "Add notes (optional)"}
            </button>
            {step1NotesOpen ? (
              <>
                <label htmlFor="step1-notes">Notes</label>
                <textarea
                  id="step1-notes"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Assumptions, goals, follow-ups…"
                />
              </>
            ) : null}
          </div>

          {surplus < 0 ? (
            <div className="inline-warn" role="status">
              Living expenses plus minimum payments exceed income in this snapshot.
              Adjust inputs so monthly income can cover at least contractual minimums.
            </div>
          ) : null}

          {isPremium && hitProjectionCap && aggregated.total > 0 ? (
            <div className="inline-warn" role="status">
              Balances were still outstanding after the {capYearsLabel}-year
              ceiling. Raise income, lower living expenses, increase paydowns/draws,
              or
              extend the horizon under Advanced settings.
            </div>
          ) : null}

          <p
            className="help tight subtle"
            style={{ marginBottom: 10, lineHeight: 1.45 }}
          >
            Tip: Save your plan when you&apos;re done — you can come back and update it
            anytime.
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <button
              type="button"
              className="primary-button"
              onClick={saveScenario}
            >
              Save my plan
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleResetTestScenario}
            >
              Start over
              </button>
</div>
</div>
</section>

        <section
          ref={resultsRef}
          className="card step-card results-card"
          aria-labelledby="step2-heading"
        >
          <div className="step-badge secondary">Step 2</div>
          <h2 id="step2-heading">Projected results</h2>
          {isPremium && shouldShowError ? (
            <div className="inline-warn" role="alert">
              Banking Strategy contribution cannot exceed the amount applied toward
              strategy.
            </div>
          ) : null}

          {form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE &&
          projection.effectivePayoffMethod &&
          !policyContributionExceedsAppliedStrategy ? (
            <p className="help fastest-route-resolved" role="status">
              <strong>
                Fastest Route selected:{" "}
                {projection.effectivePayoffMethod === PAYOFF_METHODS.AVALANCHE
                  ? "Avalanche"
                  : "Snowball"}
              </strong>
            </p>
          ) : null}

          <p className="help results-lead">
            <strong className="strategy-pill-label">
              {!isPremium &&
              (form.acceleration_method === ACCELERATION_METHODS.BANKING ||
                form.acceleration_method === ACCELERATION_METHODS.HELOC)
                ? `${payoffLabel(form.payoff_method)} · Advanced strategy available after unlock`
                : scenarioSummary}
            </strong>
            {isPremium && form.acceleration_method === ACCELERATION_METHODS.HELOC ? (
              <span className="subtle">
                {" "}
                · HELOC APR {Number(form.heloc_interest_rate) || 0}%
              </span>
            ) : null}
          </p>

          {!isUnlocked ? (
            <div
              className="strategy-comparison-section"
              aria-label="Strategy comparison locked"
            >
              <h3 className="subsection-title">Strategy Comparison</h3>
              <div
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "18px",
                  background: "var(--card)"
                }}
              >
                <div
                  style={{
                    height: 150,
                    borderRadius: 10,
                    background:
                      "linear-gradient(90deg, rgba(148,163,184,0.28), rgba(148,163,184,0.14), rgba(148,163,184,0.28))",
                    filter: "blur(1.5px)",
                    marginBottom: 14
                  }}
                />
                <p style={{ margin: "0 0 6px", fontWeight: 700, color: "var(--text)" }}>
                  Get your free payoff summary
                </p>
                <p className="help tight" style={{ margin: 0 }}>
                  Enter your email to save your progress and unlock your personalized payoff summary.
                </p>
                <p className="help tight" style={{ marginTop: 6 }}>
                  See exactly how long it will take and what to do next.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (unlockError) setUnlockError("");
                  }}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--line)",
                    background: "var(--bg)",
                    color: "var(--text)"
                  }}
                />
                {unlockError ? (
                  <p className="status error" style={{ marginTop: 10 }}>
                    {unlockError}
                  </p>
                ) : null}
                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={handleUnlockClick}
                    className="primary-button"
                  >
                    Get My Free Results
                  </button>
                  <div
                    style={{
                      textAlign: "center",
                      margin: "10px 0",
                      fontSize: 12,
                      opacity: 0.7
                    }}
                  >
                    — or —
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    style={{
                      marginTop: 0,
                      opacity: 0.9
                    }}
                    onClick={async () => {
                      const trimmedEmail = email.trim();

                      if (trimmedEmail) {
                        try {
                          await fetch("/api/send-to-ghl", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                              email: trimmedEmail,
                              source: "Debt GPS",
                              plan: "paid"
                            })
                          });
                        } catch (err) {
                          console.warn("[leads] direct paid CTA error", err);
                        }
                      }

                      window.open(`https://buy.stripe.com/5kQeVe5SX5Ul8Z6fPn28800?prefilled_email=${email}&redirect_url=https%3A%2F%2Fdebtgpssystem.com%2Fcheckout%2Fsuccess%3Fsession_id%3D%7BCHECKOUT_SESSION_ID%7D`, "_blank");
                    }}
                  >
                    Skip Results — Show Me My Fastest Payoff Plan
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div
            role="region"
            aria-labelledby="best-path-heading"
            style={{
              margin: "6px 0 22px",
              padding: "20px 22px 22px",
              background: "var(--card)",
              border: "1px solid #e8ecf4",
              borderRadius: 14,
              boxShadow:
                "0 1px 3px rgba(15, 23, 42, 0.05), 0 6px 20px rgba(15, 23, 42, 0.05)"
            }}
          >
            <h3
              id="best-path-heading"
              className="subsection-title"
              style={{ marginTop: 0, marginBottom: 10 }}
            >
              Your Best Path Forward
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: 12 }}>
              Based on your current income, expenses, and debt structure
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text)"
                  }}
                >
                  Best Path Forward
                </h4>
                {step2RecommendationRanking.bestOverall ? (
                  (() => {
                    const best = step2RecommendationRanking.bestOverall;
                    const p = best.projection;
                    const hideAdvancedMetricsForFree =
                      !isPremium && (best.id === "banking" || best.id === "heloc");
                    const capY = Math.round(p.projectionMaxMonths / 12);
                    const consumerM = p.consumerDebtFreeMonth;
                    const totalM = p.schedule?.debtFreeMonth;
                    const consumerLine =
                      hideAdvancedMetricsForFree
                        ? "--"
                        : consumerM != null && Number.isFinite(consumerM)
                        ? `${consumerM} months`
                        : p.hitProjectionCap
                          ? `Not within ${capY}-year projection cap`
                          : "—";
                    const totalLine =
                      hideAdvancedMetricsForFree
                        ? "--"
                        : totalM != null && Number.isFinite(totalM)
                        ? `${totalM} months`
                        : p.hitProjectionCap
                          ? `Not within ${capY}-year projection cap`
                          : "—";
                    const interestSaved = hideAdvancedMetricsForFree
                      ? "--"
                      : toCurrency(p.interestSavedVsMinimum ?? 0);
                    const summaryById =
                      !isPremium && (best.id === "banking" || best.id === "heloc")
                        ? "Advanced strategy available after unlock."
                        : best.id === "banking"
                        ? "This is the fastest and most efficient path based on your numbers—and it pairs paying off creditors with building long-term capital you can borrow against."
                        : best.id === "heloc"
                          ? "This is the fastest and most efficient path based on your numbers, using your HELOC as modeled in this comparison."
                          : "This is the fastest and most efficient path based on your numbers among the Standard acceleration options ranked here.";
                    return (
                      <>
                        <p
                          style={{
                            margin: "0 0 10px",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "var(--text)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.35
                          }}
                        >
                          <span className="subtle" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                            Best Path Forward:{" "}
                          </span>
                          {displayScenarioLabel(best.id)}
                        </p>
                        <dl
                          style={{
                            margin: "0 0 12px",
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "minmax(0, 1fr) auto",
                              gap: "4px 16px",
                              alignItems: "baseline",
                              fontSize: "0.88rem"
                            }}
                          >
                            <dt style={{ margin: 0, color: "#6B7280", fontWeight: 600 }}>
                              Debt-free from creditors
                            </dt>
                            <dd style={{ margin: 0, fontWeight: 600, color: "var(--text)" }}>
                              {consumerLine}
                            </dd>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "minmax(0, 1fr) auto",
                              gap: "4px 16px",
                              alignItems: "baseline",
                              fontSize: "0.88rem"
                            }}
                          >
                            <dt style={{ margin: 0, color: "#6B7280", fontWeight: 600 }}>
                              Fully repaid (full plan)
                            </dt>
                            <dd style={{ margin: 0, fontWeight: 600, color: "var(--text)" }}>
                              {totalLine}
                            </dd>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "minmax(0, 1fr) auto",
                              gap: "4px 16px",
                              alignItems: "baseline",
                              fontSize: "0.88rem"
                            }}
                          >
                            <dt style={{ margin: 0, color: "#6B7280", fontWeight: 600 }}>
                              Interest saved vs. minimums
                            </dt>
                            <dd style={{ margin: 0, fontWeight: 600, color: "var(--accent)" }}>
                              {interestSaved}
                            </dd>
                          </div>
                          {best.id === "banking" &&
                          !p.policyContributionExceedsAppliedStrategy ? (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) auto",
                                gap: "4px 16px",
                                alignItems: "baseline",
                                fontSize: "0.88rem"
                              }}
                            >
                              <dt style={{ margin: 0, color: "#6B7280", fontWeight: 600 }}>
                                Modeled ending net (cash value − loan)
                              </dt>
                              <dd style={{ margin: 0, fontWeight: 600, color: "var(--text)" }}>
                                {isPremium
                                  ? toCurrency(p.endingNetPolicyEquity ?? 0)
                                  : "--"}
                              </dd>
                            </div>
                          ) : null}
                        </dl>
                        <p
                          className="help tight"
                          style={{
                            margin: "0 0 10px",
                            fontSize: "0.9rem",
                            lineHeight: 1.45,
                            color: "var(--text)"
                          }}
                        >
                          {summaryById}
                        </p>
                        {step2RecommendationRanking.nextBestOverall ? (
                          <p
                            className="help tight subtle"
                            style={{ margin: 0, fontSize: "0.86rem", lineHeight: 1.45 }}
                          >
                            If this option is not available to you, the next best path is{" "}
                            <strong>
                              {displayScenarioLabel(
                                step2RecommendationRanking.nextBestOverall.id
                              )}
                            </strong>
                            .
                          </p>
                        ) : null}
                      </>
                    );
                  })()
                ) : (
                  <p className="subtle" style={{ margin: 0, fontSize: "0.9rem" }}>
                    —
                  </p>
                )}
              </div>
              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid var(--line)"
                }}
              >
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text)"
                  }}
                >
                  Next Best Option
                </h4>
                <p className="help tight" style={{ marginBottom: 8 }}>
                  Second-ranked among valid scenarios on this page (after Best Path
                  Forward). Use it when the top pick is unavailable, not a fit, or you
                  want a clear runner-up from the same inputs and comparison run.
                </p>
                {step2RecommendationRanking.nextBestOverall ? (
                  <>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.3
                      }}
                    >
                      {displayScenarioLabel(
                        step2RecommendationRanking.nextBestOverall.id
                      )}
                    </p>
                    <p className="help tight subtle" style={{ margin: "6px 0 0", fontSize: "0.8rem" }}>
                      {formatRankingScenarioMetrics(
                        step2RecommendationRanking.nextBestOverall.id,
                        step2RecommendationRanking.nextBestOverall.projection
                      )}
                    </p>
                  </>
                ) : (
                  <p className="subtle" style={{ margin: 0, fontSize: "0.9rem" }}>
                    —
                  </p>
                )}
              </div>
              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid var(--line)"
                }}
              >
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text)"
                  }}
                >
                  Current Selected Scenario
                </h4>
                <p className="help tight" style={{ marginBottom: 8 }}>
                  This section reflects the strategy currently selected in your
                  comparison view.
                </p>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3
                  }}
                >
                  {displayScenarioLabel(
                    selectedComparisonScenarioKey
                  )}
                </p>
                <p className="help tight" style={{ margin: 0, fontSize: "0.86rem" }}>
                  {currentSelectionStatusMessage}
                </p>
              </div>
              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid var(--line)"
                }}
              >
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text)"
                  }}
                >
                  Best Standard Accelerated Route
                </h4>
                {step2RecommendationRanking.bestStandardAccelerated ? (
                  <>
                    <p className="help tight" style={{ marginBottom: 8 }}>
                      {step2RecommendationRanking.bestStandardAccelerated.id ===
                      "standardAvalanche" ? (
                        <>
                          On these debts, Avalanche (Standard) is modeled to save more
                          interest by attacking higher-rate balances first. Snowball
                          (Standard) often clears the smallest balance first, so your
                          first &quot;win&quot; can arrive sooner and feel more visible.
                        </>
                      ) : (
                        <>
                          On these debts, Snowball (Standard) is modeled to clear your
                          smallest balance first—good for early momentum. Avalanche
                          (Standard) prioritizes rate, which often trims total interest
                          if you stay disciplined through the sequence.
                        </>
                      )}
                    </p>
                    <p className="help tight" style={{ marginBottom: 8 }}>
                      Both are strong Standard options—the better fit is whether you
                      want the lowest modeled interest cost (Avalanche lean) or faster
                      early payoffs on small balances (Snowball lean).
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.3
                      }}
                    >
                      {displayScenarioLabel(
                        step2RecommendationRanking.bestStandardAccelerated.id
                      )}
                    </p>
                    <p className="help tight subtle" style={{ margin: "6px 0 0", fontSize: "0.8rem" }}>
                      {formatRankingScenarioMetrics(
                        step2RecommendationRanking.bestStandardAccelerated.id,
                        step2RecommendationRanking.bestStandardAccelerated.projection
                      )}
                    </p>
                  </>
                ) : (
                  <p className="subtle" style={{ margin: 0, fontSize: "0.9rem" }}>
                    —
                  </p>
                )}
              </div>
            </div>
            {form.acceleration_method !== ACCELERATION_METHODS.BANKING ? (
              <p
                className="help tight"
                style={{ marginTop: 16, marginBottom: 0, fontSize: "0.86rem" }}
              >
                {isPremium
                  ? "Standard and HELOC paths can be powerful on their own—you are not behind if Banking Strategy is not the right fit today. When you are ready, the Banking column below shows how capital-building could layer on with the same inputs."
                  : "Advanced strategy available after unlock."}
              </p>
            ) : (
              <p
                className="help tight"
                style={{ marginTop: 16, marginBottom: 0, fontSize: "0.86rem" }}
              >
                {isPremium
                  ? "Banking Strategy can pair disciplined paydown with long-term capital optionality; keep monitoring contributions and loan mechanics so the model stays aligned with how you run the plan."
                  : "Advanced strategy available after unlock."}
              </p>
            )}
          </div>

          {hasMeaningfulInputs ? (
          <>
          {isUnlocked ? (
          <>
          {!isPremium ? (
            <>
            <div
              style={{
                marginTop: 14,
                marginBottom: 14,
                border: "1px solid rgba(29, 107, 196, 0.28)",
                borderRadius: 14,
                padding: "16px",
                background: "linear-gradient(180deg, rgba(29,107,196,0.08), rgba(29,107,196,0.03))"
              }}
            >
              <p style={{ margin: "0 0 6px", fontWeight: 800, color: "var(--text)" }}>
                Ready to unlock your fastest payoff path?
              </p>
              <p className="help tight" style={{ margin: "0 0 12px" }}>
                You’ve unlocked your free results. Upgrade now to see Banking + HELOC comparisons, your exact payoff order, and the full step-by-step payoff roadmap.
              </p>
              {consumerDebtFreeMonth > 0 ? (
                <>
                  <p
                    className="help tight"
                    style={{ margin: "0 0 12px", fontWeight: 600, color: "var(--text)" }}
                  >
                    Based on your current plan, you’re on track for{" "}
                    <strong>
                      {Math.ceil((consumerDebtFreeMonth || 0) / 12)} years
                    </strong>{" "}
                    in debt. The right strategy could dramatically shorten that timeline.
                  </p>
                  {typeof totalInterest === "number" && totalInterest > 0 ? (
                    <p
                      className="help tight"
                      style={{ margin: "0 0 12px", fontWeight: 600, color: "var(--text)" }}
                    >
                      That could mean paying{" "}
                      <strong>
                        ${Math.round(totalInterest).toLocaleString()}
                      </strong>{" "}
                      in interest over time.
                    </p>
                  ) : null}
                </>
              ) : null}
              <p
                className="help tight"
                style={{ margin: "0 0 12px", fontSize: 12, opacity: 0.85 }}
              >
                Most people in your situation choose this plan to eliminate debt faster and save thousands in interest.
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={async () => {
                  const trimmedEmail = email.trim();

                  if (trimmedEmail) {
                    try {
                      await fetch("/api/send-to-ghl", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          email: trimmedEmail,
                          source: "Debt GPS",
                          plan: "paid"
                        })
                      });
                    } catch (err) {
                      console.warn("[leads] paid lead send-to-ghl error", err);
                    }
                  }

                  window.open(`https://buy.stripe.com/5kQeVe5SX5Ul8Z6fPn28800?prefilled_email=${email}&redirect_url=https%3A%2F%2Fdebtgpssystem.com%2Fcheckout%2Fsuccess%3Fsession_id%3D%7BCHECKOUT_SESSION_ID%7D`, "_blank");
                }}
              >
                Show Me How to Get Out of Debt Faster — $47
              </button>
              <p
                className="help tight"
                style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.8 }}
              >
                Start with your saved email and unlock the full Banking + HELOC payoff roadmap instantly.
              </p>
            </div>
            <div
              aria-hidden="true"
              style={{
                height: 1,
                margin: "14px 0 16px",
                background: "linear-gradient(90deg, rgba(29,107,196,0), rgba(29,107,196,0.22), rgba(29,107,196,0))"
              }}
            />
            </>
          ) : null}
          <div
            className="strategy-comparison-section"
            aria-label="Strategy comparison using your current inputs"
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--muted)"
              }}
            >
              Free Preview
            </p>
            <p
              className="help tight"
              style={{ margin: "0 0 10px", fontSize: 12, opacity: 0.8 }}
            >
              Full payoff order, Banking strategy, and HELOC optimization are included in your paid plan.
            </p>
            <h3 className="subsection-title">Strategy Comparison</h3>
            <p className="help tight strategy-comparison-lead">
              Uses the same income, expenses, debts, and strategy budget as Step 1. Two
              standard projections run in the background—you do not need to switch
              strategies. Snowball (Standard) and Avalanche (Standard) use Standard
              acceleration with fixed payoff order.
            </p>
            <div className="strategy-comparison-grid">
              <div
                className={`strategy-comparison-card${
                  form.acceleration_method === ACCELERATION_METHODS.STANDARD
                    ? " strategy-comparison-card--current"
                    : ""
                }`}
              >
                <h4 className="strategy-comparison-card-title">
                  Snowball
                  {renderStrategyComparisonRankBadge("standardSnowball")}
                </h4>
                <p className="strategy-comparison-card-sub subtle">
                  Snowball · Standard acceleration
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Debt-free from creditors</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.standardSnowball,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Fully repaid</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.standardSnowball,
                        "total"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Interest saved</dt>
                    <dd>
                      {toCurrency(
                        strategyComparisonProjections.standardSnowball
                          .interestSavedVsMinimum
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Ending net</dt>
                    <dd className="subtle">—</dd>
                  </div>
                </dl>
                <div className="strategy-comparison-card-footer">
                  <div
                    className="strategy-comparison-card-footer-note-placeholder"
                    aria-hidden="true"
                  />
                  <p className="strategy-comparison-foot subtle">
                    No banking or HELOC vehicle in this column
                  </p>
                </div>
              </div>
              <div
                className={`strategy-comparison-card${
                  form.acceleration_method === ACCELERATION_METHODS.STANDARD
                    ? " strategy-comparison-card--current"
                    : ""
                }`}
              >
                <h4 className="strategy-comparison-card-title">
                  Avalanche
                  {renderStrategyComparisonRankBadge("standardAvalanche")}
                </h4>
                <p className="strategy-comparison-card-sub subtle">
                  Avalanche · Standard acceleration
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Debt-free from creditors</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.standardAvalanche,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Fully repaid</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.standardAvalanche,
                        "total"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Interest saved</dt>
                    <dd>
                      {toCurrency(
                        strategyComparisonProjections.standardAvalanche
                          .interestSavedVsMinimum
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Ending net</dt>
                    <dd className="subtle">—</dd>
                  </div>
                </dl>
                <div className="strategy-comparison-card-footer">
                  <div
                    className="strategy-comparison-card-footer-note-placeholder"
                    aria-hidden="true"
                  />
                  <p className="strategy-comparison-foot subtle">
                    No banking or HELOC vehicle in this column
                  </p>
                </div>
              </div>
              {isPremium ? (
              <div
                className={`strategy-comparison-card${
                  form.acceleration_method === ACCELERATION_METHODS.HELOC
                    ? " strategy-comparison-card--current"
                    : ""
                }`}
              >
                <h4 className="strategy-comparison-card-title">
                  HELOC
                  {renderStrategyComparisonRankBadge("heloc")}
                </h4>
                <p className="strategy-comparison-card-sub subtle">
                  {payoffLabel(form.payoff_method)} · HELOC acceleration
                </p>
                {helocAcceleration && !hasHelocLimit ? (
                  <div className="help tight" style={{ marginTop: 10 }}>
                    Enter your HELOC credit limit to see accurate projections.
                  </div>
                ) : (
                  <>
                    <dl className="strategy-comparison-dl">
                      <div className="strategy-comparison-row">
                        <dt>Debt-free from creditors</dt>
                        <dd className="strategy-comparison-dd--timeline">
                          {renderStrategyComparisonTimelineInCards(
                            strategyComparisonProjections.heloc,
                            "consumer"
                          )}
                        </dd>
                      </div>
                      <div className="strategy-comparison-row">
                        <dt>Fully repaid</dt>
                        <dd className="strategy-comparison-dd--timeline">
                          {renderStrategyComparisonTimelineInCards(
                            strategyComparisonProjections.heloc,
                            "total"
                          )}
                        </dd>
                      </div>
                    </dl>
                    <p className="help tight subtle" style={{ margin: "0 0 6px" }}>
                      Remaining time reflects repayment of borrowed funds using your
                      available cash flow.
                    </p>
                    <p className="help tight subtle" style={{ margin: "0 0 10px" }}>
                      Uses your monthly cash flow and freed payments to repay the line.
                    </p>
                    <dl className="strategy-comparison-dl">
                      <div className="strategy-comparison-row">
                        <dt>Interest saved</dt>
                        <dd>
                          {toCurrency(
                            strategyComparisonProjections.heloc
                              .interestSavedVsMinimum
                          )}
                        </dd>
                      </div>
                      <div className="strategy-comparison-row">
                        <dt>Ending net (HELOC line)</dt>
                        <dd>
                          {toCurrency(
                            strategyComparisonProjections.heloc.endingHelocBalance
                          )}
                        </dd>
                      </div>
                    </dl>
                    <div className="strategy-comparison-card-footer">
                      <div
                        className="strategy-comparison-card-footer-note-placeholder"
                        aria-hidden="true"
                      />
                      <p className="strategy-comparison-foot subtle">
                        Ending HELOC balance (modeled line)
                      </p>
                    </div>
                  </>
                )}
              </div>
              ) : null}
              {isPremium ? (
              <div
                className={`strategy-comparison-card${
                  step2RecommendationRanking.bestOverall?.id === "banking"
                    ? " strategy-comparison-card--recommended"
                    : ""
                }${
                  form.acceleration_method === ACCELERATION_METHODS.BANKING
                    ? " strategy-comparison-card--current"
                    : ""
                }`}
              >
                <h4 className="strategy-comparison-card-title">
                  Banking Strategy
                  {renderStrategyComparisonRankBadge("banking")}
                </h4>
                <p className="strategy-comparison-card-sub subtle">
                  {payoffLabel(form.payoff_method)} · policy loan model
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Debt-free from creditors</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.banking,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Fully repaid</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.banking,
                        "total"
                      )}
                    </dd>
                  </div>
                </dl>
                <p className="help tight subtle" style={{ margin: "0 0 6px" }}>
                  Remaining time reflects repayment of your policy loan while your capital
                  continues to grow.
                </p>
                <p className="help tight subtle" style={{ margin: "0 0 10px" }}>
                  You are continuing to build capital instead of applying every
                  available dollar directly to payoff.
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Interest saved</dt>
                    <dd>
                      {strategyComparisonProjections.banking
                        .policyContributionExceedsAppliedStrategy
                        ? "—"
                        : toCurrency(
                            strategyComparisonProjections.banking
                              .interestSavedVsMinimum
                          )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Ending net (policy)</dt>
                    <dd>
                      {strategyComparisonProjections.banking
                        .policyContributionExceedsAppliedStrategy
                        ? "—"
                        : toCurrency(
                            strategyComparisonProjections.banking
                              .endingNetPolicyEquity
                          )}
                    </dd>
                  </div>
                </dl>
                <div className="strategy-comparison-card-footer">
                  {strategyComparisonProjections.banking
                    .policyContributionExceedsAppliedStrategy ? (
                    <p className="strategy-comparison-inline-note subtle">
                      Contribution exceeds applied strategy—Banking projection not run for
                      this column.
                    </p>
                  ) : (
                    <div
                      className="strategy-comparison-card-footer-note-placeholder"
                      aria-hidden="true"
                    />
                  )}
                  <p className="strategy-comparison-foot subtle">
                    Ending Banking Strategy net (cash value − policy loan)
                  </p>
                </div>
              </div>
              ) : null}
            </div>
          </div>
          {!isPremium ? (
            <div
              style={{
                marginTop: 14,
                padding: "12px 16px",
                borderRadius: 10,
                background: "rgba(148, 163, 184, 0.08)",
                border: "1px solid rgba(148, 163, 184, 0.25)"
              }}
            >
              <p
                style={{
                  margin: 0,
                  textAlign: "center",
                  color: "#374151",
                  fontSize: 15,
                  lineHeight: 1.5
                }}
              >
                <strong>Your fastest strategy is hidden.</strong> Unlock to see the exact
                payoff order.
              </p>
            </div>
          ) : null}
          {!isPremium ? (
            <div style={{ marginTop: 14 }}>
              <p className="help tight" style={{ fontWeight: 600 }}>
                You are currently viewing a limited version of your plan.
              </p>
              <p className="help tight">
                Unlock to see your exact fastest payoff path, full strategy breakdown, and step-by-step execution plan.
              </p>
            </div>
          ) : null}
          {!isPremium ? (
            <div
              style={{
                marginTop: 14,
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "18px",
                background: "var(--card)"
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px",
                  color: "var(--text)",
                  fontSize: "clamp(1rem, 2.2vw, 1.12rem)",
                  fontWeight: 750,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3
                }}
              >
                How can the same dollar do two jobs?
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "14px",
                  marginBottom: 14
                }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    padding: "12px 14px",
                    border: "1px solid var(--line)",
                    background: "rgba(148, 163, 184, 0.06)"
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontWeight: 650,
                      fontSize: "0.92rem",
                      color: "var(--text)"
                    }}
                  >
                    Standard Path
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
                      color: "var(--muted)"
                    }}
                  >
                    <li style={{ marginBottom: 6 }}>$600 → Debt</li>
                    <li style={{ marginBottom: 6 }}>Money gone</li>
                    <li style={{ margin: 0 }}>No growth</li>
                  </ul>
                </div>
                <div
                  style={{
                    borderRadius: 10,
                    padding: "12px 14px",
                    border: "2px solid rgba(29, 107, 196, 0.5)",
                    background:
                      "linear-gradient(150deg, rgba(29, 107, 196, 0.16) 0%, rgba(99, 102, 241, 0.11) 55%, rgba(29, 107, 196, 0.07) 100%)",
                    boxShadow: "0 6px 22px rgba(29, 107, 196, 0.16)"
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontWeight: 650,
                      fontSize: "0.92rem",
                      color: "var(--text)"
                    }}
                  >
                    Advanced Strategy (Locked)
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
                      color: "var(--text)"
                    }}
                  >
                    <li style={{ marginBottom: 6 }}>$600 → Capital</li>
                    <li style={{ marginBottom: 6 }}>Used to reduce debt</li>
                    <li style={{ margin: 0 }}>Capital still grows</li>
                  </ul>
                </div>
              </div>
              <p
                className="help tight"
                style={{
                  margin: "0 0 8px",
                  fontWeight: 600,
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  lineHeight: 1.5
                }}
              >
                Most people only use their money once. Wealthy people use it twice.
              </p>
              <p
                className="help tight"
                style={{
                  margin: "0 0 10px",
                  fontWeight: 600,
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  lineHeight: 1.5
                }}
              >
                The question is… which one are you doing?
              </p>
              <p className="help tight subtle" style={{ margin: 0, fontSize: "0.86rem" }}>
                Unlock to see exactly how this works with your numbers.
              </p>
            </div>
          ) : null}
          {!isPremium ? (
            <div
              style={{
                marginTop: 14,
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "18px",
                background: "var(--card)"
              }}
            >
              <h4 style={{ margin: "0 0 10px", color: "var(--text)" }}>
                Unlock Your Fastest Payoff Plan (Early Access Pricing)
              </h4>
              <p className="help tight" style={{ margin: "4px 0 12px", fontWeight: 500 }}>
                Early users lock in $47/month — price increases to $97 soon.
              </p>
              <ul>
                <li>Unlock Banking + HELOC comparisons</li>
                <li>See your exact payoff order (step-by-step)</li>
                <li>Access full month-by-month payoff roadmap</li>
                <li>See your true fastest strategy (not just standard methods)</li>
              </ul>
              <p className="help tight" style={{ margin: "0 0 12px" }}>
                You're currently seeing a basic payoff path. Your fastest, optimized strategy is locked.
              </p>
              {!isPremium ? (
                <p className="help tight" style={{ margin: "0 0 12px", fontWeight: 500 }}>
                  You’re about{" "}
                  {Number.isFinite(
                    strategyComparisonProjections.standardSnowball.consumerDebtFreeMonth
                  )
                    ? strategyComparisonProjections.standardSnowball.consumerDebtFreeMonth
                    : "--"}{" "}
                  months away from being debt free — unlock your fastest path now.
                </p>
              ) : null}
              <div style={{ margin: "0 0 12px", padding: "12px", border: "1px solid var(--line)", borderRadius: 10 }}>
                <h5 style={{ margin: "0 0 8px", color: "var(--text)" }}>
                  See the plan most people miss
                </h5>
                <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
                  <li>Cut years off your payoff timeline</li>
                  <li>See which debt to attack first</li>
                  <li>Unlock advanced strategy paths hidden in free view</li>
                </ul>
                <p className="help tight" style={{ margin: 0 }}>
                  Early users keep $47/month before pricing increases.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  margin: "14px 0"
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(148, 163, 184, 0.28)",
                    borderRadius: 12,
                    padding: 14,
                    background: "rgba(255,255,255,0.55)"
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontWeight: 800, color: "var(--text)" }}>Free Preview</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>Basic payoff projection</li>
                    <li>Strategy preview</li>
                    <li>Email unlock access</li>
                  </ul>
                </div>

                <div
                  style={{
                    border: "1px solid rgba(29, 107, 196, 0.28)",
                    borderRadius: 12,
                    padding: 14,
                    background: "linear-gradient(180deg, rgba(29,107,196,0.08), rgba(29,107,196,0.03))"
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontWeight: 800, color: "var(--text)" }}>Paid Plan</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>Full payoff order</li>
                    <li>Banking + HELOC comparison</li>
                    <li>Complete payoff roadmap</li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={async () => {
                  const trimmedEmail = email.trim();

                  if (trimmedEmail) {
                    try {
                      await fetch("/api/send-to-ghl", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          email: trimmedEmail,
                          source: "Debt GPS",
                          plan: "paid"
                        })
                      });
                    } catch (err) {
                      console.warn("[leads] paid lead send-to-ghl error", err);
                    }
                  }

                  window.open(`https://buy.stripe.com/5kQeVe5SX5Ul8Z6fPn28800?prefilled_email=${email}&redirect_url=https%3A%2F%2Fdebtgpssystem.com%2Fcalculator%3Faccess%3Dpaid`, "_blank");
                }}
              >
                Unlock My Fastest Payoff Plan — $47
              </button>
              <p className="help tight" style={{ marginTop: 6, textAlign: "center" }}>
                One-time setup. No long-term commitment.
              </p>
              <p className="help tight" style={{ marginTop: 4, textAlign: "center" }}>
                Start now and lock in early access pricing before it increases.
              </p>
            </div>
          ) : null}
          </>
          ) : null}

          {isPremium ? (
          <div className="payoff-order-panel">
            <h3 className="subsection-title payoff-order-title">Debt Payoff Order</h3>
            <p className="help tight">
              {form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE
                ? `Fastest Route: order below matches ${
                    (projection.effectivePayoffMethod ??
                      PAYOFF_METHODS.SNOWBALL) === PAYOFF_METHODS.AVALANCHE
                      ? "Avalanche"
                      : "Snowball"
                  } (the model’s shorter total debt-free timeline).`
                : form.payoff_method === PAYOFF_METHODS.SNOWBALL
                  ? "Snowball: smallest balance is attacked first among open debts (order updates as balances change)."
                  : "Avalanche: highest APR first, then larger balance at the same rate."}
            </p>
            {debtPayoffOrder.length === 0 ? (
              <p className="subtle">No debts entered.</p>
            ) : (
              <>
                <div
                  className="payoff-timeline-controls"
                  style={{
                    marginBottom: 14,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    background: "rgba(15, 23, 42, 0.03)"
                  }}
                >
                  <p className="help tight subtle" style={{ margin: "0 0 10px" }}>
                    Current Month moves the payoff timeline forward using modeled payoff
                    months from your selected strategy (month 0 = before any debt is paid off
                    in the projection).
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "var(--text)"
                      }}
                    >
                      Current Month
                    </span>
                    <span className="help tight subtle" style={{ margin: 0 }}>
                      {payoffTimelineCurrentMonth} / {maxPayoffMonthFromProjection}
                    </span>
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      disabled={payoffTimelineCurrentMonth <= 0}
                      onClick={() =>
                        setPayoffTimelineCurrentMonth((m) => Math.max(0, m - 1))
                      }
                      aria-label="Previous month"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      disabled={
                        payoffTimelineCurrentMonth >= maxPayoffMonthFromProjection
                      }
                      onClick={() =>
                        setPayoffTimelineCurrentMonth((m) =>
                          Math.min(maxPayoffMonthFromProjection, m + 1)
                        )
                      }
                      aria-label="Next month"
                    >
                      +
                    </button>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, maxPayoffMonthFromProjection)}
                    step={1}
                    value={payoffTimelineCurrentMonth}
                    onChange={(e) =>
                      setPayoffTimelineCurrentMonth(Number(e.target.value))
                    }
                    aria-valuemin={0}
                    aria-valuemax={maxPayoffMonthFromProjection}
                    aria-valuenow={payoffTimelineCurrentMonth}
                    aria-label="Simulated month for debt payoff order"
                    style={{ width: "100%", maxWidth: 360, marginTop: 10 }}
                  />
                </div>
                <div
                  className="payoff-what-next-panel"
                  style={{
                    marginBottom: 14,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    background: "rgba(15, 23, 42, 0.03)"
                  }}
                >
                  <h4
                    className="subsection-title payoff-order-title"
                    style={{
                      marginTop: 0,
                      marginBottom: 10,
                      fontSize: "0.95rem"
                    }}
                  >
                    What happens next
                  </h4>
                  {(() => {
                    const paidThroughTimeline = (debt) => {
                      const pm = consumerDebtPayoffMonthById?.[debt.id];
                      return pm != null && pm <= payoffTimelineCurrentMonth;
                    };
                    const nextDebt = payoffTimelineNextDebtId
                      ? debtPayoffOrder.find((d) => d.id === payoffTimelineNextDebtId)
                      : null;
                    if (!nextDebt) {
                      return (
                        <p className="help tight" style={{ margin: 0 }}>
                          All listed debts are paid off by the selected month.
                        </p>
                      );
                    }
                    const nextLabel = nextDebt.name?.trim()
                      ? nextDebt.name
                      : `Debt ${nextDebt.order}`;
                    const nextPayMonth = consumerDebtPayoffMonthById?.[nextDebt.id];
                    const nextIdx = debtPayoffOrder.findIndex(
                      (d) => d.id === nextDebt.id
                    );
                    const followingDebt =
                      nextIdx >= 0
                        ? debtPayoffOrder
                            .slice(nextIdx + 1)
                            .find((d) => !paidThroughTimeline(d))
                        : null;
                    const followingLabel = followingDebt
                      ? followingDebt.name?.trim()
                        ? followingDebt.name
                        : `Debt ${followingDebt.order}`
                      : null;
                    return (
                      <>
                        <p className="help tight" style={{ margin: "0 0 8px" }}>
                          Your next focus is {nextLabel} ({toCurrency(nextDebt.balance)}).
                        </p>
                        {nextPayMonth != null ? (
                          <p className="help tight" style={{ margin: "0 0 8px" }}>
                            It is modeled to be paid off in Month {nextPayMonth}.
                          </p>
                        ) : null}
                        {followingLabel ? (
                          <p className="help tight subtle" style={{ margin: 0 }}>
                            After that, {followingLabel} becomes your next target.
                          </p>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
                <div className="table-wrap payoff-order-table-wrap">
                  <table className="payoff-order-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Debt</th>
                        <th>Balance</th>
                        <th>APR</th>
                        <th>Min payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debtPayoffOrder.map((d) => {
                        const payoffMonthForRow = consumerDebtPayoffMonthById?.[d.id];
                        const timelinePaidOff =
                          payoffMonthForRow != null &&
                          payoffMonthForRow <= payoffTimelineCurrentMonth;
                        const mainStatus = timelinePaidOff
                          ? "Paid Off"
                          : payoffTimelineNextDebtId === d.id
                            ? "Next"
                            : "Open";
                        const statusHelper =
                          payoffMonthForRow != null
                            ? timelinePaidOff
                              ? `Modeled payoff: Month ${payoffMonthForRow}`
                              : payoffTimelineNextDebtId === d.id
                                ? `Targeted payoff: Month ${payoffMonthForRow}`
                                : `Projected payoff: Month ${payoffMonthForRow}`
                            : null;
                        return (
                          <tr
                            key={d.id}
                            className={timelinePaidOff ? "payoff-order-row-paid" : ""}
                          >
                            <td>{d.order}</td>
                            <td>{d.name?.trim() ? d.name : `Debt ${d.order}`}</td>
                            <td>{toCurrency(d.balance)}</td>
                            <td>{d.rate.toFixed(2)}%</td>
                            <td>
                              {toCurrency(d.minPayment)}
                              {/* Display-only enhancement: show strategy budget info under Monthly Strategy Budget input */}
                              {d.isStrategyBudgetRow && (
                                <>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "#6B7280",
                                      marginTop: 7,
                                    }}
                                  >
                                    Available for strategy:{" "}
                                    {toCurrency(availableForStrategy)}
                                    <br />
                                    <span style={{ fontSize: "12px" }}>
                                      (income − expenses − minimum payments)
                                    </span>
                                  </div>
                                  {appliedExceedsAvailableForStrategy && (
                                    <div
                                      style={{
                                        color: "#b91c1c",
                                        fontSize: "13px",
                                        marginTop: 5,
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      You’re trying to use{" "}
                                      {toCurrency(amountTowardDebtStrategyRaw || 0)} but
                                      only {toCurrency(availableForStrategy)} is available
                                      after required minimum payments.
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                            <td>
                              <div>{mainStatus}</div>
                              {statusHelper ? (
                                <div
                                  className="help tight subtle"
                                  style={{
                                    fontSize: "0.75rem",
                                    marginTop: 4,
                                    lineHeight: 1.35,
                                    color: "var(--muted)"
                                  }}
                                >
                                  {statusHelper}
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          ) : null}

          {isPremium && debtPayoffOrder.some(
            (d) =>
              consumerDebtPayoffMonthById?.[d.id] != null &&
              consumerDebtPayoffMonthById[d.id] <= payoffTimelineCurrentMonth
          ) ? (
            <div
              className="paid-off-debts-panel"
              style={{
                marginTop: 18,
                padding: "16px 18px 18px",
                borderRadius: 14,
                background: "rgba(15, 23, 42, 0.045)",
                border: "1px solid #e8ecf4",
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
              }}
            >
              <h3
                className="subsection-title payoff-order-title"
                style={{ marginTop: 0, marginBottom: 8 }}
              >
                Paid Off Debts
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {debtPayoffOrder
                  .filter(
                    (d) =>
                      consumerDebtPayoffMonthById?.[d.id] != null &&
                      consumerDebtPayoffMonthById[d.id] <= payoffTimelineCurrentMonth
                  )
                  .map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(255, 255, 255, 0.72)",
                        border: "1px solid var(--line)",
                        opacity: 0.95
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          marginBottom: 4,
                          color: "var(--text)"
                        }}
                      >
                        {d.name?.trim() ? d.name : `Debt ${d.order}`}
                      </div>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "var(--muted)",
                          marginBottom: 8
                        }}
                      >
                        Paid Off ✔
                      </div>
                      <p
                        className="help tight subtle"
                        style={{ margin: "0 0 6px", fontSize: "0.8rem" }}
                      >
                        Modeled payoff: month {consumerDebtPayoffMonthById[d.id]}
                      </p>
                      <p
                        className="help tight subtle"
                        style={{ margin: "0 0 8px", fontSize: "0.82rem" }}
                      >
                        Freed minimum payment: {toCurrency(d.minPayment)}/month
                      </p>
                      <p className="help tight" style={{ margin: 0, fontSize: "0.84rem" }}>
                        {bankingActive
                          ? `${toCurrency(d.minPayment)}/month freed and redirected to policy loan repayment`
                          : helocAcceleration
                            ? `${toCurrency(d.minPayment)}/month freed and redirected to HELOC payoff`
                            : `${toCurrency(d.minPayment)}/month freed and redirected to your next debt`}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {isPremium && bankingActive && !policyContributionExceedsAppliedStrategy ? (
            <div className="banking-transparency-panel">
              <h3 className="subsection-title">Banking Strategy (engine view)</h3>
              <p className="help tight">
                Policy draws for debt elimination run only when borrow capacity can pay off the
                full current target. Your monthly contribution still credits cash value each month.
                Freed minimums from paid-off debts stay in cash flow and stack toward policy loan
                principal after other minimums and the remaining monthly strategy slice after your
                contribution.
              </p>
              <div className="banking-transparency-grid">
                <div className="banking-transparency-card">
                  <h4 className="panel-title tight">Month 1 — before strategic draw</h4>
                  <p className="transparency-note">
                    After interest on debts, loan interest, CV growth, and your contribution.
                  </p>
                  {bankingPayoffTriggerMonth1 ? (
                    <dl className="transparency-dl">
                      <dt>Current target</dt>
                      <dd>
                        {bankingPayoffTriggerMonth1.targetName?.trim()
                          ? bankingPayoffTriggerMonth1.targetName
                          : bankingPayoffTriggerMonth1.targetId
                            ? `Id ${bankingPayoffTriggerMonth1.targetId}`
                            : "—"}
                      </dd>
                      <dt>Amount to eliminate target</dt>
                      <dd>
                        {toCurrency(bankingPayoffTriggerMonth1.amountNeededToEliminate)}
                      </dd>
                      <dt>Policy cash value</dt>
                      <dd>{toCurrency(bankingPayoffTriggerMonth1.policyCashValue)}</dd>
                      <dt>Policy loan balance</dt>
                      <dd>{toCurrency(bankingPayoffTriggerMonth1.policyLoanBalance)}</dd>
                      <dt>Borrow capacity remaining</dt>
                      <dd>
                        {toCurrency(bankingPayoffTriggerMonth1.remainingBorrowCapacity)}
                      </dd>
                      <dt>Can borrow to wipe target?</dt>
                      <dd>
                        {bankingPayoffTriggerMonth1.canEliminateTargetNow ? (
                          <span className="success">Yes</span>
                        ) : (
                          <span className="subtle">Not yet</span>
                        )}
                      </dd>
                    </dl>
                  ) : (
                    <p className="subtle">No open consumer debt in month 1.</p>
                  )}
                </div>
                <div className="banking-transparency-card">
                  <h4 className="panel-title tight">Latest simulated month</h4>
                  <p className="transparency-note">
                    End of month {bankingStateLatest?.month ?? "—"} after paydowns and recycling.
                  </p>
                  {bankingStateLatest ? (
                    <dl className="transparency-dl">
                      <dt>Current target</dt>
                      <dd>
                        {bankingStateLatest.targetName?.trim()
                          ? bankingStateLatest.targetName
                          : bankingStateLatest.targetId
                            ? `Id ${bankingStateLatest.targetId}`
                            : "—"}
                      </dd>
                      <dt>Amount to eliminate target</dt>
                      <dd>{toCurrency(bankingStateLatest.amountNeededToEliminate)}</dd>
                      <dt>Policy cash value</dt>
                      <dd>{toCurrency(bankingStateLatest.policyCashValue)}</dd>
                      <dt>Policy loan balance</dt>
                      <dd>{toCurrency(bankingStateLatest.policyLoanBalance)}</dd>
                      <dt>Borrow capacity remaining</dt>
                      <dd>{toCurrency(bankingStateLatest.remainingBorrowCapacity)}</dd>
                      <dt>Could wipe target if drawn now?</dt>
                      <dd>
                        {bankingStateLatest.canEliminateTargetNow ? (
                          <span className="success">Yes</span>
                        ) : (
                          <span className="subtle">No</span>
                        )}
                      </dd>
                      <dt>Freed minimums stacked (per month)</dt>
                      <dd>
                        {toCurrency(bankingStateLatest.freedMinimumsStackedPerMonth)}
                      </dd>
                      <dt>Policy loan principal paid (sim total)</dt>
                      <dd>{toCurrency(cumulativePolicyLoanPrincipalPaid)}</dd>
                    </dl>
                  ) : (
                    <p className="subtle">—</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {helocAcceleration ? (
            <div className="banking-transparency-panel heloc-transparency-panel">
              <h3 className="subsection-title">HELOC (engine view)</h3>
              {!hasHelocLimit ? (
                <div className="help tight" style={{ marginTop: 10 }}>
                  Enter your HELOC credit limit to see accurate projections.
                </div>
              ) : (
                <>
              <p className="help tight">
                After month-start HELOC interest, income and living expenses move the
                line. Minimums and extra principal use surplus cash first; the trigger
                below is whether available credit can wipe the full current consumer
                target in one draw. The projected outcomes summary below lists
                consumer debt-free month and total debt-free month (including HELOC)
                on separate lines.
              </p>
              <div className="banking-transparency-grid">
                <div className="banking-transparency-card">
                  <h4 className="panel-title tight">Month 1 — after velocity, before payoffs</h4>
                  <p className="transparency-note">
                    After consumer APR on debts and HELOC interest; then income / expense
                    flow on the line.
                  </p>
                  {helocPayoffTriggerMonth1 ? (
                    <dl className="transparency-dl">
                      <dt>Current consumer target</dt>
                      <dd>
                        {payoffTargetLabel(
                          helocPayoffTriggerMonth1.targetName,
                          helocPayoffTriggerMonth1.targetId,
                          form.debts
                        )}
                      </dd>
                      <dt>Amount to eliminate target</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocPayoffTriggerMonth1.amountNeededToEliminate)
                          : "--"}
                      </dd>
                      <dt>HELOC balance</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocPayoffTriggerMonth1.helocBalance)
                          : "--"}
                      </dd>
                      <dt>Credit limit</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocPayoffTriggerMonth1.helocCreditLimit)
                          : "--"}
                      </dd>
                      <dt>Available credit</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocPayoffTriggerMonth1.availableCredit)
                          : "--"}
                      </dd>
                      <dt>Can HELOC wipe consumer target?</dt>
                      <dd>
                        {helocPayoffTriggerMonth1.canEliminateTargetNow ? (
                          <span className="success">Yes</span>
                        ) : (
                          <span className="subtle">Not yet</span>
                        )}
                      </dd>
                    </dl>
                  ) : (
                    <p className="subtle">No open consumer debt in month 1.</p>
                  )}
                </div>
                <div className="banking-transparency-card">
                  <h4 className="panel-title tight">Latest simulated month</h4>
                  <p className="transparency-note">
                    End of month {helocStateLatest?.month ?? "—"} (after paydowns and
                    freed-minimum redirect).
                  </p>
                  {helocStateLatest ? (
                    <dl className="transparency-dl">
                      <dt>Current consumer target</dt>
                      <dd>
                        {payoffTargetLabel(
                          helocStateLatest.targetName,
                          helocStateLatest.targetId,
                          form.debts
                        )}
                      </dd>
                      <dt>Amount to eliminate target</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocStateLatest.amountNeededToEliminate)
                          : "--"}
                      </dd>
                      <dt>HELOC balance</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocStateLatest.helocBalance)
                          : "--"}
                      </dd>
                      <dt>Credit limit</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocStateLatest.helocCreditLimit)
                          : "--"}
                      </dd>
                      <dt>Available credit</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocStateLatest.availableCredit)
                          : "--"}
                      </dd>
                      <dt>Could wipe consumer target if drawn now?</dt>
                      <dd>
                        {helocStateLatest.canEliminateTargetNow ? (
                          <span className="success">Yes</span>
                        ) : (
                          <span className="subtle">No</span>
                        )}
                      </dd>
                      <dt>Freed minimums stacked (per month)</dt>
                      <dd>
                        {isPremium
                          ? toCurrency(helocStateLatest.freedMinimumsStackedPerMonth)
                          : "--"}
                      </dd>
                    </dl>
                  ) : (
                    <p className="subtle">—</p>
                  )}
                </div>
              </div>
                </>
              )}
            </div>
          ) : null}

          <div
            className="stats compact strategy-snapshot"
            aria-label="Monthly strategy budget (flexible)"
          >
            <div className="stat">
              <div className="label">Available for strategy</div>
              <div className="value">{toCurrency(availableForStrategy)}</div>
              <p className="stat-hint">
                Income − living expenses − minimums (
                {toCurrency(aggregated.totalMin)} / mo)
              </p>
            </div>
            <div className="stat">
              <div className="label">Applied toward strategy</div>
              <div className="value">{toCurrency(appliedTowardStrategy)}</div>
              <p className="stat-hint">Your monthly strategy budget (flexible)</p>
            </div>
            <div className="stat">
              {bankingActive ? (
                <>
                  <div className="label">Banking Strategy contribution</div>
                  <div className="value">
                    {isPremium ? toCurrency(policyContrib) : "--"}
                  </div>
                  <p className="stat-hint">
                    From your monthly strategy budget
                  </p>
                </>
              ) : helocAcceleration ? (
                !hasHelocLimit ? (
                  <>
                    <div className="label">Total HELOC interest (projected)</div>
                    <div className="value">—</div>
                    <div className="help tight" style={{ marginTop: 10 }}>
                      Enter your HELOC credit limit to see accurate projections.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="label">Total HELOC interest (projected)</div>
                    <div className="value">
                      {isPremium
                        ? toCurrency(totalHelocInterestPaid ?? 0)
                        : "--"}
                    </div>
                    <p className="stat-hint">
                      Accrued on the modeled HELOC balance through the simulated
                      months
                    </p>
                  </>
                )
              ) : (
                <>
                  <div className="label">Capital vehicle contribution</div>
                  <div className="value">—</div>
                  <p className="stat-hint">
                    Shown when Banking Strategy + capital vehicle is selected
                  </p>
                </>
              )}
            </div>
            <div className="stat">
              <div className="label">
                {isBankingAcceleration
                  ? "Cash flow after contribution"
                  : "Applied toward debt payoff"}
              </div>
              <div className="value">
                {policyContributionExceedsAppliedStrategy
                  ? "—"
                  : isBankingAcceleration && !isPremium
                    ? "--"
                    : toCurrency(budgetExtraDebtPayoff)}
              </div>
              <p className="stat-hint">
                {isBankingAcceleration
                  ? "In the model: minimums, consumer balances when applicable, policy loan paydown, and redirects."
                  : "Extra principal beyond minimums"}
              </p>
            </div>
          </div>

          <div
            className="summary-strip"
            aria-label="Projected outcomes"
          >
            <div className="summary-item">
              <span className="summary-label">Total debt</span>
              <span
                className="summary-value"
                style={{ color: "#9b2c2c" }}
              >
                {toCurrency(aggregated.total)}
              </span>
            </div>
            {bankingActive ? (
              <>
                <div className="summary-item">
                  <span className="summary-label">
                    Consumer Debt-Free Timeline
                  </span>
                  <span className="summary-value">
                    {formatDebtFreeMonths(consumerDebtFreeMonth) ??
                      debtTimelineCapOrDash}
                  </span>
                  <span className="summary-hint">
                    Month when modeled consumer balances reach $0
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">
                    Policy Loan Paydown Timeline
                  </span>
                  <span className="summary-value">
                    {formatDebtFreeMonths(debtFreeMonth) ?? debtTimelineCapOrDash}
                  </span>
                  <span className="summary-hint">
                    Month when policy loan reaches $0 in the simulation
                  </span>
                </div>
              </>
            ) : helocAcceleration && hasHelocLimit ? (
              <>
                <div className="summary-item">
                  <span className="summary-label">
                    Consumer Debt-Free Timeline
                  </span>
                  <span className="summary-value">
                    {formatDebtFreeMonths(consumerDebtFreeMonth) ??
                      debtTimelineCapOrDash}
                  </span>
                  <span className="summary-hint">
                    Month when modeled consumer balances reach $0
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">
                    Total Debt-Free Timeline (including HELOC)
                  </span>
                  <span className="summary-value">
                    {formatDebtFreeMonths(debtFreeMonth) ?? debtTimelineCapOrDash}
                  </span>
                  <span className="summary-hint">
                    Month when consumer debt and HELOC both reach $0
                  </span>
                </div>
              </>
            ) : (
              <div className="summary-item">
                <span className="summary-label">
                  Consumer Debt-Free Timeline
                </span>
                <span className="summary-value">
                  {formatDebtFreeMonths(debtFreeMonth ?? consumerDebtFreeMonth) ??
                    debtTimelineCapOrDash}
                </span>
                <span className="summary-hint">
                  Month when modeled consumer balances reach $0
                </span>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Interest saved</span>
              <span className="summary-value accent">
                {toCurrency(interestSavedVsMinimum)}
              </span>
              <span className="summary-hint">
                Consumer interest vs. minimum-only, through the month you clear
                consumer debt
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Weighted APR</span>
              <span className="summary-value">
                {aggregated.total > 0
                  ? `${aggregated.weightedRate.toFixed(2)}%`
                  : "—"}
              </span>
            </div>
            {isPremium && (bankingActive || (helocAcceleration && hasHelocLimit)) ? (
              <div className="summary-item">
                <span className="summary-label">
                  {helocAcceleration
                    ? "Ending HELOC balance"
                    : "Ending Banking Strategy net"}
                </span>
                <span className="summary-value">
                  {helocAcceleration
                    ? toCurrency(endingHelocBalance)
                    : toCurrency(endingNetPolicyEquity)}
                </span>
              </div>
            ) : null}
          </div>

          {isPremium && form.acceleration_method === ACCELERATION_METHODS.BANKING ? (
            <div className="banking-cta">
              <p>
                This strategy can be very powerful when structured correctly. If
                you&apos;d like help setting this up, we can walk you through it
                step-by-step.
              </p>
              <a
                className="cta-soft"
                href={STRATEGY_CALL_URL || "https://cal.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Free Strategy Call
              </a>
            </div>
          ) : null}

          {isPremium ? (
            helocAcceleration && !hasHelocLimit ? (
            <div className="help tight" style={{ marginTop: 10 }}>
              Enter your HELOC credit limit to see accurate projections.
            </div>
            ) : (
              <>
                <h3 className="subsection-title chart-heading">Balance projection</h3>
                <ProjectionChart
                  rows={rows}
                  showPolicy={showPolicySeries}
                  debtLineLabel={chartDebtLineLabel}
                  ariaLabel={chartAriaLabel}
                />

                <h3 className="subsection-title">Month-by-month</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>
                          {helocAcceleration
                            ? "Total balance (consumer + HELOC)"
                            : "Consumer debt"}
                        </th>
                        {helocAcceleration ? <th>HELOC balance</th> : null}
                        {bankingActive ? <th>Banking Strategy (net)</th> : null}
                        <th>Payments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 24).map((row) => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>{toCurrency(row.debtBalance)}</td>
                          {helocAcceleration ? (
                            <td>{toCurrency(row.helocBalance ?? 0)}</td>
                          ) : null}
                          {bankingActive ? (
                            <td>{toCurrency(row.policyValue)}</td>
                          ) : null}
                          <td>{toCurrency(row.totalDebtPayment)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="small footnote-table">
                  First 24 months shown. Chart spans all {simulationMonths} simulated
                  months (through payoff or a {capYearsLabel}-year cap
                  {form.advanced_projection_years?.trim()
                    ? ", per Advanced settings"
                    : ""}
                  ).
                </p>
              </>
            )
          ) : null}
          </>
          ) : (
            <div
              role="status"
              aria-live="polite"
              style={{
                margin: "6px 0 0",
                padding: "20px 22px 22px",
                background: "var(--card)",
                border: "1px solid #e8ecf4",
                borderRadius: 14,
                boxShadow:
                  "0 1px 3px rgba(15, 23, 42, 0.05), 0 6px 20px rgba(15, 23, 42, 0.05)"
              }}
            >
              <h3
                className="subsection-title"
                style={{ marginTop: 0, marginBottom: 10 }}
              >
                {aggregated.total > 0
                  ? "Add income and expenses to unlock projections"
                  : "Your results will appear here"}
              </h3>
              {aggregated.total > 0 ? (
                <p className="help tight" style={{ marginBottom: 0 }}>
                  You already have debt balances in Step 1. Enter monthly income and
                  living expenses so the model can allocate cash flow and show strategy
                  comparison, timelines, and month-by-month projections here.
                </p>
              ) : (
                <>
                  <p className="help tight" style={{ marginBottom: 12 }}>
                    Enter your debts and monthly numbers on the left to see your payoff
                    timeline, interest savings, and strongest strategy path.
                  </p>
                  <p className="help tight" style={{ marginBottom: 0 }}>
                    Once you enter your numbers, we&apos;ll compare payoff options and
                    show your best next step.
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CalculatorPage />
    </Suspense>
  );
}
