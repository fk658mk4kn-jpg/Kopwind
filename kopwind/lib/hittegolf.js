/**
 * lib/hittegolf.js
 *
 * Toetst een temperatuurreeks aan de KNMI-definitie van een hittegolf
 * (v3.38.0): minstens vijf dagen op rij een maximum van 25 graden of
 * meer, waarvan minstens drie dagen 30 graden of meer. Officieel geldt
 * die toets voor De Bilt.
 */

export function dagMaxima(hourly) {
  const per = new Map();
  (hourly?.time ?? []).forEach((t, i) => {
    const v = hourly.temperature_2m?.[i];
    if (v == null) return;
    const d = t.slice(0, 10);
    per.set(d, Math.max(per.get(d) ?? -99, v));
  });
  return [...per.entries()].sort().map(([datum, max]) => ({ datum, max: Math.round(max * 10) / 10 }));
}

/** Zoekt de langste reeks zomerse dagen en of die aan de definitie voldoet. */
export function toetsHittegolf(dagen) {
  let beste = null;
  let reeks = [];
  const sluit = () => {
    if (!reeks.length) return;
    const tropisch = reeks.filter((d) => d.max >= 30).length;
    const kandidaat = { van: reeks[0].datum, tot: reeks.at(-1).datum, lengte: reeks.length, tropisch };
    if (!beste || kandidaat.lengte > beste.lengte) beste = kandidaat;
    reeks = [];
  };
  for (const d of dagen) {
    if (d.max >= 25) reeks.push(d);
    else sluit();
  }
  sluit();
  const zomers = dagen.filter((d) => d.max >= 25).length;
  const tropisch = dagen.filter((d) => d.max >= 30).length;
  const hittegolf = Boolean(beste && beste.lengte >= 5 && beste.tropisch >= 3);
  return { hittegolf, reeks: beste, zomers, tropisch };
}
