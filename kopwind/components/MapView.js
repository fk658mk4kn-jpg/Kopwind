"use client";

import { useEffect, useRef } from "react";
import { fmtTijd, fmtKm, bft, kompas } from "@/lib/format";
import { schaalVoor } from "@/lib/engine/schaal";
import { legWindSummary } from "@/lib/engine/wind";

/**
 * Leaflet-kaart zonder react-leaflet: eigen dunne wrapper. Leaflet wordt
 * lazy geimporteerd in useEffect zodat SSR er nooit tegenaan loopt.
 *
 * De actieve etappe: gekleurde segmenten (groen rugwind, rood tegenwind) met
 * een witte omranding eronder zodat de kleuren overal leesbaar zijn, plus
 * windpijlen die de windrichting tonen. Alternatieve routes van diezelfde
 * etappe worden dunner en gestippeld getekend, ook in hun eigen windkleuren,
 * zodat je in een oogopslag ziet of een andere route minder tegenwind heeft.
 * Klik op een alternatief om het te kiezen.
 */
export default function MapView({
  legs,
  actieveLeg,
  onKiesRoute,
  presets,
  startCenter = [52.15, 5.3],
  startZoom = 7,
}) {
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const leafletRef = useRef(null);
  const kiesRef = useRef(onKiesRoute);
  kiesRef.current = onKiesRoute;

  useEffect(() => {
    let gestopt = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (gestopt || !wrapRef.current) return;
      leafletRef.current = L;
      if (!mapRef.current) {
        mapRef.current = L.map(wrapRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView(startCenter, startZoom);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap-bijdragers",
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
        // De container kan na init nog van maat veranderen (fonts, grid,
        // mobiel). Zonder herijking rekent Leaflet met de oude maat en
        // rendert hij een uitgesmeerde lage-zoom-tegel. Een ResizeObserver
        // houdt de kaart scherp bij elke maatverandering.
        setTimeout(() => mapRef.current?.invalidateSize(), 60);
        if (typeof ResizeObserver !== "undefined") {
          const ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
          ro.observe(wrapRef.current);
          mapRef.current._kopwindRo = ro;
        }
      }
      teken();
    })();
    return () => {
      gestopt = true;
      mapRef.current?._kopwindRo?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    teken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legs, actieveLeg, presets]);

  const pijlIcon = (L, deg) =>
    L.divIcon({
      className: "windpijl",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html:
        `<div class="windpijl-in" style="transform:rotate(${deg}deg)">` +
        `<svg viewBox="0 0 24 24" width="24" height="24">` +
        `<path d="M12 3 L12 21 M12 3 L7.5 9 M12 3 L16.5 9" ` +
        `stroke="#0e7490" stroke-width="2.6" fill="none" ` +
        `stroke-linecap="round" stroke-linejoin="round"/></svg></div>`,
    });

  const teken = () => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();

    // Zonder plan: eventueel presets tonen, anders Nederland.
    if (!legs || !legs.length) {
      const punten = [];
      (presets ?? []).forEach((p) => {
        L.circleMarker([p.lat, p.lon], {
          radius: 6,
          color: "#0e7490",
          fillColor: "#ffffff",
          fillOpacity: 1,
          weight: 2,
        })
          .bindTooltip(p.naam)
          .addTo(layer);
        punten.push([p.lat, p.lon]);
      });
      if (punten.length) map.fitBounds(punten, { padding: [40, 40], maxZoom: 13 });
      setTimeout(() => map.invalidateSize(), 60);
      return;
    }

    const bounds = [];

    legs.forEach((leg, i) => {
      const actief = i === actieveLeg;

      if (!actief) {
        // Andere etappes: rustige grijze stippellijn.
        const pad = leg.segments.flatMap((s) => s.coords);
        L.polyline(pad, {
          color: "#a8a29e",
          weight: 3,
          dashArray: "6 8",
          opacity: 0.75,
        }).addTo(layer);
        pad.forEach((c) => bounds.push(c));
        return;
      }

      // Actieve etappe: eerst de niet-gekozen alternatieven (dun, gestippeld,
      // eigen windkleuren, klikbaar).
      (leg.alternatieven ?? []).forEach((alt) => {
        if (alt.index === leg.gekozenIndex) return;
        const dmin = Math.round(
          (alt.duration - leg.duration) / 60
        );
        alt.segments.forEach((seg) => {
          const lijn = L.polyline(seg.coords, {
            color: seg.kleur,
            weight: 4,
            opacity: 0.6,
            dashArray: "2 7",
            lineCap: "round",
          }).addTo(layer);
          lijn.on("click", () => kiesRef.current?.(i, alt.index));
          lijn.bindTooltip(
            `Alternatief: ${schaalVoor(alt.advies.score).label.toLowerCase()}, ${fmtKm(alt.distance)}` +
              ` (${dmin >= 0 ? "+" : ""}${dmin} min). Klik om te kiezen.`,
            { sticky: true }
          );
          seg.coords.forEach((c) => bounds.push(c));
        });
      });

      // Gekozen route: witte omranding onder, gekleurde segmenten boven.
      leg.segments.forEach((seg) => {
        L.polyline(seg.coords, {
          color: "#ffffff",
          weight: 9,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layer);
      });
      leg.segments.forEach((seg) => {
        const lijn = L.polyline(seg.coords, {
          color: seg.kleur,
          weight: 5.5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(layer);
        const head = Math.round(seg.headwind);
        const label = head >= 0 ? `${head} km/u tegenwind` : `${-head} km/u rugwind`;
        lijn.bindTooltip(`${label} rond ${fmtTijd(seg.passage)}`, { sticky: true });
        seg.coords.forEach((c) => bounds.push(c));
      });

      // Windpijlen op een paar punten langs de gekozen route.
      const segs = leg.segments;
      const stap = Math.max(1, Math.floor(segs.length / 5));
      for (let k = 0; k < segs.length; k += stap) {
        const s = segs[k];
        if (!s.weer || s.weer.windFrom == null) continue;
        const downwind = (s.weer.windFrom + 180) % 360; // pijl wijst met de wind mee
        L.marker(s.mid, { icon: pijlIcon(L, downwind), interactive: false }).addTo(layer);
      }

      // Begin- en eindmarkering.
      const eerste = segs[0]?.coords[0];
      const laatsteSeg = segs[segs.length - 1];
      const laatste = laatsteSeg?.coords[laatsteSeg.coords.length - 1];
      if (eerste) {
        L.circleMarker(eerste, {
          radius: 7,
          color: "#1c1917",
          fillColor: "#ffffff",
          fillOpacity: 1,
          weight: 2,
        })
          .bindTooltip(leg.van.naam)
          .addTo(layer);
      }
      if (laatste) {
        L.circleMarker(laatste, {
          radius: 7,
          color: "#1c1917",
          fillColor: "#1c1917",
          fillOpacity: 1,
          weight: 2,
        })
          .bindTooltip(leg.naar.naam)
          .addTo(layer);
      }
    });

    if (bounds.length) map.fitBounds(bounds, { padding: [34, 34] });
    setTimeout(() => map.invalidateSize(), 60);
  };

  const actief = legs && legs.length ? legs[actieveLeg] : null;
  const wind = actief ? legWindSummary(actief.segments) : null;
  const downwind = wind ? (wind.from + 180) % 360 : 0;

  return (
    <div className="kaart-inner">
      <div ref={wrapRef} className="leaflet-container" aria-label="Kaart met route en wind" />

      {legs && legs.length > 0 && (
        <div className="kaartlegenda" aria-hidden="true">
          <span>rugwind</span>
          <div className="kleurbalk" />
          <span>tegenwind</span>
        </div>
      )}

      {wind && (
        <div className="windkompas" title="Gemiddelde wind op deze etappe">
          <div className="windkompas-pijl" style={{ transform: `rotate(${downwind}deg)` }}>
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M12 3 L12 21 M12 3 L7.5 9 M12 3 L16.5 9"
                stroke="#0e7490"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="windkompas-tekst">
            <strong>uit {kompas(wind.from)}</strong>
            <span>{bft(wind.speed)} Bft</span>
          </div>
        </div>
      )}
    </div>
  );
}
