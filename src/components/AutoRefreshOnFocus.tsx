"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshOnFocus({ interval = 8000 }: { interval?: number }) {
  const router = useRouter();

  useEffect(() => {
    function refresh() { router.refresh(); }

    // Refresh quand on revient sur l'onglet
    window.addEventListener("focus", refresh);
    // Refresh périodique
    const id = setInterval(refresh, interval);

    return () => {
      window.removeEventListener("focus", refresh);
      clearInterval(id);
    };
  }, [router, interval]);

  return null;
}
