/**
 * lib/strings/nl.js
 *
 * Strings-laag (i18n-naad, §14). De nieuwe en gedeelde UI leest hieruit;
 * bestaande componenten worden stapsgewijs gemigreerd. Bij een VS-port komt
 * er een en.js naast met dezelfde sleutels.
 */

export const S = {
  header: {
    meldingen: "Meldingen",
    instellingen: "Instellingen",
    alleTools: "Alle tools",
  },
  install: {
    knop: "Zet op beginscherm",
    titel: "Sneller terugkomen?",
    uitleg: "Zet deze check op je beginscherm en open hem elke ochtend met een tik.",
    iosStap:
      "Op iPhone en iPad: tik op de deelknop en kies daarna \u201cZet op beginscherm\u201d.",
    later: "Niet nu",
  },
  meldingen: {
    dagen: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    briefing: "Briefing",
    vertrek: "Herinnering voor vertrek",
    minVooraf: "min vooraf",
    tijdToevoegen: "+ tijd",
    drempelAltijd: "altijd melden",
    drempelSlecht: "alleen bij cijfer \u2264",
    drempelGoed: "alleen bij cijfer \u2265",
  },
  algemeen: {
    liveOpgehaald: "live opgehaald om",
    bezig: "Bezig...",
    sluiten: "Sluiten",
  },
};
