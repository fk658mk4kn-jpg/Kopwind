/**
 * lib/tools/zonkracht.js
 *
 * De zonkrachtcheck (v3.3.0 "Meltemi"): verbrand ik vandaag, en wanneer
 * moet ik smeren? Draait volledig op de gedeelde weerbasis, want
 * uv_index zit al in BASIS_VELDEN.
 *
 * Ontwerpkeuzes:
 * - De score is omgekeerd aan de zon: veel zonkracht betekent een lage
 *   score en dus een rode badge. Zo werkt de kleur als waarschuwing.
 * - Het antwoord (ja/nee) beantwoordt "moet ik smeren?": ja vanaf
 *   zonkracht 3, de grens die ook GGD en KWF hanteren.
 * - De verbrandtijd is een vuistregel per huidtype (basisminuten
 *   gedeeld door de zonkracht) en wordt bewust als schatting gebracht.
 *   De FAQ zegt het eerlijk: smeren is eigenlijk altijd verstandig; de
 *   check vertelt vooral wanneer het dringend is.
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

/** Alle teksten van de zonkrachtcheck, per taal. */
const T = kies({
  nl: {
    slug: "zonkracht",
    naam: "Verbrand ik vandaag?",
    korteVraag: "Moet ik vandaag smeren?",
    meldingKort: "Zonkracht",
    cta: "Check de zonkracht",
    navLabel: "Zonkracht",
    diepte: "De piek, het smeervenster en hoe snel jouw huid verbrandt.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen smeerzorgen", goed: "Smeren aangeraden", twijfelachtig: "Goed insmeren", matig: "Om de twee uur smeren", "zeer-slecht": "Verbrandalarm" },
    adviesLabels: { goed: "rustige zon", matig: "stevige zon", slecht: "felle zon" },
    legenda: { links: "felle zon", rechts: "weinig zon" },
    vensterLabel: "smeervenster",
    huidNamen: ["zeer licht", "licht", "getint", "donker"],
    jaZin: (piek, uur, min) => `Smeren: de zonkracht piekt om ${uur}:00 op ${piek}. Onbeschermd verbrand je rond de piek in zo'n ${min} minuten.`,
    jaZinVoorbij: (piek) => `De piek (zonkracht ${piek}) is geweest, maar smeren blijft verstandig zolang de zon schijnt.`,
    neeZin: (piek) => `De zonkracht blijft vandaag onder de 3 (piek ${piek}). Smeren mag, moet niet.`,
    neeZinNul: "Vandaag nauwelijks uv. Geen smeerzorgen.",
    toekomstJa: (piek, uur) => `Zonkracht piekt op ${piek} rond ${uur}:00. Smeren dus.`,
    toekomstNee: (piek) => `Zonkracht blijft onder de 3 (piek ${piek}).`,
    metric: (huid, min) => `Met jouw huidtype (${huid}) verbrand je onbeschermd in zo'n ${min} minuten rond de piek. Smeer elke twee uur opnieuw, en direct na het zwemmen.`,
    redenPiek: (piek, uur) => `zonkracht piekt op ${piek} rond ${uur}:00`,
    redenVerbrand: (min) => `onbeschermd verbrand je in ~${min} minuten`,
    redenLang: (uren) => `${uren} uur boven zonkracht 3`,
    instHuidVraag: "Welk huidtype heb je?",
    instHuidKeuzes: ["Zeer licht: verbrand altijd, bruin nooit", "Licht: verbrand snel, bruin langzaam", "Getint: verbrand soms, bruin makkelijk", "Donker: verbrand zelden"],
    instDrempelVraag: "Wanneer wil je het smeerseintje?",
    instDrempelKeuzes: ["Voorzichtig (vanaf zonkracht 2)", "Standaard (vanaf 3)", "Alleen bij felle zon (vanaf 4)"],
    instDrempel: "Smeren vanaf zonkracht",
    instUitleg:
      "De verbrandtijd is een vuistregel: basisminuten voor jouw huidtype gedeeld door de zonkracht. Bewolking zit al in het uv-getal verwerkt. En eerlijk is eerlijk: smeren is eigenlijk altijd verstandig; deze check vertelt vooral wanneer het dringend is.",
  },
  en: {
    slug: "sunscreen",
    naam: "Will I burn today?",
    korteVraag: "Do I need sunscreen today?",
    meldingKort: "UV check",
    cta: "Check the UV",
    navLabel: "UV",
    diepte: "The peak, the sunscreen window and how fast your skin burns.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No sunscreen stress", goed: "Sunscreen advised", twijfelachtig: "Lather up properly", matig: "Reapply every two hours", "zeer-slecht": "Burn alert" },
    adviesLabels: { goed: "gentle sun", matig: "strong sun", slecht: "fierce sun" },
    legenda: { links: "fierce sun", rechts: "little sun" },
    vensterLabel: "sunscreen window",
    huidNamen: ["very fair", "fair", "olive", "dark"],
    jaZin: (piek, uur, min) => `Sunscreen on: UV peaks at ${uur}:00 at ${piek}. Unprotected you burn in about ${min} minutes around the peak.`,
    jaZinVoorbij: (piek) => `The peak (UV ${piek}) has passed, but sunscreen stays smart while the sun is out.`,
    neeZin: (piek) => `UV stays below 3 today (peak ${piek}). Sunscreen is optional.`,
    neeZinNul: "Barely any UV today. No sunscreen stress.",
    toekomstJa: (piek, uur) => `UV peaks at ${piek} around ${uur}:00. Sunscreen it is.`,
    toekomstNee: (piek) => `UV stays below 3 (peak ${piek}).`,
    metric: (huid, min) => `With your skin type (${huid}) you burn unprotected in about ${min} minutes around the peak. Reapply every two hours, and right after swimming.`,
    redenPiek: (piek, uur) => `UV peaks at ${piek} around ${uur}:00`,
    redenVerbrand: (min) => `unprotected you burn in ~${min} minutes`,
    redenLang: (uren) => `${uren} hours above UV 3`,
    instHuidVraag: "What is your skin type?",
    instHuidKeuzes: ["Very fair: always burns, never tans", "Fair: burns fast, tans slowly", "Olive: sometimes burns, tans easily", "Dark: rarely burns"],
    instDrempelVraag: "When do you want the sunscreen nudge?",
    instDrempelKeuzes: ["Careful (from UV 2)", "Standard (from 3)", "Only when fierce (from 4)"],
    instDrempel: "Sunscreen from UV",
    instUitleg:
      "The burn time is a rule of thumb: base minutes for your skin type divided by the UV index. Cloud cover is already in the UV number. And to be honest: sunscreen is basically always a good idea; this check mainly tells you when it's urgent.",
  },
});

export const ZON_DEFAULTS = {
  huid: 2, // 1 zeer licht .. 4 donker
  smeerVanaf: 3, // GGD/KWF-grens
};

/** Basisminuten tot verbranden bij zonkracht 1, per huidtype. Vuistregel. */
const BASIS_MINUTEN = { 1: 67, 2: 100, 3: 150, 4: 220 };

/** Verbrandtijd in minuten bij een zonkracht, afgerond op 5. */
export function verbrandMinuten(uv, huid = 2) {
  if (!uv || uv <= 0) return null;
  const basis = BASIS_MINUTEN[huid] ?? BASIS_MINUTEN[2];
  return Math.max(5, Math.round(basis / uv / 5) * 5);
}

function uvPijn(piek) {
  if (piek == null) return 0;
  return Math.round(clamp(lerp(piek, 2, 9, 8, 70), 0, 78));
}

export function overlay(hourly, nu = new Date(), instellingen = ZON_DEFAULTS) {
  const inst = { ...ZON_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    dagen.push({ datum, uren: dagUren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, uren }) => {
    const metUv = uren.filter((u) => u.uv != null);
    let piek = 0;
    let piekUur = 12;
    for (const u of metUv) {
      if (u.uv > piek) {
        piek = u.uv;
        piekUur = u.uur;
      }
    }
    const piekAf = Math.round(piek * 10) / 10;
    const smeerUren = metUv.filter((u) => u.uv >= inst.smeerVanaf);
    const venster = smeerUren.length
      ? { van: smeerUren[0].uur, tot: smeerUren[smeerUren.length - 1].uur + 1, uren: smeerUren.length }
      : null;
    const minuten = verbrandMinuten(piek, inst.huid);

    const factoren = [{ punten: uvPijn(piek), reden: piek >= inst.smeerVanaf ? T.redenPiek(piekAf, String(piekUur).padStart(2, "0")) : null }];
    if (piek >= inst.smeerVanaf && minuten) {
      factoren.push({ punten: 0, reden: T.redenVerbrand(minuten) });
    }
    if (venster && venster.uren >= 6) {
      factoren.push({ punten: 4, reden: T.redenLang(venster.uren) });
    }
    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, zonkracht.adviesLabels) };

    const isVandaag = datum === vandaagKey;
    const smerenNodig = piek >= inst.smeerVanaf;
    let zin;
    if (isVandaag) {
      if (!smerenNodig) {
        zin = piek < 1 ? T.neeZinNul : T.neeZin(piekAf);
      } else if (venster && nu.getHours() >= venster.tot) {
        zin = T.jaZinVoorbij(piekAf);
      } else {
        zin = T.jaZin(piekAf, String(piekUur).padStart(2, "0"), minuten);
      }
    } else {
      zin = smerenNodig ? T.toekomstJa(piekAf, String(piekUur).padStart(2, "0")) : T.toekomstNee(piekAf);
    }

    return {
      datum,
      antwoord: { ja: smerenNodig, zin },
      uren: metUv.map((u) => ({
        uur: u.uur,
        score: Math.round(clamp(100 - lerp(u.uv ?? 0, 0, 9, 0, 100), 0, 100)),
        nat: false,
      })),
      venster,
      metric: smerenNodig && minuten ? { zin: T.metric(T.huidNamen[inst.huid - 1], minuten) } : null,
      conditie,
      status: { soort: smerenNodig ? "info" : "nee", zin },
      piek: piekAf,
    };
  });

  return {
    legenda: T.legenda,
    vensterLabel: T.vensterLabel,
    dagen: dagenUit,
  };
}

export const zonkracht = {
  id: "zonkracht",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#D97C1B",
  locatieHint: T.locatieHint,
  icoon: "zon",
  groep: "Elke dag",
  soort: "advies",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: ZON_DEFAULTS },
  instellingen: {
    defaults: ZON_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "huid",
        vraag: T.instHuidVraag,
        keuzes: [
          { label: T.instHuidKeuzes[0], zet: { huid: 1 } },
          { label: T.instHuidKeuzes[1], zet: { huid: 2 } },
          { label: T.instHuidKeuzes[2], zet: { huid: 3 } },
          { label: T.instHuidKeuzes[3], zet: { huid: 4 } },
        ],
      },
      {
        type: "keuze",
        id: "drempel",
        vraag: T.instDrempelVraag,
        keuzes: [
          { label: T.instDrempelKeuzes[0], zet: { smeerVanaf: 2 } },
          { label: T.instDrempelKeuzes[1], zet: { smeerVanaf: 3 } },
          { label: T.instDrempelKeuzes[2], zet: { smeerVanaf: 4 } },
        ],
      },
      { key: "smeerVanaf", label: T.instDrempel, eenheid: "", step: 1, min: 2, max: 5, geavanceerd: true },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
