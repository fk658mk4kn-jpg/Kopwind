/**
 * lib/aftellen/vakanties.js
 *
 * Schoolvakanties per regio, overgenomen uit de officiele vaststelling
 * (Staatscourant 2024, 19237; voor 2027-2028 gecontroleerd tegen
 * government.nl). Herfst-, voorjaars- en facultatieve meivakantie zijn
 * adviesdata: scholen mogen daarvan afwijken. Zomer- en kerstvakantie
 * liggen vast. Bijwerken: zodra een nieuw schooljaar is vastgesteld, een
 * blok onderaan toevoegen; de test waarschuwt als de data opraken.
 */

const R = (regio, start, eind) => ({ regio, start, eind });

export const VAKANTIE_DATA = {
  herfst: [
    R("noord", "2026-10-10", "2026-10-18"),
    R("midden", "2026-10-17", "2026-10-25"),
    R("zuid", "2026-10-17", "2026-10-25"),
    R("noord", "2027-10-16", "2027-10-24"),
    R("midden", "2027-10-16", "2027-10-24"),
    R("zuid", "2027-10-23", "2027-10-31"),
  ],
  kerst: [
    R("noord", "2026-12-19", "2027-01-03"),
    R("midden", "2026-12-19", "2027-01-03"),
    R("zuid", "2026-12-19", "2027-01-03"),
    R("noord", "2027-12-25", "2028-01-09"),
    R("midden", "2027-12-25", "2028-01-09"),
    R("zuid", "2027-12-25", "2028-01-09"),
  ],
  voorjaar: [
    R("noord", "2027-02-20", "2027-02-28"),
    R("midden", "2027-02-20", "2027-02-28"),
    R("zuid", "2027-02-13", "2027-02-21"),
    R("noord", "2028-02-19", "2028-02-27"),
    R("midden", "2028-02-26", "2028-03-05"),
    R("zuid", "2028-02-26", "2028-03-05"),
  ],
  mei: [
    R("noord", "2027-04-24", "2027-05-02"),
    R("midden", "2027-04-24", "2027-05-02"),
    R("zuid", "2027-04-24", "2027-05-02"),
    R("noord", "2028-04-29", "2028-05-07"),
    R("midden", "2028-04-29", "2028-05-07"),
    R("zuid", "2028-04-29", "2028-05-07"),
  ],
  zomer: [
    R("noord", "2027-07-10", "2027-08-22"),
    R("midden", "2027-07-17", "2027-08-29"),
    R("zuid", "2027-07-24", "2027-09-05"),
    R("noord", "2028-07-15", "2028-08-27"),
    R("midden", "2028-07-08", "2028-08-20"),
    R("zuid", "2028-07-22", "2028-09-03"),
  ],
};

export const REGIO_NAAM = { noord: "Regio noord", midden: "Regio midden", zuid: "Regio zuid" };

/**
 * De regio-indeling loopt per gemeente, niet strak per provincie. We
 * noemen daarom bewust geen provincielijst die net niet klopt; de pagina
 * verwijst naar de schoolgids of de gemeente.
 */
export const REGIO_HINT =
  "De indeling in noord, midden en zuid gaat per gemeente. Twijfel je, kijk dan in de schoolgids; die noemt ook afwijkende data van je eigen school.";
