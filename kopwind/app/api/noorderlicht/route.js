/**
 * app/api/noorderlicht/route.js
 *
 * De Kp-verwachting van NOAA, omgezet naar nachten in Nederlandse tijd
 * (v3.37.0). Een kwartier cache. Bij een fout bij NOAA een nette 503.
 */

import { haalKp, nachten, kpOordeel } from "@/lib/noorderlicht";

export const dynamic = "force-dynamic";

export async function GET() {
  const kp = await haalKp();
  if (!kp) {
    return Response.json({ error: "Kp-verwachting nu niet bereikbaar." }, { status: 503 });
  }
  const lijst = nachten(kp).map((n) => ({ ...n, oordeel: kpOordeel(n.kp) }));
  return Response.json(
    { nachten: lijst, bijgewerkt: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300" } }
  );
}
