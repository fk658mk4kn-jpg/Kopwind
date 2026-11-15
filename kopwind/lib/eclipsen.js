/**
 * lib/eclipsen.js
 *
 * Zons- en maansverduisteringen die vanuit Nederland (deels) te zien zijn
 * (v3.39.0). Bronnen: zonsverduistering.nl (zon, bedekking voor
 * Nederland) en hemel.waarnemen.com (maan, tijden voor Utrecht). Alleen
 * opgenomen wat vanuit Nederland zichtbaar is.
 */

export const ECLIPSEN = [
  { datum: "2027-08-02", soort: "zon", titel: "Gedeeltelijke zonsverduistering", detail: "De maan bedekt ongeveer 49 procent van de zon. In Zuid-Spanje en Noord-Afrika is hij totaal." },
  { datum: "2028-01-12", soort: "maan", titel: "Gedeeltelijke maansverduistering", detail: "Heel klein: maar een randje van de maan raakt de kernschaduw. Maximum rond 05:14 uur, met de maan hoog genoeg aan de hemel." },
  { datum: "2028-01-26", soort: "zon", titel: "Gedeeltelijke zonsverduistering", detail: "De maan bedekt ongeveer 69 procent van de zon, vlak voor zonsondergang. Elders is hij ringvormig." },
  { datum: "2028-07-06", soort: "maan", titel: "Gedeeltelijke maansverduistering", detail: "Alleen het einde is te zien: tijdens het maximum staat de maan bij ons nog onder de horizon." },
  { datum: "2028-12-31", soort: "maan", titel: "Totale maansverduistering", detail: "Totaal van 17:17 tot 18:29 uur, laag in het oosten. Het begin missen we omdat de maan dan nog niet op is." },
  { datum: "2029-06-12", soort: "zon", titel: "Gedeeltelijke zonsverduistering", detail: "De maan bedekt ongeveer 21 procent van de zon." },
  { datum: "2030-06-01", soort: "zon", titel: "Gedeeltelijke zonsverduistering", detail: "De maan bedekt ongeveer 61 procent van de zon. Elders is hij ringvormig." },
];

export function komendeEclipsen(vandaagSleutel) {
  return ECLIPSEN.filter((e) => e.datum >= vandaagSleutel);
}
