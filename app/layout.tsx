import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Fraunces } from "next/font/google";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

// Text i čísla: písmo pro čitelnost (odlišené O/0, I/l/1), tabulkové číslice přes .num
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "ETF z NYSE – srovnání pro českého investora",
  description:
    "Porovnání ETF z NYSE s evropskými UCITS alternativami a kalkulačka dopadu poplatků v Kč.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="cs"
      className={`${fraunces.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
