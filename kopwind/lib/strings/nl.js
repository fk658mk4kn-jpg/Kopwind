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
    titel: "Zet 'm op je beginscherm",
    uitleg:
      "Dan weet je elke ochtend met een tik of het kan. En we tikken je op de schouder als het weer omslaat bij jou in de buurt.",
    iosStap:
      "Tik op de deelknop en kies \u201cZet op beginscherm\u201d. Daarna opent de check als app en kun je meldingen aanzetten.",
    later: "Niet nu",
  },
  meldingen: {
    dagen: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    briefing: "Briefing",
    vertrek: "Herinnering voor vertrek",
    minVooraf: "min vooraf",
    tijdToevoegen: "+ tijd",
    drempelAltijd: "altijd melden",
    drempelSlecht: "waarschuw bij slecht nieuws",
    drempelGoed: "alleen bij goed nieuws",
  },
  algemeen: {
    liveOpgehaald: "live opgehaald om",
    bezig: "Bezig...",
    sluiten: "Sluiten",
  },
};
