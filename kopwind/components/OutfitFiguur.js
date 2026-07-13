"use client";

import { kies } from "@/lib/i18n/locale";

/**
 * Het outfit-figuurtje (v3.0.0): het kledingadvies als emoji-stack.
 * Speels maar strak: een kaartje met het poppetje van vandaag, het
 * advies ernaast en de gevoelsrange eronder. Bij buien komt de paraplu
 * erbij.
 */

const FIGUREN = [
  { emoji: ["\u{1F576}\u{FE0F}", "\u{1F455}", "\u{1FA73}", "\u{1F45F}"], label: kies({ nl: "korte broek en T-shirt", en: "shorts and a T-shirt" }) },
  { emoji: ["\u{1F642}", "\u{1F455}", "\u{1F456}", "\u{1F45F}"], label: kies({ nl: "T-shirt", en: "a T-shirt" }) },
  { emoji: ["\u{1F642}", "\u{1F455}", "\u{1F9E5}", "\u{1F456}"], label: kies({ nl: "trui of vest", en: "jumper or cardigan" }) },
  { emoji: ["\u{1F642}", "\u{1F9E5}", "\u{1F456}", "\u{1F45F}"], label: kies({ nl: "jas erbij", en: "add a jacket" }) },
  { emoji: ["\u{1F9E3}", "\u{1F9E5}", "\u{1F456}", "\u{1F97E}"], label: kies({ nl: "winterjas en sjaal", en: "winter coat and scarf" }) },
];

export default function OutfitFiguur({ outfit }) {
  if (!outfit || outfit.laagIndex == null) return null;
  const fig = FIGUREN[Math.min(outfit.laagIndex, FIGUREN.length - 1)];
  return (
    <div className="outfitfiguur">
      <div className="outfit-emoji" aria-hidden="true">
        {fig.emoji.map((e, i) => (
          <span key={i}>{e}</span>
        ))}
        {outfit.regen && <span>{"\u2602\u{FE0F}"}</span>}
      </div>
      <div className="outfit-tekst">
        <strong>{fig.label}</strong>
        <span>
          {kies({ nl: "gevoel", en: "feels like" })} {outfit.koudsteGevoel}{"\u00b0"} {kies({ nl: "tot", en: "to" })} {outfit.warmsteGevoel}{"\u00b0"}
          {outfit.regen ? kies({ nl: ", buien op komst", en: ", showers on the way" }) : ""}
        </span>
      </div>
    </div>
  );
}
