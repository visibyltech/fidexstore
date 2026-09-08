import { CreditCard, CalendarClock, ShieldCheck, ArrowRight } from "lucide-react";

export type PaymentMethod = "bank-transfer" | "installments" | "klump";

const methods: { id: PaymentMethod; icon: typeof CreditCard; title: string; subtitle: string }[] = [
  {
    id: "bank-transfer",
    icon: CreditCard,
    title: "Direct Bank Transfer",
    subtitle: "Pay directly to our bank account",
  },
  {
    id: "installments",
    icon: CalendarClock,
    title: "Installment Payment",
    subtitle: "Pay 50% now, balance in 30 days",
  },
  {
    id: "klump",
    icon: ShieldCheck,
    title: "Klump BNPL",
    subtitle: "Buy Now, Pay Later with Klump",
  },
];

type PaymentMethodStepProps = {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
};

const PaymentMethodStep = ({ selected, onSelect, onBack, onContinue }: PaymentMethodStepProps) => {
  return (
    <div className="flex-1 rounded-2xl bg-white/5 p-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-gold" />
        <h2 className="text-lg font-semibold">Payment Method</h2>
      </div>

      <div className="mt-6 space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                isSelected ? "border-gold bg-gold/5" : "border-white/10 hover:border-white/30"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isSelected ? "bg-gold/20 text-gold" : "bg-white/10 text-white/50"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">{method.title}</p>
                <p className="text-xs text-white/50">{method.subtitle}</p>
              </div>

              <input
                type="radio"
                name="payment-method"
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                className="accent-gold"
              />
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/15"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-gold/90"
        >
          Review Order <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
