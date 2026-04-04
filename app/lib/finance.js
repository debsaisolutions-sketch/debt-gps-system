/**
 * Layered model: Payoff Method (Snowball | Avalanche | Fastest Route) × Acceleration (Standard | Banking | HELOC).
 *
 * Consumer interest only (for baseline vs selected comparison):
 * - baselineMinimumProjection: each month, accrue APR/12 on each positive balance, then pay only
 *   that debt’s stated minimum (capped by balance after interest). No income/surplus, no banking/HELOC.
 * - selectedStrategyProjection: same accrual rules on consumer balances; pay from income − living expenses,
 *   draws, and payoff ordering. HELOC / policy loan interest is tracked separately and excluded
 *   from interestSaved.
 *
 * Banking Strategy (banking + capital vehicle): contribute → build CV → borrow up to (CV × LTV%) minus loan
 * balance when meaningful (lump to payoff target and/or liquidity for minimums), not on a fixed monthly draw
 * schedule; policy-loan principal from operating cash only; recycle leftover pools to CV. Freed minimums stack
 * as debts clear.
 *
 * interestSaved (UI): baseline consumer interest through month T minus selected consumer interest
 * through month T, where T = month consumer debt hits $0 in the selected run (or cap if never).
 * T aligns the comparison so runaway 30-year minimum-only scenarios are not compared against a
 * 58-month payoff (which inflated “saved” into millions). Lifetime totals remain on the result for QA.
 *
 * interestSavedStrict (= requirement #4 lifetime): baselineTotalInterestPaid − selectedTotalInterestPaid
 *   over each engine’s full run (can be huge if minimum-only never catches principal in 30 yr).
 *
 * Verified diverge Snowball vs Avalanche: use different balances/rates (e.g. $3k @ 6% and $10k @ 22%) —
 * Snowball attacks $3k first; Avalanche attacks $10k @ 22% first → different interest and timelines.
 *
 * Sample (Std Snowball, $10k income / $6.5k expenses): four debts totaling ~$173k as in UI testing —
 * comparable “Interest saved” uses consumer interest only through your consumer-debt-free month — typically
 * tens of thousands of dollars on this profile, not millions (lifetime minimum-only interest can be millions
 * if balances balloon for decades; that full-lifetime gap is exposed as interestSavedStrict for QA).
 */

export function aggregateDebts(debts) {
  if (!Array.isArray(debts) || debts.length === 0) {
    return { total: 0, weightedRate: 0, totalMin: 0 };
  }
  let total = 0;
  let weightedSum = 0;
  let totalMin = 0;
  for (const d of debts) {
    const b = Math.max(0, Number(d.balance) || 0);
    const rate = Math.max(0, Number(d.rate) || 0);
    const minP = Math.max(0, Number(d.minPayment) || 0);
    total += b;
    weightedSum += b * rate;
    totalMin += minP;
  }
  const weightedRate = total > 0 ? weightedSum / total : 0;
  return { total, weightedRate, totalMin };
}

export const PAYOFF_METHODS = {
  SNOWBALL: "snowball",
  AVALANCHE: "avalanche",
  /** Picks Snowball or Avalanche by shorter simulated total debt-free month (tie → Snowball). */
  FASTEST_ROUTE: "fastest_route"
};

export const ACCELERATION_METHODS = {
  STANDARD: "standard",
  BANKING: "banking",
  HELOC: "heloc"
};

const EPS = 1e-6;

/** HELOC: wipe sub-penny / float-dust balances after all monthly paydowns so payoff hits $0 and simulation stops. */
const HELOC_BALANCE_ZERO_THRESHOLD = 0.01;
const HELOC_FLOAT_DUST_MAX = 0.005;

export const AUTO_PROJECTION_CAP_MONTHS = 30 * 12;

const ADVANCED_PROJECTION_MIN_MONTHS = 12;
const ADVANCED_PROJECTION_MAX_MONTHS = 50 * 12;

export function resolveProjectionMaxMonths(overrideYears) {
  const y = Number(overrideYears);
  if (Number.isFinite(y) && y > 0) {
    const m = Math.round(y * 12);
    return Math.min(
      ADVANCED_PROJECTION_MAX_MONTHS,
      Math.max(ADVANCED_PROJECTION_MIN_MONTHS, m)
    );
  }
  return AUTO_PROJECTION_CAP_MONTHS;
}

export function monthlySurplusAfterMinimums(income, expenses, totalMin) {
  const i = Number(income) || 0;
  const e = Number(expenses) || 0;
  const m = Number(totalMin) || 0;
  return i - e - m;
}

/**
 * availableForStrategy = income − living expenses − totalMinimumPayments (sum of debt mins).
 * appliedTowardStrategy: dollars/month the user allocates to the strategy (Banking splits
 * between policy contribution and extra debt payoff), capped at availableForStrategy.
 * Empty raw → use full availableForStrategy.
 */
export function computeDebtCashAllocation(
  monthlyIncome,
  monthlyExpenses,
  totalMinimumPayments,
  rawAmountTowardStrategy
) {
  const inc = Math.max(0, Number(monthlyIncome) || 0);
  const exp = Math.max(0, Number(monthlyExpenses) || 0);
  const tm = Math.max(0, Number(totalMinimumPayments) || 0);
  const availableForStrategy = Math.max(0, inc - exp - tm);

  const raw =
    rawAmountTowardStrategy == null
      ? ""
      : String(rawAmountTowardStrategy).trim();

  let appliedTowardStrategy = availableForStrategy;
  let appliedExceedsAvailableForStrategy = false;

  if (raw !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0) {
      appliedExceedsAvailableForStrategy = n > availableForStrategy;
      appliedTowardStrategy = Math.min(n, availableForStrategy);
    }
  }

  return {
    availableForStrategy,
    appliedTowardStrategy,
    appliedExceedsAvailableForStrategy
  };
}

function clampBalance(b) {
  return Math.max(0, b);
}

/**
 * After interest, velocity, consumer flow, extra paydown, and freed minimums: clear residual HELOC
 * balance when it is below `HELOC_FLOAT_DUST_MAX` (half-cent float slop) or below one cent, so a full
 * payoff does not stall just above EPS.
 */
function finalizeHelocBalanceAfterAllPayments(helocBal) {
  if (!(helocBal > EPS)) return helocBal;
  if (helocBal < HELOC_FLOAT_DUST_MAX) return 0;
  if (helocBal < HELOC_BALANCE_ZERO_THRESHOLD) return 0;
  return helocBal;
}

function cloneDebtAccounts(raw) {
  return raw
    .map((d) => ({
      balance: clampBalance(Number(d.balance) || 0),
      rate: Math.max(0, Number(d.rate) || 0),
      minPayment: Math.max(0, Number(d.minPayment) || 0)
    }))
    .filter((a) => a.balance > EPS);
}

/** Keeps stable `id` and zero-balance accounts so cleared debts still contribute min to snowball tracking. */
function cloneDebtAccountsWithIds(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((d, i) => {
    const minPayment = Math.max(0, Number(d.minPayment) || 0);
    return {
      id: String(d.id != null ? d.id : `debt-${i}`),
      name: d.name != null ? String(d.name) : "",
      balance: clampBalance(Number(d.balance) || 0),
      rate: Math.max(0, Number(d.rate) || 0),
      minPayment,
      originalMinPayment: minPayment
    };
  });
}

function sortForMinimumPriority(accounts, payoffMethod) {
  const a = accounts.filter((x) => x.balance > EPS);
  if (payoffMethod === PAYOFF_METHODS.SNOWBALL) {
    a.sort((x, y) => x.balance - y.balance);
  } else {
    a.sort((x, y) => y.rate - x.rate || y.balance - x.balance);
  }
  return a;
}

/**
 * Debt ordering for UI: matches `pickPayoffTarget` priority among open balances.
 * Snowball = smallest balance first (re-sorted each month in the engine as balances shrink).
 * Avalanche = highest APR first, then larger balance at the same rate.
 * Paid (zero balance) debts are listed after open debts for reference.
 */
export function getDebtPayoffDisplayOrder(debts, payoffMethod) {
  if (!Array.isArray(debts)) return [];
  const accounts = debts.map((d, i) => ({
    id: String(d.id != null ? d.id : `debt-${i}`),
    name: d.name != null ? String(d.name) : "",
    balance: clampBalance(Number(d.balance) || 0),
    rate: Math.max(0, Number(d.rate) || 0),
    minPayment: Math.max(0, Number(d.minPayment) || 0)
  }));
  const active = accounts.filter((d) => d.balance > EPS);
  const paid = accounts.filter((d) => d.balance <= EPS);
  if (payoffMethod === PAYOFF_METHODS.SNOWBALL) {
    active.sort(
      (x, y) => x.balance - y.balance || String(x.id).localeCompare(String(y.id))
    );
  } else {
    active.sort(
      (x, y) =>
        y.rate - x.rate ||
        y.balance - x.balance ||
        String(x.id).localeCompare(String(y.id))
    );
  }
  const merged = [...active, ...paid];
  return merged.map((d, i) => ({
    order: i + 1,
    id: d.id,
    name: d.name,
    balance: d.balance,
    rate: d.rate,
    minPayment: d.minPayment,
    cleared: d.balance <= EPS
  }));
}

function pickPayoffTarget(active, payoffMethod) {
  if (active.length === 0) return null;
  if (payoffMethod === PAYOFF_METHODS.SNOWBALL) {
    let t = active[0];
    for (let i = 1; i < active.length; i++) {
      if (active[i].balance < t.balance) t = active[i];
    }
    return t;
  }
  let t = active[0];
  for (let i = 1; i < active.length; i++) {
    const d = active[i];
    if (d.rate > t.rate || (d.rate === t.rate && d.balance > t.balance)) t = d;
  }
  return t;
}

function sumArrayPrefix(arr, n) {
  const len = Math.min(n, arr.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += arr[i];
  return s;
}

/**
 * A. baselineMinimumProjection
 * baselineTotalInterestPaid: cumulative consumer interest for full run (to freedom or cap).
 * monthlyConsumerInterest[m-1]: interest charged in month m.
 * totalPrincipalPaid: initial principal sum minus remaining principal after simulation.
 */
export function baselineMinimumProjection(debts, maxMonths) {
  const cap = Math.max(1, Math.min(maxMonths, ADVANCED_PROJECTION_MAX_MONTHS));
  let accounts = cloneDebtAccounts(debts);
  const startPrincipal = accounts.reduce((s, a) => s + a.balance, 0);

  let baselineTotalInterestPaid = 0;
  let totalPaymentsToConsumerDebt = 0;
  const monthlyConsumerInterest = [];

  for (let month = 1; month <= cap; month++) {
    accounts = accounts.filter((a) => a.balance > EPS);
    if (accounts.length === 0) break;

    let monthInt = 0;
    for (const d of accounts) {
      const int = d.balance * (d.rate / 100 / 12);
      d.balance = clampBalance(d.balance + int);
      monthInt += int;
    }
    baselineTotalInterestPaid += monthInt;
    monthlyConsumerInterest.push(monthInt);

    for (const d of accounts) {
      const pay = Math.min(d.balance, d.minPayment);
      totalPaymentsToConsumerDebt += pay;
      d.balance = clampBalance(d.balance - pay);
    }

    for (const d of accounts) {
      if (d.balance < EPS) d.balance = 0;
    }
  }

  const endPrincipal = accounts.reduce((s, a) => s + a.balance, 0);
  const totalPrincipalPaid = Math.max(0, startPrincipal - endPrincipal);

  return {
    baselineTotalInterestPaid,
    totalPrincipalPaid,
    totalPaymentsToConsumerDebt,
    monthlyConsumerInterest,
    simulationMonths: monthlyConsumerInterest.length,
    consumerDebtRemaining: endPrincipal
  };
}

function emptyRows(monthCount) {
  const n = Math.max(1, Math.min(monthCount, ADVANCED_PROJECTION_MAX_MONTHS));
  const rows = [];
  for (let month = 1; month <= n; month++) {
    rows.push({
      month,
      debtBalance: 0,
      helocBalance: 0,
      policyValue: 0,
      totalDebtPayment: 0,
      cumulativeInterest: 0
    });
  }
  return rows;
}

/**
 * B. selectedStrategyProjection — payoff + acceleration; tracks consumer interest separately.
 */
export function selectedStrategyProjection({
  debts,
  payoffMethod,
  accelerationMethod,
  monthlyIncome,
  monthlyExpenses,
  appliedTowardStrategy,
  projectionMaxMonths,
  useCapitalVehicle,
  monthlyPolicyContribution,
  annualPolicyGrowthPct,
  policyLoanInterestPct,
  policyLoanLtvPct,
  startingPolicyCashValue,
  helocInterestPct,
  helocCreditLimit,
  maxMonthlyHelocDraw,
  startingHelocBalance,
  amountTowardDebtStrategyRaw = ""
}) {
  void maxMonthlyHelocDraw;
  const totalMonths = Math.max(
    1,
    Math.min(projectionMaxMonths, ADVANCED_PROJECTION_MAX_MONTHS)
  );
  const income = Math.max(0, Number(monthlyIncome) || 0);
  const expenses = Math.max(0, Number(monthlyExpenses) || 0);
  const monthlyCashAvailable = income - expenses;
  const appliedStrategy = Math.max(0, Number(appliedTowardStrategy) || 0);

  let accounts = cloneDebtAccountsWithIds(debts);
  const aggregated = aggregateDebts(debts);

  const isBanking =
    accelerationMethod === ACCELERATION_METHODS.BANKING && useCapitalVehicle;
  const contribTarget = Math.max(0, Number(monthlyPolicyContribution) || 0);
  const extraDebtCap = isBanking
    ? Math.max(0, appliedStrategy - contribTarget)
    : appliedStrategy;

  if (aggregated.total <= EPS && accelerationMethod !== ACCELERATION_METHODS.HELOC) {
    return {
      rows: emptyRows(1),
      debtFreeMonth: null,
      consumerDebtFreeMonth: null,
      selectedTotalInterestPaid: 0,
      totalHelocInterestPaid: 0,
      monthlyConsumerInterest: [],
      monthlyPaymentToDebt: monthlyCashAvailable,
      appliedTowardStrategy: appliedStrategy,
      budgetExtraDebtPayoff: extraDebtCap,
      lastPolicyContribution: 0,
      endingNetPolicyEquity: 0,
      endingPolicyLoan: 0,
      endingHelocBalance: 0,
      simulationMonths: 1,
      hitProjectionCap: false,
      totalPrincipalPaid: 0,
      totalPaymentsToConsumerDebt: 0,
      bankingPayoffWarning: false,
      bankingPayoffTriggerMonth1: null,
      bankingStateLatest: null,
      cumulativePolicyLoanPrincipalPaid: 0,
      helocPayoffTriggerMonth1: null,
      helocStateLatest: null
    };
  }

  const isHeloc = accelerationMethod === ACCELERATION_METHODS.HELOC;

  let policyCV = Math.max(0, Number(startingPolicyCashValue) || 0);
  let policyLoan = 0;

  const growthM = (Number(annualPolicyGrowthPct) || 0) / 100 / 12;
  const loanRateM = (Number(policyLoanInterestPct) || 0) / 100 / 12;
  const helocRateM = (Number(helocInterestPct) || 0) / 100 / 12;
  let ltvPct = Number(policyLoanLtvPct);
  if (!Number.isFinite(ltvPct)) ltvPct = 90;
  ltvPct = Math.min(100, Math.max(0, ltvPct));
  const policyLtvRatio = ltvPct / 100;
  const helocLimit = Math.max(
    0,
    Number(helocCreditLimit) || aggregated.total || 0
  );

  let helocBal = 0;
  if (isHeloc) {
    helocBal = Math.max(0, Number(startingHelocBalance) || 0);
    if (helocLimit > EPS) helocBal = Math.min(helocBal, helocLimit);
  }

  const startPrincipal = accounts.reduce((s, a) => s + a.balance, 0);
  const rows = [];
  const monthlyConsumerInterest = [];
  let selectedTotalInterestPaid = 0;
  let totalHelocInterestAccrued = 0;
  let totalPaymentsToConsumerDebt = 0;
  let debtFreeMonth = null;
  let consumerDebtFreeMonth = null;
  let lastContrib = 0;

  /*
   * Banking Strategy — policy-loan snowball (high level):
   *
   * Debt ordering: same as payoff method — Snowball picks the smallest positive balance each
   * month; Avalanche picks the highest APR (then larger balance at tie). `pickPayoffTarget`
   * mirrors that priority on active accounts only.
   *
   * Payoff trigger (policy loan): borrow only when remaining capacity can eliminate the current
   * target in full (no partial strategic draws). Liquidity draws still cover contractual minimums
   * when operating cash falls short.
   *
   * Ongoing contribution: each month the Banking contribution slice still credits CV before any
   * borrow decision. That is separate from cash that used to go to cleared debts.
   *
   * Freed minimum redirection: when a debt hits $0, its contractual minimum is no longer paid
   * out; that dollar amount stays in the monthly operating pool (`op`). After consumer mins and
   * extra principal, every remaining `op` dollar pays policy-loan principal, so freed minimums
   * stack as more debts clear.
   *
   * 1) CV × LTV% = max loan allowed; remaining capacity caps draws.
   * 2) Pay mins on open debts, then extra principal toward the target (capped).
   * 3) Apply all remaining operating cash (incl. stacked freed mins) to policy-loan principal.
   * 4) Recycle leftover pools into CV.
   *
   * Standard / HELOC paths skip the loan/CV machinery; HELOC still pays the line after consumer
   * debt is cleared.
   */
  const clearedConsumerDebtIds = new Set();
  let bankingRiskScoreMonths = 0;
  let monthsWithConsumerDebtWhileBanking = 0;
  /** Full policy-loan principal paid in simulation (operating pool after mins/extra, includes recycled freed minimums). */
  let cumulativePolicyLoanPrincipalPaid = 0;
  /** Pre–strategic-draw snapshot for month 1 (payoff trigger transparency). */
  let bankingPayoffTriggerMonth1 = null;
  /** End-of-month snapshot; last month processed wins (live projection refresh). */
  let bankingStateLatest = null;
  let helocPayoffTriggerMonth1 = null;
  let helocStateLatest = null;
  let helocDbgStrategicDrawTriggeredThisMonth = false;
  let helocDbgStrategicDebtsClearedThisMonth = 0;
  let helocDbgStrategicAmountDrawnThisMonth = 0;
  let helocDbgSmallestActiveDebtBalance = 0;
  let helocDbgRemainingCreditAfterRepaymentBeforeDraw = 0;

  for (let month = 1; month <= totalMonths; month++) {
    let monthConsumerInt = 0;
    for (const d of accounts) {
      if (d.balance <= EPS) continue;
      const int = d.balance * (d.rate / 100 / 12);
      d.balance = clampBalance(d.balance + int);
      monthConsumerInt += int;
    }
    selectedTotalInterestPaid += monthConsumerInt;
    monthlyConsumerInterest.push(monthConsumerInt);

    if (isBanking) {
      // (1) Loan interest accrues; illustrated cash value grows (crediting before cash moves this month).
      policyLoan *= 1 + loanRateM;
      policyCV *= 1 + growthM;
    }

    if (isHeloc && helocBal > EPS) {
      const hi = helocBal * helocRateM;
      helocBal = clampBalance(helocBal + hi);
      totalHelocInterestAccrued += hi;
    }

    let cash = monthlyCashAvailable;
    let totalPaidThisMonth = 0;
    let op = 0;
    let br = 0;
    let borrowRoomAtStart = 0;
    let strategicLumpThisMonth = 0;
    let liquidityDrawThisMonth = 0;

    if (isBanking) {
      // Contribute from operating cash (strategy slice); CV grows before any borrow decision.
      const c = Math.min(contribTarget, cash);
      cash -= c;
      policyCV += c;
      lastContrib = c;
      op = Math.max(0, cash);
      br = 0;

      const maxLoanAllowed = () => policyCV * policyLtvRatio;
      const remainingBorrowCapacity = () =>
        Math.max(0, maxLoanAllowed() - policyLoan);

      borrowRoomAtStart = remainingBorrowCapacity();

      const activeBalances = () => accounts.filter((d) => d.balance > EPS);
      const minNeedOpenDebts = () => {
        let s = 0;
        for (const d of activeBalances()) {
          s += Math.min(d.minPayment, d.balance);
        }
        return s;
      };

      // Impactful lump only: borrow and send directly to payoff target (not a monthly drip).
      const act = activeBalances();
      const borrowCap = remainingBorrowCapacity();

      if (month === 1 && act.length > 0) {
        const t0 = pickPayoffTarget(act, payoffMethod);
        bankingPayoffTriggerMonth1 = {
          month: 1,
          targetId: t0?.id ?? null,
          targetName: t0?.name ?? "",
          amountNeededToEliminate: t0?.balance ?? 0,
          policyCashValue: policyCV,
          policyLoanBalance: policyLoan,
          remainingBorrowCapacity: borrowCap,
          canEliminateTargetNow: !!(t0 && borrowCap >= t0.balance - EPS),
          freedMinimumsStackedPerMonth: 0,
          cumulativePolicyLoanPrincipalPaid
        };
      }

      // Banking strategic draws: full payoffs only, in payoff order; wipe as many debts as borrow room allows.
      if (act.length > 0 && borrowCap > EPS) {
        let remBorrow = remainingBorrowCapacity();
        const orderedBank = sortForMinimumPriority(accounts, payoffMethod);
        for (const d of orderedBank) {
          if (d.balance <= EPS) continue;
          if (remBorrow + EPS < d.balance) continue;
          const L = d.balance;
          policyLoan += L;
          d.balance = 0;
          clearedConsumerDebtIds.add(d.id);
          strategicLumpThisMonth += L;
          totalPaymentsToConsumerDebt += L;
          totalPaidThisMonth += L;
          remBorrow -= L;
        }
      }

      // Liquidity draw only if operating cash cannot cover contractual minimums (separate from strategic lump).
      const needMins = minNeedOpenDebts();
      if (op < needMins - EPS && remainingBorrowCapacity() > EPS) {
        const liq = Math.min(needMins - op, remainingBorrowCapacity());
        if (liq > EPS) {
          policyLoan += liq;
          op += liq;
          br += liq;
          liquidityDrawThisMonth = liq;
        }
      }

      cash = op + br;
    }

    const helocPaysConsumer = isHeloc && !isBanking;

    const payConsumerFromPools = (pay) => {
      totalPaymentsToConsumerDebt += pay;
      cash -= pay;
      totalPaidThisMonth += pay;
      if (isBanking) {
        const fromOp = Math.min(pay, op);
        op -= fromOp;
        br -= pay - fromOp;
      }
    };

    /*
     * HELOC (simplified): month-start HELOC interest already applied above.
     * Borrow only when availableCredit (limit − balance) >= full payoff-target balance — no partial draws.
     * Contractual minimums: if monthlyCashAvailable covers total minimums, pay from cash only; otherwise
     * draw only the shortfall onto the HELOC (capped by credit limit), add to cash, then pay minimums —
     * no extra principal / aggressive cash sweeps.
     * Repay line with strategy budget (raw amountTowardDebtStrategyRaw only) plus freed minimums from
     * debts cleared in prior months.
     */
    let extraRemaining = extraDebtCap;
    if (helocPaysConsumer) {
      const strategyBudget = amountTowardDebtStrategyRaw;

      let availableCredit = Math.max(0, helocLimit - helocBal);
      const actHeloc = accounts.filter((d) => d.balance > EPS);
      if (month === 1 && actHeloc.length > 0) {
        const t0 = pickPayoffTarget(actHeloc, payoffMethod);
        const nextDebtBalance0 = t0?.balance ?? 0;
        helocPayoffTriggerMonth1 = {
          month: 1,
          targetId: t0?.id ?? null,
          targetName: t0?.name ?? "",
          amountNeededToEliminate: nextDebtBalance0,
          helocBalance: helocBal,
          helocCreditLimit: helocLimit,
          availableCredit,
          canEliminateTargetNow: !!(
            t0 &&
            nextDebtBalance0 > EPS &&
            availableCredit + EPS >= nextDebtBalance0
          )
        };
      }

      const tBorrow =
        actHeloc.length > 0 ? pickPayoffTarget(actHeloc, payoffMethod) : null;
      const nextDebtBalance =
        tBorrow && tBorrow.balance > EPS ? tBorrow.balance : 0;
      availableCredit = Math.max(0, helocLimit - helocBal);
      if (
        tBorrow &&
        nextDebtBalance > EPS &&
        availableCredit + EPS >= nextDebtBalance
      ) {
        helocBal = Math.min(helocLimit, helocBal + nextDebtBalance);
        tBorrow.balance = 0;
        totalPaymentsToConsumerDebt += nextDebtBalance;
        totalPaidThisMonth += nextDebtBalance;
      }

      cash = monthlyCashAvailable;
      const activeForMinH = sortForMinimumPriority(accounts, payoffMethod);
      let totalMinimums = 0;
      for (const d of activeForMinH) {
        if (d.balance <= EPS) continue;
        totalMinimums += Math.min(d.balance, d.minPayment);
      }
      if (totalMinimums > EPS && cash + EPS < totalMinimums) {
        const shortfall = totalMinimums - cash;
        const room = Math.max(0, helocLimit - helocBal);
        const draw = Math.min(shortfall, room);
        if (draw > EPS) {
          helocBal = Math.min(helocLimit, helocBal + draw);
          cash += draw;
        }
      }
      for (const d of activeForMinH) {
        if (d.balance <= EPS) continue;
        const need = Math.min(d.balance, d.minPayment);
        const fromCash = Math.min(need, cash);
        if (fromCash > EPS) {
          x.d.balance = clampBalance(x.d.balance - fromCash);
          totalPaymentsToConsumerDebt += fromCash;
          totalPaidThisMonth += fromCash;
        }
        x.paidFromCash = fromCash;
      }

      let freedMinimums = 0;
      for (const d of accounts) {
        if (clearedConsumerDebtIds.has(d.id)) freedMinimums += d.minPayment;
      }
      const paymentToHeloc =
        Math.max(0, Number(strategyBudget) || 0) + freedMinimums;
      const helocBeforeRepay = helocBal;
      helocBal = clampBalance(Math.max(0, helocBal - paymentToHeloc));
      totalPaidThisMonth += helocBeforeRepay - helocBal;

      extraRemaining = extraDebtCap;
      cash = 0;
    }

    if (!helocPaysConsumer) {
      // (4) Contractual minimums — Standard / Banking pooled cash (not HELOC velocity path).
      const activeForMin = sortForMinimumPriority(accounts, payoffMethod);
      for (const d of activeForMin) {
        if (d.balance <= EPS || cash <= 0) continue;
        const pay = Math.min(d.balance, d.minPayment, cash);
        d.balance = clampBalance(d.balance - pay);
        payConsumerFromPools(pay);
      }

      extraRemaining = extraDebtCap;
      while (cash > EPS && extraRemaining > EPS) {
        const active = accounts.filter((d) => d.balance > EPS);
        if (active.length === 0) break;
        const target = pickPayoffTarget(active, payoffMethod);
        if (!target) break;
        const pay = Math.min(target.balance, cash, extraRemaining);
        target.balance = clampBalance(target.balance - pay);
        payConsumerFromPools(pay);
        extraRemaining -= pay;
      }
    }

    if (isBanking) {
      const consumerStillHere = accounts.some((d) => d.balance > EPS);
      if (consumerStillHere && contribTarget > EPS) {
        monthsWithConsumerDebtWhileBanking++;
        const hadDeploy =
          strategicLumpThisMonth > EPS || liquidityDrawThisMonth > EPS;
        const hadExtra = extraDebtCap - extraRemaining > EPS;
        if (
          !hadDeploy &&
          !hadExtra &&
          borrowRoomAtStart > EPS &&
          policyLtvRatio > EPS
        ) {
          bankingRiskScoreMonths++;
        }
      }
    }

    for (const d of accounts) {
      if (d.balance < EPS) d.balance = 0;
    }

    // Mark cleared debts (freed minimums enlarge operating cash next month → more loan principal paydown).
    for (const d of accounts) {
      if (d.balance <= EPS && !clearedConsumerDebtIds.has(d.id)) {
        clearedConsumerDebtIds.add(d.id);
      }
    }

    const consumerGone = !accounts.some((d) => d.balance > EPS);
    if (consumerGone && consumerDebtFreeMonth === null) {
      consumerDebtFreeMonth = month;
    }

    if (isBanking) {
      // Policy-loan principal: only from operating remainder — not from this month’s draw (no same-month wash).
      // Operating pool includes income − expenses after contribution, plus any liquidity draw in `br`,
      // minus consumer mins/extra — and stacks freed minimums from debts already cleared.
      while (op > EPS && policyLoan > EPS) {
        const pay = Math.min(policyLoan, op);
        policyLoan = clampBalance(policyLoan - pay);
        op -= pay;
        cash -= pay;
        totalPaidThisMonth += pay;
        cumulativePolicyLoanPrincipalPaid += pay;
      }
      // (7) Unused draw + operating leftovers recycle into CV (restores LTV room for the next cycle).
      cash = op + br;
      if (cash > EPS) {
        policyCV += cash;
        cash = 0;
      }
      op = 0;
      br = 0;
    }

    if (consumerGone && !helocPaysConsumer) {
      while (cash > EPS) {
        if (isHeloc && helocBal > EPS) {
          const pay = Math.min(helocBal, cash);
          if (pay + EPS >= helocBal) {
            totalPaidThisMonth += helocBal;
            cash -= helocBal;
            helocBal = 0;
          } else {
            helocBal = clampBalance(helocBal - pay);
            cash -= pay;
            totalPaidThisMonth += pay;
          }
          continue;
        }
        break;
      }
    }

    if (isHeloc) {
      helocBal = finalizeHelocBalanceAfterAllPayments(helocBal);
    }

    const consumerSum = accounts.reduce((s, a) => s + a.balance, 0);
    const debtDisplay = consumerSum + Math.max(0, helocBal);
    const netEquity = isBanking ? policyCV - policyLoan : 0;

    if (isBanking) {
      const activeEnd = accounts.filter((d) => d.balance > EPS);
      const tgt = pickPayoffTarget(activeEnd, payoffMethod);
      let freedMinStack = 0;
      for (const d of accounts) {
        if (clearedConsumerDebtIds.has(d.id)) freedMinStack += d.minPayment;
      }
      const remCapEnd = Math.max(0, policyCV * policyLtvRatio - policyLoan);
      bankingStateLatest = {
        month,
        targetId: tgt?.id ?? null,
        targetName: tgt?.name ?? "",
        amountNeededToEliminate: tgt?.balance ?? 0,
        policyCashValue: policyCV,
        policyLoanBalance: policyLoan,
        remainingBorrowCapacity: remCapEnd,
        canEliminateTargetNow: !!(tgt && remCapEnd >= tgt.balance - EPS),
        freedMinimumsStackedPerMonth: freedMinStack,
        cumulativePolicyLoanPrincipalPaid
      };
    }

    if (helocPaysConsumer) {
      const activeEndH = accounts.filter((d) => d.balance > EPS);
      const tgtH = pickPayoffTarget(activeEndH, payoffMethod);
      let freedStackH = 0;
      for (const d of accounts) {
        if (clearedConsumerDebtIds.has(d.id)) freedStackH += d.minPayment;
      }
      const nextRepaymentToHeloc = appliedStrategy + freedStackH;
      const helocBalAfterNextRepay = clampBalance(
        Math.max(0, helocBal - nextRepaymentToHeloc)
      );
      const acForNextStrategic = Math.max(0, helocLimit - helocBalAfterNextRepay);
      helocStateLatest = {
        month,
        targetId: tgtH?.id ?? null,
        targetName: tgtH?.name ?? "",
        amountNeededToEliminate: tgtH?.balance ?? 0,
        helocBalance: helocBal,
        helocCreditLimit: helocLimit,
        availableCredit: acForNextStrategic,
        canEliminateTargetNow: !!(
          tgtH &&
          tgtH.balance > EPS &&
          acForNextStrategic + EPS >= tgtH.balance
        ),
        freedMinimumsStackedPerMonth: freedStackH,
        strategicDrawTriggeredThisMonth: helocDbgStrategicDrawTriggeredThisMonth,
        strategicDebtsClearedThisMonth: helocDbgStrategicDebtsClearedThisMonth,
        strategicAmountDrawnThisMonth: helocDbgStrategicAmountDrawnThisMonth,
        smallestActiveDebtBalance: helocDbgSmallestActiveDebtBalance,
        remainingCreditAfterRepaymentBeforeDraw:
          helocDbgRemainingCreditAfterRepaymentBeforeDraw
      };
    }

    rows.push({
      month,
      debtBalance: debtDisplay,
      helocBalance: Math.max(0, helocBal),
      policyValue: Math.max(0, netEquity),
      totalDebtPayment: totalPaidThisMonth,
      cumulativeInterest: selectedTotalInterestPaid
    });

    const allClear =
      consumerSum <= EPS &&
      (!isHeloc || helocBal <= EPS) &&
      (!isBanking || policyLoan <= EPS);
    if (allClear && debtFreeMonth === null) debtFreeMonth = month;
    if (allClear) break;
  }

  const endPrincipal = accounts.reduce((s, a) => s + a.balance, 0);
  const totalPrincipalPaid = Math.max(0, startPrincipal - endPrincipal);
  const hitProjectionCap = debtFreeMonth === null;

  const endingNetPolicyEquity = isBanking
    ? Math.max(0, policyCV - policyLoan)
    : 0;

  const bankingPayoffWarning =
    isBanking &&
    monthsWithConsumerDebtWhileBanking >= 6 &&
    bankingRiskScoreMonths >= 4 &&
    bankingRiskScoreMonths >= 0.3 * monthsWithConsumerDebtWhileBanking;

  return {
    rows,
    debtFreeMonth,
    consumerDebtFreeMonth,
    selectedTotalInterestPaid,
    totalHelocInterestPaid: totalHelocInterestAccrued,
    monthlyConsumerInterest,
    lastPolicyContribution: lastContrib,
    endingNetPolicyEquity,
    endingPolicyLoan: policyLoan,
    endingHelocBalance: helocBal,
    simulationMonths: rows.length,
    hitProjectionCap,
    totalPrincipalPaid,
    totalPaymentsToConsumerDebt,
    monthlyCashPipeline: monthlyCashAvailable,
    appliedTowardStrategy: appliedStrategy,
    budgetExtraDebtPayoff: extraDebtCap,
    bankingPayoffWarning,
    bankingPayoffTriggerMonth1,
    bankingStateLatest,
    cumulativePolicyLoanPrincipalPaid,
    helocPayoffTriggerMonth1,
    helocStateLatest
  };
}

export function computeLayeredProjection(params) {
  const {
    debts,
    payoffMethod,
    accelerationMethod,
    aggregated,
    monthlyIncome,
    monthlyExpenses,
    advancedProjectionYears,
    useCapitalVehicle,
    monthlyPolicyContribution,
    annualPolicyGrowth,
    policyLoanInterestRate,
    policyLoanLtvPct,
    startingPolicyCashValue,
    helocInterestRate,
    helocCreditLimit,
    maxMonthlyHelocDraw,
    startingHelocBalance,
    amountTowardDebtStrategyRaw
  } = params;

  const { totalMin } = aggregated;
  const allocation = computeDebtCashAllocation(
    monthlyIncome,
    monthlyExpenses,
    totalMin,
    amountTowardDebtStrategyRaw
  );
  const {
    availableForStrategy,
    appliedTowardStrategy,
    appliedExceedsAvailableForStrategy
  } = allocation;
  const surplus = availableForStrategy;

  const projectionMaxMonths = resolveProjectionMaxMonths(
    advancedProjectionYears
  );

  const baseline = baselineMinimumProjection(debts, projectionMaxMonths);

  const monthlyPaymentToDebt = Math.max(
    0,
    Number(monthlyIncome) - Number(monthlyExpenses)
  );
  const contribTarget = Math.max(0, Number(monthlyPolicyContribution) || 0);
  const isBankingActive =
    accelerationMethod === ACCELERATION_METHODS.BANKING && useCapitalVehicle;

  const policyContributionExceedsAppliedStrategy =
    isBankingActive && contribTarget > appliedTowardStrategy + EPS;

  const runSelectedStrategy = (method) =>
    selectedStrategyProjection({
      debts,
      payoffMethod: method,
      accelerationMethod,
      monthlyIncome,
      monthlyExpenses,
      appliedTowardStrategy,
      projectionMaxMonths,
      useCapitalVehicle,
      monthlyPolicyContribution,
      annualPolicyGrowthPct: annualPolicyGrowth,
      policyLoanInterestPct: policyLoanInterestRate,
      policyLoanLtvPct,
      startingPolicyCashValue,
      helocInterestPct: helocInterestRate,
      helocCreditLimit,
      maxMonthlyHelocDraw,
      startingHelocBalance,
      amountTowardDebtStrategyRaw
    });

  let selected;
  /** Payoff ordering actually simulated (Snowball or Avalanche); null if strategy not run. */
  let effectivePayoffMethod = null;

  if (policyContributionExceedsAppliedStrategy) {
    selected = {
      rows: emptyRows(1),
      debtFreeMonth: null,
      consumerDebtFreeMonth: null,
      selectedTotalInterestPaid: 0,
      totalHelocInterestPaid: 0,
      monthlyConsumerInterest: [],
      lastPolicyContribution: 0,
      endingNetPolicyEquity: Math.max(
        0,
        Number(startingPolicyCashValue) || 0
      ),
      endingPolicyLoan: 0,
      endingHelocBalance: 0,
      simulationMonths: 1,
      hitProjectionCap: false,
      totalPrincipalPaid: 0,
      totalPaymentsToConsumerDebt: 0,
      appliedTowardStrategy,
      budgetExtraDebtPayoff: Math.max(0, appliedTowardStrategy - contribTarget),
      bankingPayoffWarning: false,
      bankingPayoffTriggerMonth1: null,
      bankingStateLatest: null,
      cumulativePolicyLoanPrincipalPaid: 0,
      helocPayoffTriggerMonth1: null,
      helocStateLatest: null
    };
    effectivePayoffMethod = null;
  } else if (payoffMethod === PAYOFF_METHODS.FASTEST_ROUTE) {
    const snowSel = runSelectedStrategy(PAYOFF_METHODS.SNOWBALL);
    const avaSel = runSelectedStrategy(PAYOFF_METHODS.AVALANCHE);
    const snowEnd =
      snowSel.debtFreeMonth != null ? snowSel.debtFreeMonth : Infinity;
    const avaEnd =
      avaSel.debtFreeMonth != null ? avaSel.debtFreeMonth : Infinity;
    if (avaEnd < snowEnd) {
      selected = avaSel;
      effectivePayoffMethod = PAYOFF_METHODS.AVALANCHE;
    } else {
      selected = snowSel;
      effectivePayoffMethod = PAYOFF_METHODS.SNOWBALL;
    }
  } else {
    selected = runSelectedStrategy(payoffMethod);
    effectivePayoffMethod = payoffMethod;
  }

  const compareMonths = policyContributionExceedsAppliedStrategy
    ? 1
    : (selected.consumerDebtFreeMonth ??
      selected.simulationMonths ??
      projectionMaxMonths);
  const T = Math.max(1, Math.min(compareMonths, projectionMaxMonths));

  const baselineInterestThroughT = sumArrayPrefix(baseline.monthlyConsumerInterest, T);
  const selectedInterestThroughT = policyContributionExceedsAppliedStrategy
    ? 0
    : sumArrayPrefix(selected.monthlyConsumerInterest, T);

  const interestSavedComparable = policyContributionExceedsAppliedStrategy
    ? 0
    : Math.max(0, baselineInterestThroughT - selectedInterestThroughT);

  const interestSavedStrict = policyContributionExceedsAppliedStrategy
    ? 0
    : Math.max(
        0,
        baseline.baselineTotalInterestPaid - selected.selectedTotalInterestPaid
      );

  const policyContrib = isBankingActive ? contribTarget : 0;

  const budgetExtraDebtPayoff = isBankingActive
    ? Math.max(0, appliedTowardStrategy - contribTarget)
    : appliedTowardStrategy;

  return {
    schedule: {
      rows: selected.rows,
      debtFreeMonth: selected.debtFreeMonth,
      totalInterestPaid: selected.selectedTotalInterestPaid
    },
    benchmarkMinOnly: { totalInterestPaid: baseline.baselineTotalInterestPaid },
    monthlyPaymentToDebt,
    policyContrib,
    surplus,
    availableForStrategy,
    appliedTowardStrategy,
    budgetExtraDebtPayoff,
    appliedExceedsAvailableForStrategy,
    policyContributionExceedsAppliedStrategy,
    interestSavedVsMinimum: interestSavedComparable,
    interestSavedStrict,
    interestComparisonMonths: T,
    baselineInterestThroughT,
    selectedInterestThroughT,
    totalInterestPaid: selected.selectedTotalInterestPaid,
    endingNetPolicyEquity: selected.endingNetPolicyEquity,
    endingPolicyLoan: selected.endingPolicyLoan,
    endingHelocBalance: selected.endingHelocBalance,
    totalHelocInterestPaid: selected.totalHelocInterestPaid,
    simulationMonths: selected.simulationMonths,
    hitProjectionCap: selected.hitProjectionCap,
    projectionMaxMonths,
    baselineTotalInterestPaid: baseline.baselineTotalInterestPaid,
    selectedTotalInterestPaid: selected.selectedTotalInterestPaid,
    baselineTotalPrincipalPaid: baseline.totalPrincipalPaid,
    selectedTotalPrincipalPaid: selected.totalPrincipalPaid,
    baselineTotalPayments: baseline.totalPaymentsToConsumerDebt,
    selectedTotalPayments: selected.totalPaymentsToConsumerDebt,
    consumerDebtFreeMonth: selected.consumerDebtFreeMonth,
    bankingPayoffWarning: selected.bankingPayoffWarning ?? false,
    bankingPayoffTriggerMonth1: selected.bankingPayoffTriggerMonth1 ?? null,
    bankingStateLatest: selected.bankingStateLatest ?? null,
    cumulativePolicyLoanPrincipalPaid:
      selected.cumulativePolicyLoanPrincipalPaid ?? 0,
    helocPayoffTriggerMonth1: selected.helocPayoffTriggerMonth1 ?? null,
    helocStateLatest: selected.helocStateLatest ?? null,
    effectivePayoffMethod
  };
}

export function monthlyPaymentForTerm(principal, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  if (!months || months <= 0 || principal <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}
