// Store contact and payment details, shown in the footer, contact page,
// hero and checkout. Edit them here only.
export const SITE = {
  name: "Fidex",
  tagline: "Style. Confidence. Everything You.",
  city: "Lagos, Nigeria",
  email: "hello@fidex.ng",
  phoneDisplay: "+234 801 234 5678",
  whatsappNumber: "2348012345678",
  hours: ["Mon to Sat, 9am to 7pm", "Sun, 12pm to 5pm"],
  bankAccounts: [
    { bank: "GTBank", accountName: "Fidex", accountNumber: "0123456780" },
    { bank: "Globus Bank", accountName: "Fidex", accountNumber: "2003633189" },
  ],
};

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${SITE.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
