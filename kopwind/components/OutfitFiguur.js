"use client";

/**
 * Het outfit-figuurtje (v3.0.0): het kledingadvies als emoji-stack.
 * Speels maar strak: een kaartje met het poppetje van vandaag, het
 * advies ernaast en de gevoelsrange eronder. Bij buien komt de paraplu
 * erbij.
 */

const FIGUREN = [
  { emoji: ["\u{1F576}\u{FE0F}", "\u{1F455}", "\u{1FA73}", "\u{1F45F}"], label: "korte broek en T-shirt" },
  { emoji: ["\u{1F642}", "\u{1F455}", "\u{1F456}", "\u{1F45F}"], label: "T-shirt" },
  { emoji: ["\u{1F642}", "\u{1F455}", "\u{1F9E5}", "\u{1F456}"], label: "trui of vest" },
  { emoji: ["\u{1F642}", "\u{1F9E5}", "\u{1F456}", "\u{1F45F}"], label: "jas erbij" },
  { emoji: ["\u{1F9E3}", "\u{1F9E5}", "\u{1F456}", "\u{1F97E}"], label: "winterjas en sjaal" },
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
          gevoel {outfit.koudsteGevoel}{"\u00b0"} tot {outfit.warmsteGevoel}{"\u00b0"}
          {outfit.regen ? ", buien op komst" : ""}
        </span>
      </div>
    </div>
  );
}
