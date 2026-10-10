"use client";

import { useSyncExternalStore } from "react";
import { getLeadFlow, getServerLeadFlow, subscribeLeadFlow } from "@/lib/lead-flow";

export function useLeadFlow() {
  return useSyncExternalStore(subscribeLeadFlow, getLeadFlow, getServerLeadFlow);
}
