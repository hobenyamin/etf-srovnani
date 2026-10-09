import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Unsubscribe } from "@/components/Unsubscribe";

export const metadata: Metadata = {
  title: "Odhlášení z e-mailů – srovnání ETF",
  robots: { index: false },
};

export default function Odhlaseni() {
  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
        <p className="text-[13px] tracking-wide text-muted uppercase">Srovnání ETF z NYSE · pro investory v ČR</p>
        <Suspense>
          <Unsubscribe />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
