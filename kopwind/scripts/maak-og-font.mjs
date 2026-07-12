/**
 * Kopieert de display-letter (700) naar assets/og/ voor de OG-image-route.
 * Satori (next/og) leest ttf, otf en woff, geen woff2; de statische
 * fontsource-package levert precies die woff. Eenmalig draaien (het
 * resultaat staat in de repo): node scripts/maak-og-font.mjs
 */
import { copyFile, mkdir } from "node:fs/promises";

await mkdir("assets/og", { recursive: true });
await copyFile(
  "node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff",
  "assets/og/BricolageGrotesque-700.woff"
);
console.log("OG-font gekopieerd naar assets/og/.");
