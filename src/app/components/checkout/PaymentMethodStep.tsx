import { ArrowRight } from "lucide-react";

export type PaymentMethod = "bank-transfer" | "installments" | "klump";

const methods: { id: PaymentMethod; title: string; subtitle: string }[] = [
  {
    id: "bank-transfer",
    title: "Bank transfer",
    subtitle: "Pay the full amount to our bank account and upload the receipt.",
  },
  {
    id: "installments",
    title: "Weekly instalments",
    subtitle: "30% initial deposit, then weekly. Ships once fully paid.",
  },
  {
    id: "klump",
    title: "Klump",
    subtitle: "Buy now and pay later through Klump.",
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
    <div className="flex-1">
      <fieldset>
        <legend className="display-type text-3xl">How would you like to pay?</legend>

        <div className="mt-6 border-t border-ink/10">
          {methods.map((method) => {
            const isSelected = selected === method.id;

            return (
              <label
                key={method.id}
                className={`flex cursor-pointer items-start gap-4 border-b border-ink/10 px-2 py-5 transition ${
                  isSelected ? "bg-cream" : "hover:bg-cream/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  checked={isSelected}
                  onChange={() => onSelect(method.id)}
                  className="mt-1 accent-gold"
                />
                <span>
                  <span className="block text-base font-semibold">{method.title}</span>
                  <span className="mt-1 block text-sm text-ink/60">{method.subtitle}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="border border-ink/20 px-6 py-3 text-sm font-semibold transition hover:border-ink"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex flex-1 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Review order <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
