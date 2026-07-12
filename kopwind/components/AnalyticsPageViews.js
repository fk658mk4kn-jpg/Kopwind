"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * components/AnalyticsPageViews.js
 *
 * Telt paginaweergaven, ook bij client-side navigatie. De App Router
 * verandert bij een klik op een link wel de URL maar laadt de pagina niet
 * opnieuw, dus de standaard send_page_view van GA4 zou alleen de allereerste
 * lading zien. Daarom sturen we hier zelf een page_view bij elke wijziging
 * van pad of querystring.
 *
 * Staat in een eigen component omdat useSearchParams een Suspense-grens
 * vereist; in de layout wordt hij daarom in <Suspense> gewikkeld.
 */
export default function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id || typeof window.gtag !== "function") return;
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.origin + url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
