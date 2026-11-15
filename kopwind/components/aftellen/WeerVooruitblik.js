"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { haalWeer } from "@/lib/engine/weather";

/**
 * Weervooruitblik voor de dag(en) waar een teller naartoe loopt. Alleen
 * zichtbaar als die dag binnen de uurverwachting valt (zeven dagen). Per
 * dag een samenvatting: hoogste en laagste temperatuur, neerslag, de
 * grootste buienkans en de hardste wind.
 */
const VELDEN = ["temperature_2m", "precipitation", "precipitation_probability", "wind_speed_10m"];
const SNEEUW_VELDEN = [...VELDEN, "snowfall", "snow_depth"];
const DAGEN_NL = ["zo", "ma", "di", "wo", "do", "vr", "za"];

function samenvatting(hourly, sleutel) {
  const idx = hourly.time
    .map((t, i) => (t.startsWith(sleutel) ? i : -1))
    .filter((i) => i >= 0);
  if (idx.length < 12) return null;
  const pak = (v) => idx.map((i) => hourly[v]?.[i]).filter((x) => x != null);
  const temp = pak("temperature_2m");
  const regen = pak("precipitation");
  const kans = pak("precipitation_probability");
  const wind = pak("wind_speed_10m");
  const vlok = pak("snowfall");
  const dek = pak("snow_depth");
  return {
    max: Math.round(Math.max(...temp)),
    min: Math.round(Math.min(...temp)),
    regen: Math.round(regen.reduce((a, b) => a + b, 0) * 10) / 10,
    kans: kans.length ? Math.max(...kans) : null,
    wind: Math.round(Math.max(...wind)),
    sneeuw: vlok.length ? Math.round(vlok.reduce((a, b) => a + b, 0) * 10) / 10 : null,
    dek: dek.length ? Math.round(Math.max(...dek) * 100) : null,
  };
}

function typering(s) {
  if ((s.dek ?? 0) >= 1) return "Sneeuwdek";
  if ((s.sneeuw ?? 0) >= 0.5) return "Sneeuw";
  if (s.regen >= 5) return "Natte dag";
  if (s.regen >= 1 || (s.kans ?? 0) >= 60) return "Buien mogelijk";
  if (s.wind >= 40) return "Veel wind, wel droog";
  if (s.max >= 20) return "Droog en aangenaam";
  return "Overwegend droog";
}

export default function WeerVooruitblik({ datums, plek = { naam: "De Bilt", lat: 52.1, lon: 5.18 }, tool, sneeuw = false }) {
  const [staat, setStaat] = useState({ laden: true });

  useEffect(() => {
    let weg = false;
    haalWeer(plek.lat, plek.lon, sneeuw ? SNEEUW_VELDEN : VELDEN, 7)
      .then((hourly) => {
        if (weg) return;
        const dagen = datums
          .map((s) => ({ sleutel: s, info: samenvatting(hourly, s) }))
          .filter((d) => d.info);
        setStaat({ dagen });
      })
      .catch(() => !weg && setStaat({ fout: true }));
    return () => {
      weg = true;
    };
  }, [datums.join(","), plek.lat, plek.lon, sneeuw]);

  if (staat.laden || staat.fout || !staat.dagen?.length) return null;

  return (
    <section className="paneel aftel-weer">
      <h2 className="paneel-titel">Het weer op de dag zelf</h2>
      <p className="aftel-weer-sub">Verwachting voor {plek.naam}. Hoe verder vooruit, hoe onzekerder.</p>
      <div className="aftel-weer-rij">
        {staat.dagen.map(({ sleutel, info }) => {
          const [j, m, d] = sleutel.split("-").map(Number);
          const wd = DAGEN_NL[new Date(Date.UTC(j, m - 1, d)).getUTCDay()];
          return (
            <div key={sleutel} className="aftel-weer-dag">
              <strong>
                {wd} {d}-{m}
              </strong>
              <span className="aftel-weer-type">{typering(info)}</span>
              <span>
                {info.min}° tot {info.max}°
              </span>
              <span>
                {info.regen} mm{info.kans != null ? `, kans ${info.kans}%` : ""}
              </span>
              <span>wind tot {info.wind} km/u</span>
              {sneeuw && (
                <span>
                  sneeuw {info.sneeuw ?? 0} cm{info.dek ? `, dek ${info.dek} cm` : ""}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {tool && (
        <p className="aftel-weer-door">
          Per uur rekenen voor je eigen plek? <Link href={`/${tool.slug}`}>{tool.naam}</Link>
        </p>
      )}
    </section>
  );
}
