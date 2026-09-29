const items = [
  "Checked by hand",
  "New drops every week",
  "Same-day delivery in Lagos",
  "Pay in weekly instalments",
  "Buy now, pay later with Klump",
];

// The list is rendered twice so the -50% marquee loop is seamless.
const Ticker = () => (
  <div className="overflow-hidden bg-ink py-4 text-cream">
    <p className="sr-only">{items.join(". ")}</p>
    <div className="flex w-max animate-marquee" aria-hidden>
      {[...items, ...items].map((item, i) => (
        <span key={i} className="display-type flex items-center text-2xl whitespace-nowrap uppercase">
          <span className="px-8">{item}</span>
          <span className="text-gold">/</span>
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
