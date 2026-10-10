"use client";

import { useEffect } from "react";

/**
 * Horní index u hodnoty ve srovnání vede na zdroj (#src-…), který je ve sbaleném „Zdroje a data“.
 * Chrome sbalené <details> při skoku na kotvu otevře sám, Safari a Firefox ne – tady se otevře
 * ručně a zdroj se posune do obrazovky. I při druhém klepnutí na stejný index (hash se nezmění).
 * Posun až po rozbalení (přechod 200 ms v globals.css), jinak by mířil do ještě sbaleného obsahu.
 */
const OPEN_MS = 220;

export function OpenSourceOnJump() {
  useEffect(() => {
    function reveal(id: string) {
      const target = document.getElementById(id);
      const details = target?.closest("details");
      if (!target || !details) return;
      details.open = true;
      // Chrome otevře details při skoku sám, takže i „už otevřené“ může být teprve v přechodu
      const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : OPEN_MS;
      setTimeout(() => target.scrollIntoView({ block: "center" }), delay);
    }
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#src-"]');
      if (link) requestAnimationFrame(() => reveal(link.hash.slice(1)));
    }
    if (location.hash.startsWith("#src-")) reveal(location.hash.slice(1));
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
