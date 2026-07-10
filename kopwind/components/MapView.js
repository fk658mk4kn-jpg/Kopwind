"use client";

import { useEffect, useRef } from "react";
import { fmtTijd } from "@/lib/format";

/**
 * Leaflet-kaart zonder react-leaflet: eigen dunne wrapper. Leaflet wordt
 * lazy geimporteerd in useEffect zodat SSR er nooit tegenaan loopt.
 *
 * De actieve etappe wordt getekend als gekleurde segmenten (groen, geel,
 * rood naar kopwind); andere etappes als grijze stippellijn.
 */
export default function MapView({ legs, actieveLeg }) {
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const leafletRef = useRef(null);

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
        }).setView([52.1, 5.3], 8);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap-bijdragers",
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
        setTimeout(() => mapRef.current?.invalidateSize(), 50);
      }
      teken();
    })();
    return () => {
      gestopt = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    teken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legs, actieveLeg]);

  const teken = () => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    if (!legs || !legs.length) return;

    const bounds = [];

    legs.forEach((leg, i) => {
      const actief = i === actieveLeg;
      if (!actief) {
        const pad = leg.segments.flatMap((s) => s.coords);
        L.polyline(pad, {
          color: "#a8a29e",
          weight: 3,
          dashArray: "6 8",
          opacity: 0.8,
        }).addTo(layer);
        pad.forEach((c) => bounds.push(c));
        return;
      }
      leg.segments.forEach((seg) => {
        const lijn = L.polyline(seg.coords, {
          color: seg.kleur,
          weight: 6,
          opacity: 0.95,
        }).addTo(layer);
        const head = Math.round(seg.headwind);
        const label =
          head >= 0 ? `${head} km/u tegenwind` : `${-head} km/u rugwind`;
        lijn.bindTooltip(
          `${label} rond ${fmtTijd(seg.passage)}`,
          { sticky: true }
        );
        seg.coords.forEach((c) => bounds.push(c));
      });
      // Begin- en eindmarkering van de actieve etappe.
      const eerste = leg.segments[0]?.coords[0];
      const laatsteSeg = leg.segments[leg.segments.length - 1];
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

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [28, 28] });
    }
    setTimeout(() => map.invalidateSize(), 50);
  };

  return <div ref={wrapRef} className="leaflet-container" aria-label="Kaart" />;
}
