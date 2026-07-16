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
  pijl: "M3.5 12h17M20.5 12l-5.5-5M20.5 12l-5.5 5",
  vinkje: "M5 12.5l4.5 4.5L19 7.5",
  paraplu: "M4 12.5a8 8 0 0 1 16 0H4ZM12 12.5V18a2.2 2.2 0 0 0 4.4 0M12 3v1.5",
  waslijn: "M3 6h18M9 5v3M15 5v3M8.4 8h7.2l1.1 7.5H7.3Z",
  hardloopschoen: "M3.5 16.5h13.6a4.4 4.4 0 0 0 3.4-2v2H3.5ZM3.5 16.5v-4.6l3.6 1 2.4 2.1M2 10.2h3M1.6 12.8h3",
  strandbal: "M12 12m-6.5 0a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0M12 5.5c3.2 2.1 3.2 10.9 0 13M12 5.5c-3.2 2.1-3.2 10.9 0 13M5.8 9.2h12.4M5.8 14.8h12.4",
  auto: "M4 16v-3l2-4h9l3 4h2v3M4 16h16M7.5 16a1.6 1.6 0 1 0 3.2 0M14 16a1.6 1.6 0 1 0 3.2 0M6 13h10",
  krabber: "M4 20l7-7M11 13l5-5a2 2 0 0 1 2.8 2.8l-5 5ZM13 15l2 2",
  slip: "M3 17c3-4 6 4 9 0s4 2 6 0M17.5 4.5v5M15 7h5M15.7 5.2l3.6 3.6M19.3 5.2l-3.6 3.6",
  fiets:
    "M6 17.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm12 0a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM6 14.3l3.4-6.3h4.2M9.4 8h2.8l3.4 6.3M12.2 8l2.4 6.3",
  druppel:
    "M12 3.5c3.2 4.1 5.5 7.2 5.5 10a5.5 5.5 0 1 1-11 0c0-2.8 2.3-5.9 5.5-10ZM9.5 13.8a2.6 2.6 0 0 0 2 2.5",
  shirt:
    "M9 4l3 1.6L15 4l4.5 2.6-1.7 3.4-2-.9V20h-7.6v-10.9l-2 .9L4.5 6.6 9 4Z",
  parasol:
    "M12 3.2c4.6 0 8.3 3.1 8.8 7.2H3.2c.5-4.1 4.2-7.2 8.8-7.2Zm0 0v.4M7 10.4c.3-3.6 2.3-7 5-7s4.7 3.4 5 7M12 10.4V19m0 0c0 1.2.9 2 2.1 2",
  vlok:
    "M12 3v18M5 6.5l14 11M19 6.5l-14 11M4 12h16M8.5 4.5 12 8l3.5-3.5M8.5 19.5 12 16l3.5 3.5",
  bloem:
    "M12 12a2.6 2.6 0 1 0 0-5.2A2.6 2.6 0 0 0 12 12m0 0a2.6 2.6 0 1 0 5.2 0A2.6 2.6 0 0 0 12 12m0 0a2.6 2.6 0 1 0 0 5.2A2.6 2.6 0 0 0 12 12m0 0a2.6 2.6 0 1 0-5.2 0A2.6 2.6 0 0 0 12 12m0 9v-3.8M12 21c-2.4 0-4-1.2-4.6-2.8M12 21c2.4 0 4-1.2 4.6-2.8",
  menu:
    "M4 7h16M4 12h16M4 17h16",
  menu_dicht:
    "M6 6l12 12M18 6L6 18",
  duim_op:
    "M7 10v10H4V10zM7 10l4-7c1.3 0 2 .9 2 2v3h4.5c1.2 0 2 1 1.8 2.2l-1.3 6c-.2.9-1 1.6-2 1.6H7",
  duim_neer:
    "M17 14V4h3v10zM17 14l-4 7c-1.3 0-2-.9-2-2v-3H6.5c-1.2 0-2-1-1.8-2.2l1.3-6c.2-.9 1-1.6 2-1.6H17",
  deel:
    "M15.5 6.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0M3.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0M15.5 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0M8.2 10.9l5.6-3.3M8.2 13.1l5.6 3.3",
  zon:
    "M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2L5.6 5.6",
  bbq:
    "M5.2 10h13.6M6 10a6 6 0 0 0 12 0M6.5 10a5.8 5.8 0 0 1 11 0M12 4.6v1M12 15.9v4.4M9.3 20.6l1.5-4.9M14.7 20.6l-1.5-4.9",
  tandwiel:
    "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.4-3.2-.1 1.6 2 1.6-1.6 2.8-2.4-.8-1.3 1-.4 2.5h-3.2l-.4-2.5-1.3-1-2.4.8-1.6-2.8 2-1.6-.1-1.6.1-1.6-2-1.6 1.6-2.8 2.4.8 1.3-1 .4-2.5h3.2l.4 2.5 1.3 1 2.4-.8 1.6 2.8-2 1.6.1 1.6Z",
};

const GEVULD = { ster: true, locatie: true };

// Per-icoon lijndikte: de pijl is een richtingaanwijzer en mag steviger
// zijn dan de illustratieve iconen (feedbackronde juli 2026).
const DIKTES = { pijl: 2.7 };

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
      strokeWidth={vullen ? 0 : DIKTES[naam] ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={pad} />
    </svg>
  );
}
