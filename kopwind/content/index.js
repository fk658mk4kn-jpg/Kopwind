/**
 * content/index.js
 * Koppelt toolslugs aan hun SEO-content (teksten, blokken, FAQ).
 */

import * as fietsenNaarWerk from "./fietsen-naar-werk.js";
import * as wasBuitenDrogen from "./was-buiten-drogen.js";
import * as watTrekIkAan from "./wat-trek-ik-aan.js";
import * as terras from "./terras.js";

const PER_SLUG = {
  "fietsen-naar-werk": fietsenNaarWerk,
  "was-buiten-drogen": wasBuitenDrogen,
  "wat-trek-ik-aan": watTrekIkAan,
  "terrasweer": terras,
};

export function inhoudVoorTool(slug) {
  return PER_SLUG[slug] ?? null;
}
