import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";

// Varianta hero podle reklamy. Sem přepisuje proxy.ts (`/?utm_content=b…` → `/v/b`),
// v adresním řádku zůstává `/` s UTM parametry. Obě varianty jsou statické.
export function generateStaticParams() {
  return [{ variant: "b" }];
}

export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: "/" },
};

export default async function VariantPage({ params }: PageProps<"/v/[variant]">) {
  const { variant } = await params;
  if (variant !== "b") notFound();
  return <Landing variant="b" />;
}
