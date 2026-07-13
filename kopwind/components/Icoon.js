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
  fiets:
    "M6 17.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm12 0a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM6 14.3l3.4-6.3h4.2M9.4 8h2.8l3.4 6.3M12.2 8l2.4 6.3",
  druppel:
    "M12 3.5c3.2 4.1 5.5 7.2 5.5 10a5.5 5.5 0 1 1-11 0c0-2.8 2.3-5.9 5.5-10ZM9.5 13.8a2.6 2.6 0 0 0 2 2.5",
  shirt:
    "M9 4l3 1.6L15 4l4.5 2.6-1.7 3.4-2-.9V20h-7.6v-10.9l-2 .9L4.5 6.6 9 4Z",
  parasol:
    "M12 3.2c4.6 0 8.3 3.1 8.8 7.2H3.2c.5-4.1 4.2-7.2 8.8-7.2Zm0 0v.4M7 10.4c.3-3.6 2.3-7 5-7s4.7 3.4 5 7M12 10.4V19m0 0c0 1.2.9 2 2.1 2",
  bbq:
    "M5.2 10h13.6M6 10a6 6 0 0 0 12 0M6.5 10a5.8 5.8 0 0 1 11 0M12 4.6v1M12 15.9v4.4M9.3 20.6l1.5-4.9M14.7 20.6l-1.5-4.9",
  tandwiel:
    "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.4-3.2-.1 1.6 2 1.6-1.6 2.8-2.4-.8-1.3 1-.4 2.5h-3.2l-.4-2.5-1.3-1-2.4.8-1.6-2.8 2-1.6-.1-1.6.1-1.6-2-1.6 1.6-2.8 2.4.8 1.3-1 .4-2.5h3.2l.4 2.5 1.3 1 2.4-.8 1.6 2.8-2 1.6.1 1.6Z",
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
