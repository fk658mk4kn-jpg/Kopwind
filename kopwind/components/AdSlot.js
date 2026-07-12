"use client";

/**
 * Inkomsten-naad (§13): een lege, duidelijk gelabelde advertentieplek.
 * Bewust niet geimplementeerd; rendert nu niets. Als monetisatie start,
 * krijgt dit component een implementatie plus een consent-laag (AVG):
 * de huidige site heeft geen tracking, advertenties vereisen die wel.
 */
export default function AdSlot({ plek }) {
  return null; // Gereserveerd: `plek` wordt bv. "onder-resultaten" of "voet".
}
