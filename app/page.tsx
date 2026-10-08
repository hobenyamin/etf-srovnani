import { Landing } from "@/components/Landing";

// Výchozí varianta A (úspora). Varianta B přes proxy.ts podle utm_content.
export default function Home() {
  return <Landing variant="a" />;
}
