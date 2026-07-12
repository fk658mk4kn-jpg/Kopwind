import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { HUB_NAAM, HUB_CLAIM, WINDSTRIP_DEMO } from "@/lib/brand";
import { kleurDivergerend } from "@/lib/engine/kleuren";

/**
 * OG-image van de hub (P1-E): de windstrip als signature op leisteen met
 * het gele merkwoord. Gerenderd door next/og (satori); de display-letter
 * staat als woff in assets/og/ (zie scripts/maak-og-font.mjs).
 */

export const runtime = "nodejs";
export const alt = HUB_NAAM;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(
    path.join(process.cwd(), "assets", "og", "BricolageGrotesque-700.woff")
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1B2733",
          padding: "72px 80px",
          fontFamily: "Bricolage",
        }}
      >
        <div style={{ display: "flex", fontSize: 88, color: "#F2B705", lineHeight: 1.05 }}>
          {HUB_NAAM.toLowerCase()}
        </div>
        <div
          style={{
            display: "flex",
            height: 84,
            borderRadius: 18,
            overflow: "hidden",
            marginTop: 48,
          }}
        >
          {WINDSTRIP_DEMO.map((x, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: `${100 / WINDSTRIP_DEMO.length}%`,
                height: "100%",
                background: kleurDivergerend(x),
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 30, color: "#C9D6E2" }}>
          {HUB_CLAIM}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bricolage", data: font, weight: 700, style: "normal" }],
    }
  );
}
