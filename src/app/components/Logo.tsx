import Link from "next/link";

type LogoProps = {
  withTagline?: boolean;
  className?: string;
};

const Logo = ({ withTagline = false, className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/70 text-xs font-bold tracking-tight text-gold">
        CC
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-[0.15em] uppercase">Chined Closet</span>
        {withTagline && (
          <span className="mt-1.5 text-[10px] tracking-widest text-white/50">
            Good Style. Better Prices.
          </span>
        )}
      </span>
    </Link>
  );
};

export default Logo;
