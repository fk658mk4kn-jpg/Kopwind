import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { HUB_NAAM, WINDSTRIP_DEMO } from "@/lib/brand";
import { vindTool } from "@/lib/tools";
import { kleurDivergerend } from "@/lib/engine/kleuren";

/**
 * OG-image per tool (dekt ook de onderliggende stad-pagina's): de vraag
 * van de tool groot, de windstrip als signature, het merk als afzender.
 */

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const tool = vindTool(params.tool);
  const vraag = tool?.korteVraag ?? HUB_NAAM;
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
        <div style={{ display: "flex", fontSize: 34, color: "#C9D6E2" }}>
          {HUB_NAAM.toLowerCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            color: "#F2B705",
            lineHeight: 1.08,
            marginTop: 18,
          }}
        >
          {vraag}
        </div>
        <div
          style={{
            display: "flex",
            height: 84,
            borderRadius: 18,
            overflow: "hidden",
            marginTop: 52,
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
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bricolage", data: font, weight: 700, style: "normal" }],
    }
  );
}
