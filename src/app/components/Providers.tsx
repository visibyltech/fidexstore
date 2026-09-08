"use client";

import { ReactNode } from "react";
import { CartProvider } from "../context/CartContext";

const Providers = ({ children }: { children: ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default Providers;
