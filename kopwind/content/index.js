/**
 * content/index.js
 * Koppelt toolslugs aan hun SEO-content (teksten, blokken, FAQ).
 */

import * as fietsenNaarWerk from "./fietsen-naar-werk.js";
import * as wasBuitenDrogen from "./was-buiten-drogen.js";

const PER_SLUG = {
  "fietsen-naar-werk": fietsenNaarWerk,
  "was-buiten-drogen": wasBuitenDrogen,
};

export function inhoudVoorTool(slug) {
  return PER_SLUG[slug] ?? null;
}
