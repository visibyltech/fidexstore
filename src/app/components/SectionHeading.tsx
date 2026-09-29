import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
};

const SectionHeading = ({ title, description, href, linkLabel = "View all" }: SectionHeadingProps) => (
  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-4">
    <div>
      <h2 className="display-type text-4xl text-ink md:text-5xl">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-ink/60">{description}</p>}
    </div>
    {href && (
      <Link
        href={href}
        className="group flex items-center gap-2 text-sm font-medium text-ink transition hover:text-gold"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);

export default SectionHeading;
