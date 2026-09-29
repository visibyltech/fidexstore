import Link from "next/link";

type LogoProps = {
  className?: string;
  tone?: "dark" | "light";
  size?: "md" | "lg";
};

const Logo = ({ className = "", tone = "dark", size = "md" }: LogoProps) => {
  return (
    <Link
      href="/"
      aria-label="Fidex home"
      className={`display-type leading-none tracking-tight ${
        size === "lg" ? "text-6xl md:text-8xl" : "text-[1.75rem]"
      } ${tone === "light" ? "text-cream" : "text-ink"} ${className}`}
    >
      FIDEX<span className="text-gold">.</span>
    </Link>
  );
};

export default Logo;
