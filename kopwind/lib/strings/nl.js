/**
 * lib/strings/nl.js
 * Nederlandse UI-strings. Sleutels spiegelen en.js een op een; de selector
 * in index.js kiest per deployment.
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
    ja: "Ja",
    nee: "Nee",
    vandaag: "vandaag",
    weekdagen: ["zo", "ma", "di", "wo", "do", "vr", "za"],
  },
  locatieTool: {
    jouwPlek: "Jouw plek",
    kiesEerst: "Kies eerst een plek: zoek een adres, tik een favoriet aan of gebruik je locatie.",
    zoekStandaard: "Zoek een adres of plaats...",
    favorietTitel: "Bewaar als favoriet",
    favorietActief: "Staat bij je favorieten",
    favorietPrompt: "Naam voor deze plek:",
    geenData: "Geen bruikbare weerdata ontvangen. Probeer het zo nog eens.",
    databron: "Weerdata: Open-Meteo uurvoorspelling,",
    leeg: "Kies je plek en tik op de check: je ziet direct het antwoord voor vandaag en de dagen erna.",
    lieverNiet: "liever niet",
    wisselvallig: "wisselvallig",
    besteBlok: "beste blok",
  },
  hub: {
    waarBenJe: "Waar ben je?",
    vandaagIn: "Vandaag in",
    zoekStad: "Zoek je stad...",
    mijnLocatie: "Gebruik mijn locatie",
    locatieFout: "Locatie ophalen lukte niet. Zoek je stad hierboven, dat werkt net zo goed.",
    kiesStad: "Kies je stad hierboven.",
    laden: "Even naar de lucht kijken...",
    geenAntwoord: "Nu even geen antwoord. Probeer de check zelf.",
    binnenkort: "Binnenkort",
    landnaam: "Nederland",
    checksVanVandaag: "De checks van vandaag",
  },
  stem: {
    vraag: "Klopte het advies vandaag?",
    bedankt: "Dank je, genoteerd.",
    jaLabel: "Ja, klopte",
    neeLabel: "Nee, klopte niet",
  },
  nav: {
    openGoogle: "Open in Google Maps",
    openApple: "Open in Apple Maps",
    appleGeenStops: "Apple Maps kan geen tussenstops aan; daar gaat de route van start naar eind.",
  },
  voet: {
    checks: "Checks",
    uitleg: "Uitleg",
    over: "Over",
    overSite: "Over",
    bronnen: "Bronnen en data",
    changelog: "Changelog",
    privacy: "Privacy",
    voorwaarden: "Voorwaarden",
    regel:
      "Geen weerbericht, maar een antwoord. Voorspellingen blijven voorspellingen: kijk voor je vertrekt ook even naar buiten.",
  },
  kruimel: {
    home: "Home",
  },
};
