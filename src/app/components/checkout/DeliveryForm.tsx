import { ArrowRight } from "lucide-react";

export type DeliveryDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

type DeliveryFormProps = {
  details: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
  onContinue: () => void;
};

const fields: {
  key: keyof DeliveryDetails;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}[] = [
  { key: "fullName", label: "Full name", type: "text", autoComplete: "name", placeholder: "Ada Bello" },
  { key: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "ada@example.com" },
  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "+234 800 000 0000" },
  { key: "address", label: "Street address", type: "text", autoComplete: "street-address", placeholder: "5 Electronics Way, Ikeja" },
  { key: "city", label: "City", type: "text", autoComplete: "address-level2", placeholder: "Lagos" },
];

const isValid = (details: DeliveryDetails) =>
  Object.values(details).every((value) => value.trim().length > 0);

const DeliveryForm = ({ details, onChange, onContinue }: DeliveryFormProps) => {
  return (
    <div className="flex-1">
      <h2 className="display-type text-3xl">Delivery details</h2>

      <div className="mt-6 space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label htmlFor={`delivery-${field.key}`} className="text-sm font-medium text-ink/80">
              {field.label}
            </label>
            <input
              id={`delivery-${field.key}`}
              type={field.type}
              autoComplete={field.autoComplete}
              value={details[field.key]}
              placeholder={field.placeholder}
              onChange={(e) => onChange({ ...details, [field.key]: e.target.value })}
              className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm placeholder:text-ink/30 focus:border-gold focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        disabled={!isValid(details)}
        className="mt-6 flex w-full items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to payment <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default DeliveryForm;
