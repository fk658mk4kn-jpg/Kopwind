"use client";

/**
 * Eén consistente icoonset (geen emoji): kleine inline SVG's op currentColor,
 * zodat kleur en grootte via CSS meelopen.
 */

const PADEN = {
  locatie: "M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Zm0-7.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z",
  ster: "M12 3.6l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8L12 3.6Z",
  kruis: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14",
  bel: "M12 3a6 6 0 0 0-6 6v3.6l-1.6 2.9c-.3.6.1 1.5.9 1.5h13.4c.8 0 1.2-.9.9-1.5L18 12.6V9a6 6 0 0 0-6-6Zm-2 15a2 2 0 0 0 4 0",
  klok: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.2 1.9",
  pijl: "M12 3v18M12 3l-4.5 6M12 3l4.5 6",
  vinkje: "M5 12.5l4.5 4.5L19 7.5",
};

const GEVULD = { ster: true, locatie: true };

export default function Icoon({ naam, maat = 16, vol = false, className = "" }) {
  const pad = PADEN[naam];
  if (!pad) return null;
  const vullen = vol && GEVULD[naam];
  return (
    <svg
      viewBox="0 0 24 24"
      width={maat}
      height={maat}
      className={`icoon ${className}`}
      aria-hidden="true"
      fill={vullen ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={vullen ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={pad} />
    </svg>
  );
}
