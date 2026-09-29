import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call, WhatsApp or email Fidex in Lagos.",
};

const channels = [
  {
    label: "WhatsApp",
    value: "Fastest reply, and how same-day orders are placed",
    href: whatsappUrl(),
    external: true,
  },
  { label: "Call", value: SITE.phoneDisplay, href: `tel:${SITE.phoneDisplay.replace(/\s/g, "")}` },
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
];

export default function ContactPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-cream px-4 py-14 md:px-10 md:py-20">
        <h1 className="display-type text-6xl text-ink uppercase md:text-8xl">
          Talk
          <br />
          to <span className="text-gold">us.</span>
        </h1>
        <p className="mt-6 max-w-sm leading-relaxed text-ink/70">
          Questions about sizing, an order, or a drop you missed? Reach us however suits you and we
          will get back to you during opening hours.
        </p>

        <dl className="mt-10 max-w-sm space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-ink">Where</dt>
            <dd className="mt-1 text-ink/70">{SITE.city}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Opening hours</dt>
            {SITE.hours.map((line) => (
              <dd key={line} className="mt-1 text-ink/70">
                {line}
              </dd>
            ))}
          </div>
        </dl>
      </div>

      <ul className="px-4 py-6 md:px-10 lg:py-20">
        {channels.map((channel) => (
          <li key={channel.label} className="border-b border-ink/10">
            <a
              href={channel.href}
              {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center justify-between gap-6 py-8"
            >
              <span>
                <span className="display-type block text-4xl text-ink transition group-hover:text-gold md:text-5xl">
                  {channel.label}
                </span>
                <span className="mt-2 block text-sm text-ink/60">{channel.value}</span>
              </span>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-ink/40 transition group-hover:text-gold" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
