/**
 * lib/tools/storm.js
 *
 * De stormcheck (v3.29.0 "Ghibli"). Niet de vraag of het gaat stormen
 * (dat vertelt elk weerbericht) maar wat JIJ moet doen: trampoline
 * verankeren, parasol plat, kliko binnen, en kun je nog met de
 * aanhanger of caravan de weg op. De motor kijkt naar de piek van de
 * windstoten per dag en vertaalt die naar concrete acties per
 * drempel, met het piekuur als metric zodat je weet wanneer het
 * spannend wordt.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "storm",
    naam: "Moet ik spullen vastzetten voor de storm?",
    korteVraag: "Moet ik spullen vastzetten?",
    meldingKort: "Stormcheck",
    cta: "Check de windstoten",
    navLabel: "Storm",
    diepte: "De piek van de windstoten, vertaald naar wat jij moet vastzetten.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Niets vastzetten", goed: "Rustige wind", twijfelachtig: "Lichte spullen binnen", matig: "Vastzetten geblazen", "zeer-slecht": "Alles vast en blijf binnen" },
    adviesLabels: { goed: "niets vastzetten", matig: "lichte spullen binnen", slecht: "vastzetten geblazen" },
    legenda: { links: "alles vastzetten", rechts: "niets aan de hand" },
    statusZwaar: (s, uur) => `Zware windstoten tot ${s} km/u (piek rond ${uur}:00): trampoline verankeren of omkeren, parasol en partytent weg, kliko binnen, en rijd niet met aanhanger, caravan of lege bus.`,
    statusStevig: (s, uur) => `Windstoten tot ${s} km/u (piek rond ${uur}:00): trampoline en parasol vastzetten, tuinkussens en lichte meubels binnen, kliko op een beschutte plek.`,
    statusLicht: (s) => `Stoten tot ${s} km/u: zet lichte spullen (kussens, parasol, opblaasspeelgoed) even binnen, de rest kan blijven staan.`,
    statusRustig: "Geen wind van betekenis: er hoeft niets vastgezet te worden.",
    redenZwaar: (s) => `zware windstoten tot ${s} km/u`,
    redenStevig: (s) => `windstoten tot ${s} km/u`,
    redenLicht: (s) => `stevige stoten tot ${s} km/u`,
    redenRustig: "rustige wind",
    redenAanhanger: "aanhanger of caravan rijden wordt afgeraden bij deze stoten",
    metricPiek: (s, uur) => `Zwaarste stoten rond ${uur}:00 (tot ${s} km/u).`,
    metricRustig: "Geen piek van betekenis vandaag.",
    instBuitenVraag: "Wat staat er bij jou buiten?",
    instBuitenKeuzes: ["Trampoline of partytent", "Parasol en tuinmeubels", "Weinig tot niets"],
    instWaarVraag: "Tuin of balkon?",
    instWaarKeuzes: ["Tuin op de grond", "Balkon of dakterras"],
    instRijdenVraag: "Rijd je met aanhanger of caravan?",
    instRijdenKeuzes: ["Nee", "Ja, deze dagen wel"],
    instUitleg:
      "De check kijkt naar de piek van de windstoten per dag. Vanaf zo'n 60 km/u gaan lichte spullen schuiven, vanaf 75 wordt een trampoline een projectiel (verankeren of omkeren), en vanaf 100 hoort alles vast te staan en blijf je met aanhanger of caravan van de weg. Op een balkon of dakterras gelden de grenzen een trapje eerder: daar staat meer wind.",
  },
  en: {
    slug: "storm",
    naam: "Should I secure things for the storm?",
    korteVraag: "Should I secure things?",
    meldingKort: "Storm check",
    cta: "Check the gusts",
    navLabel: "Storm",
    diepte: "The peak of the gusts, translated into what you need to secure.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Nothing to secure", goed: "Calm wind", twijfelachtig: "Light items inside", matig: "Time to tie down", "zeer-slecht": "Secure everything and stay in" },
    adviesLabels: { goed: "nothing to secure", matig: "light items inside", slecht: "time to tie down" },
    legenda: { links: "secure everything", rechts: "nothing going on" },
    statusZwaar: (s, uur) => `Severe gusts up to ${s} km/h (peak around ${uur}:00): anchor or flip the trampoline, parasol and party tent away, wheelie bin inside, and don't drive with a trailer, caravan or empty van.`,
    statusStevig: (s, uur) => `Gusts up to ${s} km/h (peak around ${uur}:00): secure trampoline and parasol, cushions and light furniture inside, wheelie bin somewhere sheltered.`,
    statusLicht: (s) => `Gusts up to ${s} km/h: bring light items (cushions, parasol, inflatables) inside, the rest can stay.`,
    statusRustig: "No wind of note: nothing needs securing.",
    redenZwaar: (s) => `severe gusts up to ${s} km/h`,
    redenStevig: (s) => `gusts up to ${s} km/h`,
    redenLicht: (s) => `firm gusts up to ${s} km/h`,
    redenRustig: "calm wind",
    redenAanhanger: "driving with trailer or caravan is discouraged in these gusts",
    metricPiek: (s, uur) => `Heaviest gusts around ${uur}:00 (up to ${s} km/h).`,
    metricRustig: "No peak of note today.",
    instBuitenVraag: "What's outside at your place?",
    instBuitenKeuzes: ["Trampoline or party tent", "Parasol and garden furniture", "Little to nothing"],
    instWaarVraag: "Garden or balcony?",
    instWaarKeuzes: ["Garden at ground level", "Balcony or roof terrace"],
    instRijdenVraag: "Driving with trailer or caravan?",
    instRijdenKeuzes: ["No", "Yes, these days"],
    instUitleg:
      "The check looks at the daily peak of the gusts. From about 60 km/h light items start moving, from 75 a trampoline becomes a projectile (anchor or flip it), and from 100 everything should be fixed and trailers stay off the road. On a balcony or roof terrace the limits apply one step earlier: there's more wind up there.",
  },
});

export const STORM_DEFAULTS = { buiten: 0, balkon: 0, rijden: 0 };
// buiten: 0 trampoline/tent, 1 parasol/meubels, 2 weinig.

export function overlay(hourly, nu = new Date(), instellingen = STORM_DEFAULTS) {
  const inst = { ...STORM_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const uren = perDag.get(datum) ?? [];
    if (!uren.length) continue;

    let piek = 0;
    let piekUur = 12;
    for (const u of uren) {
      const s = u.stoten ?? (u.wind ?? 0) * 1.4;
      if (s > piek) {
        piek = s;
        piekUur = u.uur;
      }
    }
    piek = Math.round(piek);
    const uurStr = String(piekUur).padStart(2, "0");
    // Balkon vangt meer wind; weinig spullen buiten verzacht de vraag.
    const effectief = piek * (inst.balkon === 1 ? 1.12 : 1);
    const spullenKorting = inst.buiten === 2 ? 10 : inst.buiten === 1 ? 4 : 0;

    const factoren = [];
    let zin;
    if (effectief >= 100) {
      factoren.push({ punten: 80 - spullenKorting, reden: T.redenZwaar(piek) });
      zin = T.statusZwaar(piek, uurStr);
    } else if (effectief >= 75) {
      factoren.push({ punten: 60 - spullenKorting, reden: T.redenStevig(piek) });
      zin = T.statusStevig(piek, uurStr);
    } else if (effectief >= 60) {
      factoren.push({ punten: 38 - spullenKorting, reden: T.redenLicht(piek) });
      zin = T.statusLicht(piek);
    } else {
      factoren.push({ punten: 8, reden: T.redenRustig });
      zin = T.statusRustig;
    }
    if (inst.rijden === 1 && effectief >= 75) {
      factoren.push({ punten: 10, reden: T.redenAanhanger });
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score: clamp(score, 0, 100), redenen, advies: adviesVoorScore(clamp(score, 0, 100), storm.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: uren.map((u) => {
        const s = u.stoten ?? (u.wind ?? 0) * 1.4;
        return {
          uur: u.uur,
          score: s >= 90 ? 5 : s >= 70 ? 25 : s >= 55 ? 55 : 90,
          nat: (u.neerslag ?? 0) > 0.1,
        };
      }),
      venster: null,
      metric: { zin: piek >= 55 ? T.metricPiek(piek, uurStr) : T.metricRustig },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const storm = {
  id: "storm",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "vlaag",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: STORM_DEFAULTS },
  instellingen: {
    defaults: STORM_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "buiten",
        vraag: T.instBuitenVraag,
        keuzes: [
          { label: T.instBuitenKeuzes[0], zet: { buiten: 0 } },
          { label: T.instBuitenKeuzes[1], zet: { buiten: 1 } },
          { label: T.instBuitenKeuzes[2], zet: { buiten: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "balkon",
        vraag: T.instWaarVraag,
        keuzes: [
          { label: T.instWaarKeuzes[0], zet: { balkon: 0 } },
          { label: T.instWaarKeuzes[1], zet: { balkon: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "rijden",
        vraag: T.instRijdenVraag,
        keuzes: [
          { label: T.instRijdenKeuzes[0], zet: { rijden: 0 } },
          { label: T.instRijdenKeuzes[1], zet: { rijden: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
