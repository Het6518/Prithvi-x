import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { GoogleTranslate } from "@/components/shared/google-translate";
import { CropAnimation } from "@/components/shared/crop-animation";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Prithvix | Premium AgriTech Dealer Management",
  description:
    "Prithvix unifies farmer registration, field intelligence, udhaar tracking, inventory, analytics, and multilingual agronomy support in one premium platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="relative min-h-[100dvh] pb-[130px]">
        <GoogleTranslate />
        <CropAnimation />
        {children}
      </body>
    </html>
  );
}
