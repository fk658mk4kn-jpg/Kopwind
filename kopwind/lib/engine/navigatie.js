/**
 * lib/engine/navigatie.js
 *
 * Nav-deeplinks, config-gestuurd per vervoersmodus (Zephyr architectuur 3).
 * Nu alleen fietsen; auto/motor krijgt later dezelfde helper plus Waze.
 *
 * Geverifieerde formaten (juli 2026):
 * - Google Maps: officieel cross-platform schema
 *   https://www.google.com/maps/dir/?api=1&origin=..&destination=..
 *   &travelmode=bicycling&waypoints=a|b (werkt op web, Android en iOS).
 * - Apple Maps: klassiek schema maps.apple.com/?saddr=..&daddr=..&dirflg=..
 *   Officieel gedocumenteerd zijn d (auto), w (lopen) en r (ov); dirflg=c
 *   (fietsen) is breed community-gedocumenteerd sinds iOS 14 maar staat
 *   niet in Apples archieftabel. Een onbekende vlag wordt door Maps
 *   genegeerd (dan pakt hij de voorkeursmodus van de gebruiker), dus c is
 *   een veilige inzet. Waypoints ondersteunt het schema niet: bij
 *   tussenstops krijgt Apple begin naar eind. Devicetest: de eigenaar.
 */

const co = (s) => `${s.lat},${s.lon}`;

export function fietsNavUrls(stops) {
  if (!Array.isArray(stops) || stops.length < 2) return null;
  const eerste = stops[0];
  const laatste = stops[stops.length - 1];
  const tussen = stops.slice(1, -1);

  const g = new URL("https://www.google.com/maps/dir/");
  g.searchParams.set("api", "1");
  g.searchParams.set("origin", co(eerste));
  g.searchParams.set("destination", co(laatste));
  g.searchParams.set("travelmode", "bicycling");
  if (tussen.length) g.searchParams.set("waypoints", tussen.map(co).join("|"));

  const a = new URL("https://maps.apple.com/");
  a.searchParams.set("saddr", co(eerste));
  a.searchParams.set("daddr", co(laatste));
  a.searchParams.set("dirflg", "c");

  return { google: g.toString(), apple: a.toString(), tussenstopsWeggevallen: tussen.length > 0 };
}
