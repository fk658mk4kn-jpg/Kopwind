"use client";

import { useState } from "react";

/**
 * "Zet deze teller op je site" (v3.36.0): een kopieerbaar codeblok voor
 * de widget. De link in de code staat gewoon in de HTML van de andere
 * site en draagt de merknaam, niet een zoekwoord.
 */
export default function WidgetCode({ id, slug, siteUrl }) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const basis = siteUrl.replace(/\/+$/, "");
  const code =
    `<div class="khv-teller" data-teller="${id}">\n` +
    `  <a href="${basis}/${slug}">Aftellen via kanhetvandaag.nl</a>\n` +
    `</div>\n` +
    `<script async src="${basis}/widget.js"></script>`;

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(code);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2500);
    } catch {
      setGekopieerd(false);
    }
  }

  return (
    <details className="paneel aftel-widget">
      <summary>Zet deze teller op je eigen site</summary>
      <p className="aftel-sub">
        Plak deze code in je website, blog of nieuwsbrief-pagina. De teller werkt zichzelf elke dag bij. Geen cookies, geen tracking.
      </p>
      <pre className="aftel-widget-code">{code}</pre>
      <button type="button" className="knop klein" onClick={kopieer}>
        {gekopieerd ? "Gekopieerd" : "Kopieer de code"}
      </button>
    </details>
  );
}
