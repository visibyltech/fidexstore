// Checkout pricing rules. Shared by the checkout UI (to show totals) and
// POST /api/orders (which recomputes them from database prices, so a
// tampered request cannot change what an order costs).

export const DELIVERY_FEE = 5000;

export const INSTALLMENT_PLANS = [
  { weeks: 2, interestRate: 3 },
  { weeks: 4, interestRate: 6 },
  { weeks: 6, interestRate: 9 },
  { weeks: 8, interestRate: 12 },
];

// Instalment orders need a 30% initial deposit; the order ships once
// payment is completed.
export const DEPOSIT_RATE = 0.3;

export function installmentBreakdown(total: number, weeks: number) {
  const plan = INSTALLMENT_PLANS.find((p) => p.weeks === weeks);
  if (!plan) return null;
  const interest = Math.round(total * (plan.interestRate / 100));
  const totalPayable = total + interest;
  const deposit = Math.round(totalPayable * DEPOSIT_RATE);
  const remaining = totalPayable - deposit;
  return {
    plan,
    interest,
    totalPayable,
    deposit,
    remaining,
    weeklyPayment: Math.round(remaining / plan.weeks),
  };
}
