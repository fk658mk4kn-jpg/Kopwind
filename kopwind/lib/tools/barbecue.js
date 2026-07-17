/**
 * lib/tools/barbecue.js
 *
 * De barbecuecheck als overlay op de gedeelde weerbasis (v3.1.0
 * "Sirocco"). Avondgericht: het venster loopt standaard van 16:00 tot
 * 22:00, want dan staat de kolen aan.
 *
 * Het unieke element boven een kaal ja/nee: windrichting-advies. De
 * check bepaalt de dominante windrichting in het beste blok
 * (vectorgemiddelde, zodat 350 en 10 graden netjes noord middelen) en
 * vertaalt die naar waar de rook heen trekt, dus waar je de tafel niet
 * neerzet. Verder telt droog zwaarder dan warm: barbecueen bij 15 graden
 * kan prima met een vest, barbecueen in de regen is treurig.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay, topPijn } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

/** Alle teksten van de barbecuecheck, per taal. */
const T = kies({
  nl: {
    slug: "barbecueweer",
    naam: "Kan ik vandaag barbecue\u00ebn?",
    korteVraag: "Kan ik vandaag barbecue\u00ebn?",
    meldingKort: "BBQ-check",
    cta: "Check de barbecue",
    navLabel: "Barbecue",
    diepte: "Het beste avondblok, en waar de rook heen trekt.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Steek 'm aan", goed: "Prima bbq-weer", twijfelachtig: "Kan, met een vest", matig: "Wordt behelpen", "zeer-slecht": "Niet vanavond" },
    adviesLabels: { goed: "barbecueweer", matig: "kan, met een vest", slecht: "geen barbecueweer" },
    legenda: { links: "binnen koken", rechts: "barbecueweer" },
    windstreken: ["noorden", "noordoosten", "oosten", "zuidoosten", "zuiden", "zuidwesten", "westen", "noordwesten"],
    redenNat: "te nat: natte kolen en natte gasten",
    redenFris: (g) => `frisse avond (gevoel maximaal ${g} graden)`,
    redenGeenBlok: "geen bruikbaar avondblok",
    redenMatigBlok: (g, w) => `het avondblok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenWind: (w) => `stevige wind (${w} km/u): vonken en omvallende borden`,
    redenKort: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    rook: (uit, heen) => `De wind komt uit het ${uit}; zet de tafel niet ten ${heen} van de barbecue, daar trekt de rook heen.`,
    statusBeste: (tijd) => `Vanavond barbecueweer van ${tijd}.`,
    statusNu: (tijd) => `Steek 'm aan: barbecueweer tot ${tijd}.`,
    statusGeweest: "Het beste barbecueweer is voor vandaag geweest.",
    statusNiks: "Vanavond wordt het niks met de barbecue.",
    morgenWel: (t) => ` Morgen vanaf ${t}:00 kan het wel.`,
    toekomstBeste: (tijd) => `Beste blok: ${tijd}.`,
    toekomstGeen: "Geen barbecueweer.",
    instGevoelVraag: "Wanneer is het jou warm genoeg?",
    instGevoelKeuzes: ["Met een vest is prima", "Gemiddeld", "Alleen op zwoele avonden"],
    instWindVraag: "Hoeveel wind kan jouw plek hebben?",
    instWindKeuzes: ["Beschutte tuin", "Gemiddeld", "Open veld of balkon"],
    instDagStart: "Kolen aan vanaf",
    instDagEind: "Laatste ronde om",
    instUur: "uur",
    instUitleg:
      "Droog telt zwaarder dan warm: 15 graden met een vest is prima barbecueweer, regen niet. Ideaal is een droge, zwoele avond met een zuchtje wind. De rookzin vertelt waar je de tafel neerzet.",
  },
  en: {
    slug: "bbq-weather",
    naam: "Can I barbecue today?",
    korteVraag: "Can I barbecue today?",
    meldingKort: "BBQ check",
    cta: "Check the barbecue",
    navLabel: "BBQ",
    diepte: "The best evening window, and where the smoke will drift.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Light it up", goed: "Good BBQ weather", twijfelachtig: "Doable with a jacket", matig: "A bit of a struggle", "zeer-slecht": "Not tonight" },
    adviesLabels: { goed: "BBQ weather", matig: "doable with a jacket", slecht: "no BBQ weather" },
    legenda: { links: "cook inside", rechts: "BBQ weather" },
    windstreken: ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"],
    redenNat: "too wet: wet coals and wet guests",
    redenFris: (g) => `chilly evening (feels like ${g} degrees at best)`,
    redenGeenBlok: "no usable evening window",
    redenMatigBlok: (g, w) => `the evening window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenWind: (w) => `strong wind (${w} km/h): sparks and toppling plates`,
    redenKort: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    rook: (uit, heen) => `The wind comes from the ${uit}; don't put the table to the ${heen} of the barbecue, that's where the smoke will drift.`,
    statusBeste: (tijd) => `BBQ weather tonight from ${tijd}.`,
    statusNu: (tijd) => `Light it up: BBQ weather until ${tijd}.`,
    statusGeweest: "The best BBQ weather has been and gone today.",
    statusNiks: "The barbecue isn't happening tonight.",
    morgenWel: (t) => ` Tomorrow from ${t}:00 works though.`,
    toekomstBeste: (tijd) => `Best window: ${tijd}.`,
    toekomstGeen: "No BBQ weather.",
    instGevoelVraag: "When is it warm enough for you?",
    instGevoelKeuzes: ["A jacket is fine by me", "Average", "Only on balmy evenings"],
    instWindVraag: "How much wind can your spot take?",
    instWindKeuzes: ["Sheltered garden", "Average", "Open field or balcony"],
    instDagStart: "Coals on from",
    instDagEind: "Last round at",
    instUur: "h",
    instUitleg:
      "Dry outweighs warm: 15 degrees with a jacket is fine BBQ weather, rain is not. Ideal is a dry, balmy evening with a light breeze. The smoke line tells you where to put the table.",
  },
});

export const BBQ_DEFAULTS = {
  minGevoel: 13, // vanaf hier is het met een vest prima
  maxWind: 30, // km/u; daarboven vliegen de vonken en servetten
  dagStart: 16,
  dagEind: 22,
};

const MIN_VENSTER_UREN = 2;
const BRUIKBAAR_VANAF = 40;

/** Barbecuescore van een enkel basis-uur, 0..100. Droog telt het zwaarst. */
export function uurBbqScore(u, inst = BBQ_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 55) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const gevoelF = clamp(lerp(gevoel, inst.minGevoel - 5, 20, 0, 1), 0, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.5) / (inst.maxWind * 1.2), 0.3, 1);
  const zon = u.dag && u.bewolking != null && u.bewolking <= 50 ? 6 : 0;
  return clamp(Math.round(90 * gevoelF * windF + zon), 0, 100);
}

export function dominanteWindrichting(blok) {
  let x = 0;
  let y = 0;
  let n = 0;
  for (const u of blok) {
    if (u.richting == null) continue;
    const rad = (u.richting * Math.PI) / 180;
    x += Math.cos(rad);
    y += Math.sin(rad);
    n++;
  }
  if (!n) return null;
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  return (deg + 360) % 360;
}

/** Windstreek voluit (8-punts) in de taal van deze deployment. */
export function windstreekVoluit(deg) {
  if (deg == null) return null;
  return T.windstreken[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

/** De rookzin: waar de wind vandaan komt en waar de rook dus heen trekt. */
export function rookZin(blok) {
  const uit = dominanteWindrichting(blok);
  if (uit == null) return null;
  return T.rook(windstreekVoluit(uit), windstreekVoluit((uit + 180) % 360));
}

/**
 * Sinds v3.18.0 draait de barbecuecheck op de gedeelde venstermotor.
 * De eigen identiteit zit in de factorenopbouw (wind is met 10 punten
 * en een drempel op 75 procent van de grens de zwaarste spelbreker,
 * en staat voor fris in de redenvolgorde), de vandaag-status op de
 * resterende uren, de rookzin als metric (waar de rook heen trekt) en
 * de morgen-nabewerking.
 */
export const overlay = maakVensterOverlay({
  defaults: BBQ_DEFAULTS,
  uurScore: uurBbqScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  dagFactoren: ({ uren, venster, inst }) => {
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    const natUren = uren.filter((u) => u.nat).length;
    const factoren = [];
    if (!venster) {
      factoren.push({
        punten: 72,
        reden:
          natUren > 0
            ? T.redenNat
            : maxGevoel < inst.minGevoel
              ? T.redenFris(Math.round(maxGevoel))
              : T.redenGeenBlok,
      });
    } else {
      const blokGevoel = Math.round(venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 0), 0) / venster.uren);
      const blokWind = Math.round(venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren);
      const kwaliteit = topPijn(venster.gemiddeld);
      factoren.push({ punten: kwaliteit, reden: kwaliteit >= 18 ? T.redenMatigBlok(blokGevoel, blokWind) : null });
      factoren.push({
        punten: Math.round(lerp(venster.uren, 5, 2, 0, 16)),
        reden: venster.uren <= 2 ? T.redenKort(venster.uren) : null,
      });
      const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
      if (gemWind > inst.maxWind * 0.75) {
        factoren.push({ punten: 10, reden: T.redenWind(Math.round(gemWind)) });
      }
      if (maxGevoel < inst.minGevoel + 2) {
        factoren.push({ punten: 8, reden: T.redenFris(Math.round(maxGevoel)) });
      }
      if (natUren > 0) {
        factoren.push({ punten: 6, reden: T.redenBuien });
      }
    }
    return factoren;
  },
  statusVandaag: ({ uren, nu, zoekBlok }) => {
    const resterend = uren.filter((u) => u.uur >= nu.getHours());
    const blok = zoekBlok(resterend);
    if (!blok) {
      const eerder = zoekBlok(uren);
      if (eerder && eerder.tot <= nu.getHours()) {
        return { soort: "nee", zin: T.statusGeweest };
      }
      return { soort: "nee", zin: T.statusNiks };
    }
    const nuBezig = blok.van <= nu.getHours();
    return {
      soort: nuBezig ? "nu" : "later",
      zin: nuBezig
        ? T.statusNu(`${String(blok.tot).padStart(2, "0")}:00`)
        : T.statusBeste(`${String(blok.van).padStart(2, "0")}:00-${String(blok.tot).padStart(2, "0")}:00`),
    };
  },
  metricVoor: ({ venster }) => (venster ? { zin: rookZin(venster.blok) } : null),
  naVerwerking: (dagenUit) => {
    if (dagenUit[0]?.status?.soort === "nee" && dagenUit[1]?.venster) {
      const v = dagenUit[1].venster;
      dagenUit[0].status.zin += T.morgenWel(String(v.van).padStart(2, "0"));
    }
  },
});

export const barbecue = {
  id: "barbecue",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "bbq",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: BBQ_DEFAULTS },
  instellingen: {
    defaults: BBQ_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "gevoel",
        vraag: T.instGevoelVraag,
        keuzes: [
          { label: T.instGevoelKeuzes[0], zet: { minGevoel: 11 } },
          { label: T.instGevoelKeuzes[1], zet: { minGevoel: 13 } },
          { label: T.instGevoelKeuzes[2], zet: { minGevoel: 17 } },
        ],
      },
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 38 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 30 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 22 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 12, max: 19 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 19, max: 24 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-14",
  affiliate: null,
};
