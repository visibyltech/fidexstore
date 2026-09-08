import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="px-6 pt-6 md:px-10">
      <section className="relative isolate flex h-155 items-center justify-center overflow-hidden rounded-3xl bg-black text-white">
        <Image
          src="/pexels-sibin-s-george-100707365-9984695.jpg"
          alt="Trusted devices"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
          <h1 className="text-5xl leading-tight font-semibold tracking-tight md:text-6xl">
            Own Devices You Can <span className="text-gold">Trust</span>
          </h1>

          <p className="mt-6 max-w-md text-base text-white/70">
            Elite quality smartphones and gadgets for{" "}
            <span className="text-white">everyday performance</span> — vetted,
            tested, and backed by Richmond Trust Devices.
          </p>

          <Link
            href="/shop"
            className="mt-10 rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-black uppercase transition hover:bg-gold/90"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hero;
