/**
 * lib/server/codes.js
 *
 * Synccodes: genereren en hashen. De code is het geheim (wie hem kent, is
 * de gebruiker); de server bewaart alleen de sha256-hash.
 */

import { createHash, randomBytes } from "node:crypto";

// Zonder 0/O/1/I zodat de code goed voor te lezen en over te typen is.
const TEKENS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function maakCode() {
  const bytes = randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) s += TEKENS[bytes[i] % TEKENS.length];
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function hashCode(code) {
  return createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}
