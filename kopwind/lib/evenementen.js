/**
 * lib/evenementen.js
 *
 * Seizoensevenementen met een vaste periode per jaar (v3.39.0). Bron per
 * regel. Bijwerken zodra de organisatie het volgende jaar bekendmaakt.
 */

export const KEUKENHOF = [
  { jaar: 2027, van: "2027-03-18", tot: "2027-05-09", bron: "keukenhof.nl" },
];

export function huidigeKeukenhof(vandaagSleutel) {
  return KEUKENHOF.find((k) => k.tot >= vandaagSleutel) ?? null;
}
