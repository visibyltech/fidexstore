import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

// Variable width axis gives both the body text and the condensed headline cut.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: "Fidex | Clothing, accessories and grooming in Lagos",
    template: "%s | Fidex",
  },
  description:
    "Clothing, accessories, grooming and everyday essentials, checked by hand and delivered across Lagos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body suppressHydrationWarning className="flex min-h-screen flex-col font-sans antialiased">
        {/* Required by the Klump SDK, which caches this container on load to mount its checkout iframe into. */}
        <div id="klump__checkout" className="hidden" />
        <Script src="https://js.useklump.com/klump.js" strategy="afterInteractive" />
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
