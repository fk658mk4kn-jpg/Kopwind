/**
 * lib/ramadan.js
 *
 * Verwachte data van de ramadan (v3.38.0). Het begin hangt af van het
 * waarnemen van de nieuwe maansikkel en kan per land en moskee een dag
 * verschillen; deze data zijn de astronomische verwachting (UAE
 * Astronomy Centre, via The National, september 2026). Bijwerken zodra
 * een nieuw jaar bekend is; de test waarschuwt als de data opraken.
 */

export const RAMADAN = [
  { jaar: 2027, start: "2027-02-08", eindVroeg: "2027-03-08", eindLaat: "2027-03-09", suikerfeest: ["2027-03-09", "2027-03-10"] },
];

/** De eerstvolgende of lopende ramadan, of null als de data op zijn. */
export function huidigeRamadan(vandaagSleutel) {
  return RAMADAN.find((r) => r.eindLaat >= vandaagSleutel) ?? null;
}
