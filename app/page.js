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
import { useMemo, useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  aggregateDebts,
  computeDebtCashAllocation,
  computeLayeredProjection,
  getDebtPayoffDisplayOrder,
  PAYOFF_METHODS,
  ACCELERATION_METHODS,
  AUTO_PROJECTION_CAP_MONTHS
} from "./lib/finance";
import { toCurrency } from "./lib/format";
import {
  appendScenario,
  deleteScenarioById,
  readLastSession,
  readScenarioList,
  writeLastSession
} from "./lib/localScenarios";

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
    monthly_income: defaults.monthly_income,
    monthly_expenses: defaults.monthly_expenses,
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
  /** Legacy default income/expense pair from older builds; show blank Step 1 fields. */
  if (
    String(clientNorm).trim() === "" &&
    String(emailNorm).trim() === "" &&
    monthlyIncomeNorm === 10000 &&
    monthlyExpensesNorm === 6500
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

export default function HomePage() {
  const [form, setForm] = useState(() => buildDefaultForm());
  const [saveStatus, setSaveStatus] = useState("");
  const [localScenarios, setLocalScenarios] = useState([]);
  const [loadScenarioSelect, setLoadScenarioSelect] = useState("");
  const [deleteScenarioId, setDeleteScenarioId] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setLocalScenarios(readScenarioList());
    const last = readLastSession();
    if (last) {
      setForm(normalizeFormSnapshot(last));
    } else {
      setForm(buildDefaultForm());
    }
    setSessionReady(true);
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    const t = window.setTimeout(() => {
      try {
        writeLastSession(form);
      } catch {
        /* ignore quota / private mode */
      }
    }, 500);
    return () => window.clearTimeout(t);
  }, [form, sessionReady]);

  const aggregated = useMemo(() => aggregateDebts(form.debts), [form.debts]);

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
        payoffMethod: form.payoff_method,
        accelerationMethod: ACCELERATION_METHODS.BANKING
      }),
      heloc: computeLayeredProjection({
        ...shared,
        payoffMethod: form.payoff_method,
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
    totalHelocInterestPaid
  } = projection;
  const rows = schedule.rows;
  const debtFreeMonth = schedule.debtFreeMonth;
  const finalPolicy = endingNetPolicyEquity;

  const capYearsLabel = Math.round(projectionMaxMonths / 12);
  const bankingActive =
    form.acceleration_method === ACCELERATION_METHODS.BANKING &&
    form.use_capital_vehicle;
  const isBankingAcceleration =
    form.acceleration_method === ACCELERATION_METHODS.BANKING;
  const helocAcceleration =
    form.acceleration_method === ACCELERATION_METHODS.HELOC;
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

  const bestPathForward = useMemo(() => {
    const effPay =
      form.payoff_method === PAYOFF_METHODS.FASTEST_ROUTE &&
      projection.effectivePayoffMethod
        ? projection.effectivePayoffMethod
        : form.payoff_method;

    const isStd = form.acceleration_method === ACCELERATION_METHODS.STANDARD;
    const standardMinimumPath = isStd && appliedTowardStrategy === 0;

    let recommended = "";
    if (form.acceleration_method === ACCELERATION_METHODS.BANKING) {
      recommended = "Banking Strategy";
    } else if (form.acceleration_method === ACCELERATION_METHODS.HELOC) {
      recommended = "HELOC Strategy";
    } else if (standardMinimumPath) {
      recommended = "Minimum Payment";
    } else if (effPay === PAYOFF_METHODS.AVALANCHE) {
      recommended = "Accelerated Avalanche";
    } else {
      recommended = "Accelerated Snowball";
    }

    const sb = strategyComparisonProjections.standardSnowball;
    const av = strategyComparisonProjections.standardAvalanche;
    const bankProj = strategyComparisonProjections.banking;

    const consumerMo = (p) =>
      p.policyContributionExceedsAppliedStrategy ? null : p.consumerDebtFreeMonth;

    const fasterStandardLabel = () => {
      const msb = consumerMo(sb);
      const mav = consumerMo(av);
      if (msb == null && mav == null) return "Accelerated Snowball";
      if (msb == null) return "Accelerated Avalanche";
      if (mav == null) return "Accelerated Snowball";
      return msb <= mav ? "Accelerated Snowball" : "Accelerated Avalanche";
    };

    let backup = "";
    if (form.acceleration_method === ACCELERATION_METHODS.BANKING) {
      backup = fasterStandardLabel();
    } else if (form.acceleration_method === ACCELERATION_METHODS.HELOC) {
      backup = "Accelerated Avalanche";
    } else if (standardMinimumPath) {
      backup = "Accelerated Snowball";
    } else if (isStd) {
      const bankingRuns = !bankProj.policyContributionExceedsAppliedStrategy;
      if (bankingRuns && aggregated.total > 0) {
        backup = "Banking Strategy";
      } else if (effPay === PAYOFF_METHODS.AVALANCHE) {
        backup = "Accelerated Snowball";
      } else {
        backup = "Accelerated Avalanche";
      }
    } else {
      backup = fasterStandardLabel();
    }

    const bullets = [];

    if (!policyContributionExceedsAppliedStrategy) {
      const tl = formatDebtFreeMonths(timelineDebtFreeMonth);
      if (tl) {
        bullets.push(
          `Faster debt payoff trajectory on this path: ${tl} to the primary modeled milestone.`
        );
      }
    }

    if (!policyContributionExceedsAppliedStrategy && interestSavedVsMinimum > 0) {
      bullets.push(
        `Interest savings vs minimum-only through your modeled consumer payoff: ${toCurrency(interestSavedVsMinimum)}.`
      );
    }

    if (
      form.acceleration_method === ACCELERATION_METHODS.BANKING &&
      bankingActive &&
      !policyContributionExceedsAppliedStrategy
    ) {
      bullets.push(
        `Capital-building angle: modeled Banking Strategy net (cash value − loan) ends around ${toCurrency(endingNetPolicyEquity)}.`
      );
    }

    if (isStd && !standardMinimumPath) {
      bullets.push(
        "Works without needing a policy first—an excellent foundation if you explore Banking Strategy later."
      );
    }

    if (
      form.acceleration_method === ACCELERATION_METHODS.HELOC &&
      !policyContributionExceedsAppliedStrategy
    ) {
      bullets.push(
        `HELOC path uses your line as a hub; modeled HELOC interest totals ${toCurrency(totalHelocInterestPaid ?? 0)}—weigh that against payoff speed in the cards below.`
      );
    }

    if (standardMinimumPath) {
      bullets.push(
        "Minimums keep payments predictable; even a modest strategy budget can materially shorten the curve."
      );
    }

    let trimmed = bullets.slice(0, 4);
    if (trimmed.length === 0) {
      trimmed = [
        "Every comparison below reuses your Step 1 inputs so you can judge paths side by side without retyping.",
        "Tweak payoff order or acceleration anytime—this summary updates with your selections."
      ];
    } else if (trimmed.length === 1) {
      trimmed.push(
        "Use the strategy comparison cards to sanity-check this path against alternatives with the same assumptions."
      );
    }
    trimmed = trimmed.slice(0, 4);

    return { recommended, backup, bullets: trimmed };
  }, [
    form.payoff_method,
    form.acceleration_method,
    appliedTowardStrategy,
    projection.effectivePayoffMethod,
    strategyComparisonProjections,
    aggregated.total,
    policyContributionExceedsAppliedStrategy,
    interestSavedVsMinimum,
    timelineDebtFreeMonth,
    bankingActive,
    endingNetPolicyEquity,
    totalHelocInterestPaid
  ]);

  const updateField = useCallback((name, value) => {
    setForm((prev) => ({
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
    }));
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
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Reset the form to a blank test scenario? Saved scenarios in this browser are not deleted."
      )
    ) {
      return;
    }
    const next = buildTestResetForm();
    setForm(next);
    setLoadScenarioSelect("");
    setDeleteScenarioId("");
    setSaveStatus("success|Form reset — ready for a new test case.");
    if (typeof window !== "undefined") {
      try {
        writeLastSession(next);
      } catch {
        /* ignore quota / private mode */
      }
    }
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
          <p className="help tight">
            Enter your debts and monthly numbers below, then we&apos;ll show you the
            strongest payoff path based on your situation.
          </p>

          <div className="local-scenarios-panel step1-scenario-controls">
            <p className="help tight local-scenarios-lead">
              Your progress saves automatically on this device. You can come back
              anytime and continue where you left off.
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

          <div className="button-row button-row-save-reset step1-scenario-actions">
            <button type="button" className="primary" onClick={saveScenario}>
              Save scenario
            </button>
            <button
              type="button"
              className="button-reset-test"
              onClick={handleResetTestScenario}
            >
              Reset Test Scenario
            </button>
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
            <div className="field">
              <label>Monthly income</label>
              <input
                type="number"
                min={0}
                value={form.monthly_income || ""}
                onChange={(e) => updateField("monthly_income", e.target.value)}
                placeholder="e.g. 4000"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label>Living expenses (excluding debt payments)</label>
              <input
                type="number"
                min={0}
                value={form.monthly_expenses || ""}
                onChange={(e) => updateField("monthly_expenses", e.target.value)}
                placeholder="e.g. 1500"
                autoComplete="off"
              />
            </div>
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
              <input
                type="number"
                min={0}
                placeholder={`Leave blank to use full amount (${toCurrency(cashAllocationPreview.availableForStrategy)})`}
                value={form.amount_toward_debt_strategy}
                onChange={(e) =>
                  updateField("amount_toward_debt_strategy", e.target.value)
                }
              />
            </div>
          </div>

          {appliedExceedsAvailableForStrategy ? (
            <div className="inline-warn" role="alert">
              Amount exceeds available for strategy
            </div>
          ) : null}

          <p className="help tight">
            Start by entering your debts below. We&apos;ll show you the fastest way
            to pay them off.
          </p>
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
                  <label>Balance</label>
                  <input
                    type="number"
                    min={0}
                    value={d.balance || ""}
                    onChange={(e) => updateDebt(d.id, "balance", e.target.value)}
                    placeholder="e.g. 15000"
                  />
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
                  <label>Min. payment</label>
                  <input
                    type="number"
                    min={0}
                    value={d.minPayment || ""}
                    onChange={(e) => updateDebt(d.id, "minPayment", e.target.value)}
                    placeholder="e.g. 300"
                  />
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

          <div
            className="standard-payoff-compare-panel"
            aria-label="Compare your Snowball and Avalanche payoff options"
          >
            <h4 className="panel-title standard-payoff-compare-heading">
              Compare Your Payoff Options
            </h4>
            <p className="help tight standard-payoff-compare-lead">
              See which payoff option gets you out of debt faster.
              <br />
              Then choose how you want to accelerate it.
              <br />
              Same numbers you entered above—timeline and interest saved for each
              approach, side by side. Use the buttons below or choose Fastest Route next;
              Step 2 updates immediately.
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
          </div>

          {form.acceleration_method === ACCELERATION_METHODS.BANKING ? (
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
              {bankingActive && policyContributionExceedsAppliedStrategy ? (
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

          {form.acceleration_method === ACCELERATION_METHODS.HELOC ? (
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

          <div className="field full">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Assumptions, goals, follow-ups…"
            />
          </div>

          {surplus < 0 ? (
            <div className="inline-warn" role="status">
              Living expenses plus minimum payments exceed income in this snapshot.
              Adjust inputs so monthly income can cover at least contractual minimums.
            </div>
          ) : null}

          {hitProjectionCap && aggregated.total > 0 ? (
            <div className="inline-warn" role="status">
              Balances were still outstanding after the {capYearsLabel}-year
              ceiling. Raise income, lower living expenses, increase paydowns/draws,
              or
              extend the horizon under Advanced settings.
            </div>
          ) : null}
        </section>

        <section className="card step-card results-card" aria-labelledby="step2-heading">
          <div className="step-badge secondary">Step 2</div>
          <h2 id="step2-heading">Projected results</h2>
          {policyContributionExceedsAppliedStrategy ? (
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
            <strong className="strategy-pill-label">{scenarioSummary}</strong>
            {form.acceleration_method === ACCELERATION_METHODS.HELOC ? (
              <span className="subtle">
                {" "}
                · HELOC APR {Number(form.heloc_interest_rate) || 0}%
              </span>
            ) : null}
          </p>

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
            <p className="help tight" style={{ marginBottom: 18 }}>
              Based on your numbers, here is the strongest strategy path to help you
              eliminate debt faster and improve long-term financial control.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: 6
                  }}
                >
                  Recommended Strategy
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3
                  }}
                >
                  {bestPathForward.recommended}
                </p>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: 8
                  }}
                >
                  Why This Fits
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: "var(--text)",
                    fontSize: "0.9rem",
                    lineHeight: 1.55
                  }}
                >
                  {bestPathForward.bullets.map((line, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: 6
                  }}
                >
                  Backup Path
                </div>
                <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text)" }}>
                  If priorities change, a strong alternate to model next is{" "}
                  <strong>{bestPathForward.backup}</strong>—same numbers, different
                  mechanics. Not every strategy fits every situation. The goal is to
                  identify the best next step for where you are right now.
                </p>
              </div>
            </div>
            {form.acceleration_method !== ACCELERATION_METHODS.BANKING ? (
              <p
                className="help tight"
                style={{ marginTop: 16, marginBottom: 0, fontSize: "0.86rem" }}
              >
                Standard and HELOC paths can be powerful on their own—you are not
                behind if Banking Strategy is not the right fit today. When you are
                ready, the Banking column below shows how capital-building could layer
                on with the same inputs.
              </p>
            ) : (
              <p
                className="help tight"
                style={{ marginTop: 16, marginBottom: 0, fontSize: "0.86rem" }}
              >
                Banking Strategy can pair disciplined paydown with long-term capital
                optionality; keep monitoring contributions and loan mechanics so the
                model stays aligned with how you run the plan.
              </p>
            )}
          </div>

          <div
            className="strategy-comparison-section"
            aria-label="Strategy comparison using your current inputs"
          >
            <h3 className="subsection-title">Strategy Comparison</h3>
            <p className="help tight strategy-comparison-lead">
              Uses the same income, expenses, debts, and strategy budget as Step 1. Four
              projections run in the background—you do not need to switch strategies.
              Snowball (Standard) and Avalanche (Standard) use Standard acceleration with
              fixed payoff order; Banking Strategy and HELOC use your selected payoff method (
              {payoffLabel(form.payoff_method)}).
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
                  Snowball (Standard)
                </h4>
                <p className="strategy-comparison-card-sub subtle">
                  Snowball · Standard acceleration
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Consumer Debt-Free Timeline</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.standardSnowball,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Total Debt-Free Timeline</dt>
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
                    <dt>Ending balance</dt>
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
                <h4 className="strategy-comparison-card-title">Avalanche</h4>
                <p className="strategy-comparison-card-sub subtle">
                  Avalanche · Standard acceleration
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Consumer Debt-Free Timeline</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.standardAvalanche,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Total Debt-Free Timeline</dt>
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
                    <dt>Ending balance</dt>
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
                  form.acceleration_method === ACCELERATION_METHODS.BANKING
                    ? " strategy-comparison-card--current"
                    : ""
                }`}
              >
                <h4 className="strategy-comparison-card-title">
                  Banking Strategy
                </h4>
                <p className="strategy-comparison-card-sub subtle">
                  {payoffLabel(form.payoff_method)} · policy loan model
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Consumer Debt-Free Timeline</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.banking,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Total Debt-Free Timeline</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.banking,
                        "total"
                      )}
                    </dd>
                  </div>
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
                    <dt>Ending balance</dt>
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
              <div
                className={`strategy-comparison-card${
                  form.acceleration_method === ACCELERATION_METHODS.HELOC
                    ? " strategy-comparison-card--current"
                    : ""
                }`}
              >
                <h4 className="strategy-comparison-card-title">HELOC</h4>
                <p className="strategy-comparison-card-sub subtle">
                  {payoffLabel(form.payoff_method)} · HELOC acceleration
                </p>
                <dl className="strategy-comparison-dl">
                  <div className="strategy-comparison-row">
                    <dt>Consumer Debt-Free Timeline</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.heloc,
                        "consumer"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Total Debt-Free Timeline</dt>
                    <dd className="strategy-comparison-dd--timeline">
                      {renderStrategyComparisonTimelineInCards(
                        strategyComparisonProjections.heloc,
                        "total"
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Interest saved</dt>
                    <dd>
                      {toCurrency(
                        strategyComparisonProjections.heloc.interestSavedVsMinimum
                      )}
                    </dd>
                  </div>
                  <div className="strategy-comparison-row">
                    <dt>Ending balance</dt>
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
              </div>
            </div>
          </div>

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
                    {debtPayoffOrder.map((d) => (
                      <tr
                        key={d.id}
                        className={d.cleared ? "payoff-order-row-paid" : ""}
                      >
                        <td>{d.order}</td>
                        <td>{d.name?.trim() ? d.name : `Debt ${d.order}`}</td>
                        <td>{toCurrency(d.balance)}</td>
                        <td>{d.rate.toFixed(2)}%</td>
                        <td>{toCurrency(d.minPayment)}</td>
                        <td>{d.cleared ? "Paid" : "Open"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {bankingActive && !policyContributionExceedsAppliedStrategy ? (
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
                        {toCurrency(helocPayoffTriggerMonth1.amountNeededToEliminate)}
                      </dd>
                      <dt>HELOC balance</dt>
                      <dd>{toCurrency(helocPayoffTriggerMonth1.helocBalance)}</dd>
                      <dt>Credit limit</dt>
                      <dd>{toCurrency(helocPayoffTriggerMonth1.helocCreditLimit)}</dd>
                      <dt>Available credit</dt>
                      <dd>
                        {toCurrency(helocPayoffTriggerMonth1.availableCredit)}
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
                      <dd>{toCurrency(helocStateLatest.amountNeededToEliminate)}</dd>
                      <dt>HELOC balance</dt>
                      <dd>{toCurrency(helocStateLatest.helocBalance)}</dd>
                      <dt>Credit limit</dt>
                      <dd>{toCurrency(helocStateLatest.helocCreditLimit)}</dd>
                      <dt>Available credit</dt>
                      <dd>{toCurrency(helocStateLatest.availableCredit)}</dd>
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
                        {toCurrency(helocStateLatest.freedMinimumsStackedPerMonth)}
                      </dd>
                    </dl>
                  ) : (
                    <p className="subtle">—</p>
                  )}
                </div>
              </div>
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
                  <div className="value">{toCurrency(policyContrib)}</div>
                  <p className="stat-hint">
                    From your monthly strategy budget
                  </p>
                </>
              ) : helocAcceleration ? (
                <>
                  <div className="label">Total HELOC interest (projected)</div>
                  <div className="value">
                    {toCurrency(totalHelocInterestPaid ?? 0)}
                  </div>
                  <p className="stat-hint">
                    Accrued on the modeled HELOC balance through the simulated
                    months
                  </p>
                </>
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
              <span className="summary-value">{toCurrency(aggregated.total)}</span>
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
            ) : helocAcceleration ? (
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
            {helocAcceleration || bankingActive ? (
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

          {form.acceleration_method === ACCELERATION_METHODS.BANKING ? (
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
            First 24 months shown. Chart spans all {simulationMonths} simulated months
            (through payoff or a {capYearsLabel}-year cap
            {form.advanced_projection_years?.trim()
              ? ", per Advanced settings"
              : ""}
            ).
          </p>
        </section>
      </div>
    </main>
  );
}
