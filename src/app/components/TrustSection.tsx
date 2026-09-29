import Image from "next/image";
import Link from "next/link";

const points = [
  {
    title: "Checked by hand",
    body: "We inspect every piece for fit, fabric and finish before it goes up on the site.",
  },
  {
    title: "New every week",
    body: "Fresh clothing, accessories and grooming picks land weekly, so check back often.",
  },
  {
    title: "Pay your way",
    body: "Bank transfer, Klump, or weekly instalments with a 30% initial deposit. Instalment orders ship once payment is completed.",
  },
];

const TrustSection = () => {
  return (
    <section className="mt-16 grid grid-cols-1 bg-cream md:mt-24 lg:grid-cols-2">
      <div className="relative aspect-4/3 lg:aspect-auto">
        <Image
          src="/products-fidex/jeans.jpg"
          alt="Folded slim-fit denim jeans"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="px-4 py-12 md:px-10 md:py-16 lg:px-16">
        <h2 className="display-type text-5xl text-ink md:text-6xl">
          Picked by hand.
          <br />
          <span className="text-gold">Worn with confidence.</span>
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-ink/70">
          Buying clothes online should not be a gamble. If a piece does not pass our checks, it
          does not go up on Fidex.
        </p>

        <dl className="mt-10 max-w-lg">
          {points.map((point) => (
            <div key={point.title} className="grid grid-cols-1 gap-1 border-t border-ink/15 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-ink">{point.title}</dt>
              <dd className="text-sm leading-relaxed text-ink/70">{point.body}</dd>
            </div>
          ))}
        </dl>

        <Link
          href="/contact"
          className="mt-6 inline-block text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-gold"
        >
          Questions? Talk to us
        </Link>
      </div>
    </section>
  );
};

export default TrustSection;
