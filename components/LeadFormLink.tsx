"use client";

import type { ReactNode } from "react";
import { focusLeadForm, getLeadFlow } from "@/lib/lead-flow";

/** Odkaz na formulář: když je aktivní ten pod kalkulačkou, vede rovnou do jeho pole (žádné dvojí přeskakování). */
export function LeadFormLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="#formular"
      onClick={(e) => {
        if (getLeadFlow().activeForm !== "calc") return;
        e.preventDefault();
        focusLeadForm();
      }}
      className={className}
    >
      {children}
    </a>
  );
}
