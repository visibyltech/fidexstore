const steps = ["Delivery", "Payment", "Review"];

const CheckoutStepper = ({ currentStep }: { currentStep: number }) => {
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Checkout progress">
      {steps.map((step, i) => {
        const stepNumber = i + 1;
        const reached = stepNumber <= currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <li key={step} aria-current={isActive ? "step" : undefined}>
            <div className={`h-1 ${reached ? "bg-gold" : "bg-ink/10"}`} />
            <p className={`mt-2 text-sm ${isActive ? "font-semibold text-ink" : reached ? "text-ink/70" : "text-ink/40"}`}>
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
};

export default CheckoutStepper;
