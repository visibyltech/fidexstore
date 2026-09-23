import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fidex — Style. Confidence. Everything You.",
  description:
    "Clothing, accessories, grooming, and everyday essentials for the modern streetwear wardrobe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>
        {/* Required by the Klump SDK, which caches this container on load to mount its checkout iframe into. */}
        <div id="klump__checkout" className="hidden" />
        <Script src="https://js.useklump.com/klump.js" strategy="afterInteractive" />
        <Providers>
          <Navbar/>

          {children}

          <Footer/>
        </Providers>
        </body>
    </html>
  );
}
