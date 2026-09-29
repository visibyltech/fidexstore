import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse clothing, accessories, grooming and everyday essentials, checked by hand in Lagos.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
