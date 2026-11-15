/**
 * app/api/aftel/route.js
 *
 * Publieke stand van een teller voor de insluitbare widget (v3.36.0).
 * ?id=kerst geeft { titel, regel, dagen, url }. Open voor elke origin,
 * want de widget draait op andermans site; er gaat geen gebruikersdata
 * heen of terug. Een uur cache aan de randen.
 */

import { vindAftellerOpId, widgetRegel } from "@/lib/aftellen";
import { SITE_URL } from "@/lib/site";
import { IS_EN } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

const KOPPEN = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
};

export function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  const a = IS_EN ? null : vindAftellerOpId(id ?? "");
  if (!a || (a.soort !== "datum" && a.soort !== "vakantie")) {
    return Response.json({ error: "Onbekende teller." }, { status: 404, headers: KOPPEN });
  }
  const r = widgetRegel(a);
  if (!r) return Response.json({ error: "Geen datum bekend." }, { status: 404, headers: KOPPEN });
  return Response.json(
    { id: a.id, titel: a.titel, regel: r.regel, dagen: r.dagen, url: `${SITE_URL.replace(/\/+$/, "")}/${a.slug}` },
    { headers: KOPPEN }
  );
}
