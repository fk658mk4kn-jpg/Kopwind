/**
 * lib/tools/vissen.js
 *
 * De vischeck (v3.29.0 "Ghibli"). De enige check die de luchtdruk
 * gebruikt: de klassieke vissersvuistregel zegt dat stabiele of licht
 * dalende druk goede visdagen geeft en snel stijgende druk na een
 * front de slechtste. Dat is ervaringskennis, geen natuurwet; de
 * check labelt het ook zo. Daarnaast tellen licht (bedekte lucht is
 * beter dan strak blauw), wind (een rimpel is goed, harde wind maakt
 * het onwerkbaar) en neerslag (motregen prima, hozen niet).
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "vissen",
    naam: "Is het goed visweer vandaag?",
    korteVraag: "Is het goed visweer vandaag?",
    meldingKort: "Vischeck",
    cta: "Check het visweer",
    navLabel: "Vissen",
    diepte: "De enige check met luchtdruk: stabiel of licht dalend vist het best.",
    locatieHint: "Zoek je stad of het viswater, dat is genoeg...",
    schaalLabels: { ideaal: "Prima visweer", goed: "Goed visweer", twijfelachtig: "Kan, matige verwachting", matig: "Lastig visweer", "zeer-slecht": "Slecht visweer" },
    adviesLabels: { goed: "visweer", matig: "kan, matige verwachting", slecht: "slecht visweer" },
    legenda: { links: "hengel laten staan", rechts: "visweer" },
    statusStabiel: "Stabiele druk en zacht licht: klassiek goed visweer volgens de vuistregels.",
    statusDalend: "De druk daalt: voor een naderend front zijn vissen vaak juist actief. Grijp het venster.",
    statusStijgend: "Snel stijgende druk na een front: volgens de vissersvuistregel de traagste dagen. Temper de verwachting.",
    statusHardeWind: (w) => `Met ${w} km/u wind is het water onrustig en je lijn onbeheersbaar. Zoek een beschutte oever of sla over.`,
    statusNat: "Aanhoudende regen: te nat om er lang te zitten.",
    redenStabiel: "stabiele luchtdruk (vuistregel: goed)",
    redenDalend: "dalende druk: front op komst, vissen vaak actief",
    redenStijgend: "snel stijgende druk na een front (vuistregel: traag)",
    redenZon: "strak blauwe lucht: vis zoekt de diepte",
    redenBedekt: "bedekte lucht: goed vislicht",
    redenWind: (w) => `harde wind (${w} km/u)`,
    redenNat: "aanhoudende regen",
    metricDruk: (delta) => {
      const richting = delta <= -3 ? "dalend" : delta >= 3 ? "stijgend" : "stabiel";
      const teken = delta > 0 ? "+" : "";
      return `Drukverloop vandaag: ${teken}${delta} hPa (${richting}).`;
    },
    instWaterVraag: "Waar vis je meestal?",
    instWaterKeuzes: ["Beschut (sloot, kanaal, vijver)", "Gemengd", "Open water (plas, rivier)"],
    instDuurVraag: "Wanneer zit je het liefst?",
    instDuurKeuzes: ["Vroege ochtend", "Avond", "Hele dag"],
    instAfdakVraag: "Heb je een paraplu of afdak mee?",
    instAfdakKeuzes: ["Nee", "Ja"],
    instUitleg:
      "De check gebruikt het drukverloop van de dag: stabiel of licht dalend geldt onder vissers als goed, snel stijgend na een front als traag. Dat is ervaringskennis, geen garantie. Bedekte lucht scoort beter dan strak blauw, een rimpeltje wind is prima en met een afdak telt regen nauwelijks mee.",
  },
  en: {
    slug: "fishing",
    naam: "Is it good fishing weather today?",
    korteVraag: "Good fishing weather today?",
    meldingKort: "Fishing check",
    cta: "Check the fishing weather",
    navLabel: "Fishing",
    diepte: "The only check with air pressure: stable or gently falling fishes best.",
    locatieHint: "Search your town or the water...",
    schaalLabels: { ideaal: "Fine fishing weather", goed: "Good fishing weather", twijfelachtig: "Doable, modest hopes", matig: "Tricky fishing weather", "zeer-slecht": "Poor fishing weather" },
    adviesLabels: { goed: "fishing weather", matig: "doable, modest hopes", slecht: "poor fishing weather" },
    legenda: { links: "leave the rod", rechts: "fishing weather" },
    statusStabiel: "Stable pressure and soft light: classic good fishing weather by the rules of thumb.",
    statusDalend: "Pressure is falling: ahead of a front fish often feed actively. Take the window.",
    statusStijgend: "Fast rising pressure behind a front: by the angler's rule of thumb the slowest days. Temper expectations.",
    statusHardeWind: (w) => `At ${w} km/h the water is choppy and your line unmanageable. Find a sheltered bank or skip.`,
    statusNat: "Persistent rain: too wet to sit it out.",
    redenStabiel: "stable air pressure (rule of thumb: good)",
    redenDalend: "falling pressure: front coming, fish often active",
    redenStijgend: "fast rising pressure behind a front (rule of thumb: slow)",
    redenZon: "clear blue sky: fish go deep",
    redenBedekt: "overcast sky: good fishing light",
    redenWind: (w) => `strong wind (${w} km/h)`,
    redenNat: "persistent rain",
    metricDruk: (delta) => {
      const richting = delta <= -3 ? "falling" : delta >= 3 ? "rising" : "stable";
      const teken = delta > 0 ? "+" : "";
      return `Pressure trend today: ${teken}${delta} hPa (${richting}).`;
    },
    instWaterVraag: "Where do you usually fish?",
    instWaterKeuzes: ["Sheltered (ditch, canal, pond)", "Mixed", "Open water (lake, river)"],
    instDuurVraag: "When do you prefer to sit?",
    instDuurKeuzes: ["Early morning", "Evening", "All day"],
    instAfdakVraag: "Umbrella or shelter packed?",
    instAfdakKeuzes: ["No", "Yes"],
    instUitleg:
      "The check uses the day's pressure trend: stable or gently falling counts as good among anglers, fast rising behind a front as slow. That's experience, not guarantee. Overcast beats clear blue, a ripple of wind is fine, and with a shelter rain barely counts.",
  },
});

export const VIS_DEFAULTS = { water: 0, duur: 2, afdak: 0 };
// water: -1 beschut, 0 gemengd, 1 open. duur: 0 ochtend, 1 avond, 2 hele dag.

function visUren(uren, duur) {
  if (duur === 0) return uren.filter((u) => u.uur >= 5 && u.uur < 11);
  if (duur === 1) return uren.filter((u) => u.uur >= 17 && u.uur < 23);
  return uren.filter((u) => u.uur >= 6 && u.uur < 22);
}

export function overlay(hourly, nu = new Date(), instellingen = VIS_DEFAULTS) {
  const inst = { ...VIS_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const alleUren = perDag.get(datum) ?? [];
    if (!alleUren.length) continue;
    const uren = visUren(alleUren, inst.duur);
    if (!uren.length) continue;

    const drukken = alleUren.map((u) => u.druk).filter((d) => d != null);
    const delta = drukken.length >= 6 ? Math.round(drukken[drukken.length - 1] - drukken[0]) : 0;
    const gemBewolking = uren.reduce((a, u) => a + (u.bewolking ?? 50), 0) / uren.length;
    const gemWind = Math.round(uren.reduce((a, u) => a + (u.wind ?? 0), 0) / uren.length);
    const windGrens = inst.water === -1 ? 42 : inst.water === 1 ? 28 : 34;
    const natUren = uren.filter((u) => (u.neerslag ?? 0) > 0.4).length;

    const factoren = [];
    let zin;
    if (delta <= -5) {
      factoren.push({ punten: 18, reden: T.redenDalend });
      zin = T.statusDalend;
    } else if (delta >= 5) {
      factoren.push({ punten: 35, reden: T.redenStijgend });
      zin = T.statusStijgend;
    } else {
      factoren.push({ punten: 10, reden: T.redenStabiel });
      zin = T.statusStabiel;
    }
    if (gemBewolking <= 25) {
      factoren.push({ punten: 10, reden: T.redenZon });
    } else if (gemBewolking >= 55) {
      factoren.push({ punten: -4, reden: T.redenBedekt });
    }
    if (gemWind >= windGrens) {
      factoren.push({ punten: gemWind >= windGrens + 12 ? 35 : 20, reden: T.redenWind(gemWind) });
      zin = T.statusHardeWind(gemWind);
    }
    if (natUren >= 3 && inst.afdak === 0) {
      factoren.push({ punten: 25, reden: T.redenNat });
      zin = T.statusNat;
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, vissen.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score: (u.neerslag ?? 0) > 0.4 && inst.afdak === 0 ? 20 : (u.wind ?? 0) >= windGrens ? 35 : 80,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: { zin: T.metricDruk(delta) },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const vissen = {
  id: "vissen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "vishaak",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: [...BASIS_VELDEN, "surface_pressure"],
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: VIS_DEFAULTS },
  instellingen: {
    defaults: VIS_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "water",
        vraag: T.instWaterVraag,
        keuzes: [
          { label: T.instWaterKeuzes[0], zet: { water: -1 } },
          { label: T.instWaterKeuzes[1], zet: { water: 0 } },
          { label: T.instWaterKeuzes[2], zet: { water: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "duur",
        vraag: T.instDuurVraag,
        keuzes: [
          { label: T.instDuurKeuzes[0], zet: { duur: 0 } },
          { label: T.instDuurKeuzes[1], zet: { duur: 1 } },
          { label: T.instDuurKeuzes[2], zet: { duur: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "afdak",
        vraag: T.instAfdakVraag,
        keuzes: [
          { label: T.instAfdakKeuzes[0], zet: { afdak: 0 } },
          { label: T.instAfdakKeuzes[1], zet: { afdak: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
