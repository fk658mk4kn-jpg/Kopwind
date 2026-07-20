/**
 * lib/tools/buitenkraan-aftappen.js
 *
 * De buitenkraancheck (v3.33.0 "Autan"). Een waarschuwingscheck: komt er
 * vorst aan, dan kan het water in een buitenkraan of buitenleiding
 * bevriezen, uitzetten en de leiding of kraan laten springen. De check
 * kijkt naar de komende nachten en beoordeelt hoe streng en hoe lang het
 * vriest. Hoe kouder en langer, hoe dringender het advies om de kraan af
 * te sluiten en af te tappen. De score is het vorstrisico: een gunstig,
 * groen oordeel betekent geen actie nodig.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "buitenkraan-aftappen",
    naam: "Moet ik de buitenkraan aftappen?",
    korteVraag: "Moet ik de buitenkraan aftappen?",
    meldingKort: "Buitenkraancheck",
    cta: "Check het vorstrisico",
    navLabel: "Buitenkraan aftappen",
    diepte: "De komende nachten: hoe streng en hoe lang vriest het, en moet de kraan leeg?",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen vorst, niks doen", goed: "Nauwelijks risico", twijfelachtig: "Lichte vorst, let op", matig: "Vorst: tap af", "zeer-slecht": "Strenge vorst: nu aftappen" },
    adviesLabels: { goed: "niks doen", matig: "aftappen aan te raden", slecht: "nu aftappen" },
    legenda: { links: "geen actie", rechts: "aftappen" },
    statusGeen: "Geen vorst de komende nacht: de buitenkraan kan gewoon aan blijven.",
    statusLicht: (t) => `Lichte vorst op komst (tot ${t} graden): een korte nacht rond nul kan meestal wel, maar let op. Bij twijfel: aftappen.`,
    statusMatig: (t) => `Vorst verwacht (tot ${t} graden): sluit de buitenkraan af en tap hem af, anders kan de leiding springen.`,
    statusStreng: (t) => `Strenge vorst (tot ${t} graden): sluit de buitenkraan nu af, tap hem af en koppel de tuinslang los.`,
    redenStreng: (t) => `strenge vorst de komende nacht (tot ${t} graden)`,
    redenMatig: (t) => `vorst de komende nacht (tot ${t} graden)`,
    redenLicht: (t) => `lichte vorst rond ${t} graden`,
    redenLang: (u) => `lang onder nul (ongeveer ${u} uur): de kou trekt door tot in de leiding`,
    redenGeen: "geen vorst in het vooruitzicht",
    metricVorst: (t, u) => `Koudste nacht tot ${t} graden, ongeveer ${u} uur onder nul.`,
    metricGeen: "Geen vorst de komende nachten.",
    instLeidingVraag: "Waar zit de kraan of leiding?",
    instLeidingKeuzes: ["Beschut (dicht bij huis)", "Normaal", "Vrijstaand of slecht geisoleerd"],
    instSlangVraag: "Zit er een tuinslang aan?",
    instSlangKeuzes: ["Nee", "Ja"],
    instHoeverVraag: "Hoe voorzichtig wil je zijn?",
    instHoeverKeuzes: ["Pas bij echte vorst", "Normaal", "Liever op safe"],
    instUitleg:
      "De check kijkt naar de komende nachten en weegt hoe koud het wordt en hoe lang het onder nul blijft. Water zet uit als het bevriest, en een buitenkraan of buitenleiding kan daardoor springen. Lichte, korte vorst rond nul is vaak nog te overzien, maar bij echte of langere vorst is aftappen verstandig: sluit de kraan binnen af, open de buitenkraan om hem leeg te laten lopen en koppel de tuinslang los. Een vrijstaande of slecht geisoleerde leiding is gevoeliger; stel dat in, dan schuift de check strenger.",
  },
  en: {
    slug: "drain-outdoor-tap",
    naam: "Should I drain the outdoor tap?",
    korteVraag: "Should I drain the outdoor tap?",
    meldingKort: "Outdoor tap check",
    cta: "Check the frost risk",
    navLabel: "Drain outdoor tap",
    diepte: "The coming nights: how hard and how long does it freeze, and drain the tap?",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No frost, do nothing", goed: "Barely any risk", twijfelachtig: "Light frost, watch out", matig: "Frost: drain it", "zeer-slecht": "Hard frost: drain now" },
    adviesLabels: { goed: "do nothing", matig: "draining advised", slecht: "drain now" },
    legenda: { links: "no action", rechts: "drain" },
    statusGeen: "No frost the coming night: the outdoor tap can stay on.",
    statusLicht: (t) => `Light frost coming (down to ${t} degrees): a short night near zero is usually fine, but watch out. If in doubt: drain it.`,
    statusMatig: (t) => `Frost expected (down to ${t} degrees): shut off the outdoor tap and drain it, or the pipe may burst.`,
    statusStreng: (t) => `Hard frost (down to ${t} degrees): shut off the outdoor tap now, drain it and disconnect the hose.`,
    redenStreng: (t) => `hard frost the coming night (down to ${t} degrees)`,
    redenMatig: (t) => `frost the coming night (down to ${t} degrees)`,
    redenLicht: (t) => `light frost around ${t} degrees`,
    redenLang: (u) => `long below zero (about ${u} hours): the cold reaches into the pipe`,
    redenGeen: "no frost ahead",
    metricVorst: (t, u) => `Coldest night down to ${t} degrees, about ${u} hours below zero.`,
    metricGeen: "No frost the coming nights.",
    instLeidingVraag: "Where is the tap or pipe?",
    instLeidingKeuzes: ["Sheltered (near the house)", "Normal", "Free-standing or poorly insulated"],
    instSlangVraag: "Is a garden hose attached?",
    instSlangKeuzes: ["No", "Yes"],
    instHoeverVraag: "How careful do you want to be?",
    instHoeverKeuzes: ["Only at real frost", "Normal", "Rather safe"],
    instUitleg:
      "The check looks at the coming nights and weighs how cold it gets and how long it stays below zero. Water expands when it freezes, and an outdoor tap or pipe can burst as a result. Light, short frost around zero is often manageable, but with real or longer frost draining is wise: shut off the tap indoors, open the outdoor tap to let it drain and disconnect the hose. A free-standing or poorly insulated pipe is more sensitive; set that and the check shifts stricter.",
  },
});

export const KRAAN_DEFAULTS = { leiding: 1, slang: 0, hoever: 1 };

export function overlay(hourly, nu = new Date(), instellingen = KRAAN_DEFAULTS) {
  const inst = { ...KRAAN_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const alle = basis.filter((u) => u.datum >= dagKeyVan(nu));
  const datums = [...new Set(alle.map((u) => u.datum))].sort().slice(0, 5);

  // Gevoeligheid: beschutte leiding verdraagt iets meer, vrijstaand minder.
  const schuif = inst.leiding === 0 ? -1 : inst.leiding === 2 ? 1.5 : 0;
  const marge = inst.hoever === 0 ? -1 : inst.hoever === 2 ? 1 : 0;

  const dagenUit = [];
  for (const datum of datums) {
    // Nacht vanaf 18:00 die dag, 14 uur vooruit (t/m ~08:00).
    const startIdx = alle.findIndex((u) => u.datum === datum && u.uur >= 18);
    const nacht = startIdx >= 0 ? alle.slice(startIdx, startIdx + 14) : [];
    if (!nacht.length) continue;
    const minTemp = Math.min(...nacht.map((u) => u.temp ?? 99));
    const urenOnderNul = nacht.filter((u) => (u.temp ?? 99) <= 0).length;
    // Effectieve vorst: pas de drempels aan naar leiding en voorzichtigheid.
    const eff = minTemp + schuif + marge;

    const factoren = [];
    let zin;
    let metricZin;
    if (eff < -4) {
      factoren.push({ punten: 84, reden: T.redenStreng(Math.round(minTemp)) });
      zin = T.statusStreng(Math.round(minTemp));
    } else if (eff < -0.5) {
      factoren.push({ punten: 64, reden: T.redenMatig(Math.round(minTemp)) });
      zin = T.statusMatig(Math.round(minTemp));
    } else if (eff < 1.5) {
      factoren.push({ punten: 44, reden: T.redenLicht(Math.round(minTemp)) });
      zin = T.statusLicht(Math.round(minTemp));
    } else {
      factoren.push({ punten: 8, reden: T.redenGeen });
      zin = T.statusGeen;
    }
    if (urenOnderNul >= 6 && eff < 1.5) {
      factoren.push({ punten: 10, reden: T.redenLang(urenOnderNul) });
    }
    if (inst.slang === 1 && eff < 1.5) {
      factoren.push({ punten: 6, reden: T.redenMatig(Math.round(minTemp)) });
    }

    if (minTemp <= 2) {
      metricZin = T.metricVorst(Math.round(minTemp), urenOnderNul);
    } else {
      metricZin = T.metricGeen;
    }

    const { score, redenen } = maakScore(factoren);
    const s = clamp(score, 0, 100);
    const conditie = { score: s, redenen, advies: adviesVoorScore(s, buitenkraanAftappen.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: s < 45, zin },
      uren: nacht
        .filter((u) => u.datum === datum)
        .map((u) => ({
          uur: u.uur,
          score: (u.temp ?? 99) <= -4 ? 84 : (u.temp ?? 99) <= -0.5 ? 64 : (u.temp ?? 99) <= 1.5 ? 44 : 8,
          nat: (u.neerslag ?? 0) > 0.1,
        })),
      venster: null,
      metric: { zin: metricZin },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const buitenkraanAftappen = {
  id: "buitenkraan-aftappen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "kraan",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KRAAN_DEFAULTS },
  instellingen: {
    defaults: KRAAN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "leiding",
        vraag: T.instLeidingVraag,
        keuzes: [
          { label: T.instLeidingKeuzes[0], zet: { leiding: 0 } },
          { label: T.instLeidingKeuzes[1], zet: { leiding: 1 } },
          { label: T.instLeidingKeuzes[2], zet: { leiding: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "slang",
        vraag: T.instSlangVraag,
        keuzes: [
          { label: T.instSlangKeuzes[0], zet: { slang: 0 } },
          { label: T.instSlangKeuzes[1], zet: { slang: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "hoever",
        vraag: T.instHoeverVraag,
        keuzes: [
          { label: T.instHoeverKeuzes[0], zet: { hoever: 0 } },
          { label: T.instHoeverKeuzes[1], zet: { hoever: 1 } },
          { label: T.instHoeverKeuzes[2], zet: { hoever: 2 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "De buitenkraan winterklaar", en: "Winter-proof the outdoor tap" },
    advies: {
      nl: "Bij terugkerende vorst helpt een gevelkraan met aftapmogelijkheid of een isolatiekap op de kraan; een leidinglint voorkomt bevriezing van kwetsbare leidingen. Koppel de tuinslang los en berg hem vorstvrij op.",
      en: "For recurring frost a drainable outdoor tap or an insulation cap helps; heating tape prevents vulnerable pipes from freezing. Disconnect the hose and store it frost-free.",
    },
    items: [
      { label: { nl: "Kraanisolatie en leidinglint", en: "Tap insulation and heating tape" }, url: "https://www.bol.com/nl/nl/s/?searchtext=kraan+isolatie+vorst", partner: "bol.com" },
    ],
  },
};
