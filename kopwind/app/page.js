"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import StopsEditor from "@/components/StopsEditor";
import LegCard from "@/components/LegCard";
import DagBanner from "@/components/DagBanner";
import SettingsPanel from "@/components/SettingsPanel";
import MeldingenPanel from "@/components/MeldingenPanel";
import { haalRuweEtappes, stelPlanSamen } from "@/lib/planner";
import { DEFAULT_THRESHOLDS } from "@/lib/advice";
import { APP_NAAM } from "@/lib/brand";
import { fmtTijd } from "@/lib/format";
import { registreerSw } from "@/lib/push-client";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

// Opslagsleutels behouden het interne voorvoegsel kopwind, zodat bestaande
// gebruikersdata een naamswissel van de tool overleeft.
const LS = {
  presets: "kopwind.presets",
  thresholds: "kopwind.thresholds",
  lastChain: "kopwind.lastChain",
  routes: "kopwind.routes",
  synccode: "kopwind.synccode",
};

const FAQ = [
  {
    v: "Kan ik vandaag fietsen naar werk?",
    a: "Vul je route in (thuis naar werk, eventueel met een tussenstop) en kies vertrekken nu of een vertrektijd. Je ziet direct het fietsweer voor jouw rit: wind per deel van de route, regen, temperatuur en een rapportcijfer met advies.",
  },
  {
    v: "Hoeveel wind is te veel om te fietsen?",
    a: "Vanaf zo'n 4 Beaufort tegenwind wordt fietsen merkbaar zwaarder, bij 5 tot 6 Beaufort wordt het pittig. Windkracht alleen zegt weinig: het gaat erom hoeveel wind je tegen hebt. Deze check rekent per stuk route uit hoeveel tegenwind je krijgt op het uur dat je daar fietst.",
  },
  {
    v: "Wat is goed fietsweer?",
    a: "Droog, een gevoelstemperatuur boven een graad of 5 en weinig wind tegen (of wind mee). In de check is dat een rapportcijfer van 7 of hoger: een prima fietsdag.",
  },
  {
    v: "Kan ik ook mijn terugrit en tussenstops checken?",
    a: "Ja. Je plant je hele dag als een keten: heen, eventueel via de sportschool, en weer terug. Elke rit krijgt zijn eigen cijfer op zijn eigen tijdstip, en de zwaarste rit bepaalt het dagadvies, want de fiets gaat mee of niet.",
  },
  {
    v: "Krijg ik ook meldingen op mijn telefoon?",
    a: "Ja. Koppel je apparaten met een synccode en zet per route een ochtendbriefing of vertrekherinnering aan. Op iPhone zet je de site eerst op je beginscherm (vanaf iOS 16.4); daarna komen de meldingen binnen als gewone pushberichten, ook als de app dicht is.",
  },
];

export default function Page() {
  const [stops, setStops] = useState([null, null]);
  const [legOptions, setLegOptions] = useState([{ mode: "nu" }]);
  const [presets, setPresets] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [thresholds, setThresholds] = useState({ ...DEFAULT_THRESHOLDS });
  const [syncCode, setSyncCode] = useState(null);

  // Resultaatstaat: ruwe ritten uit het netwerk plus de routekeuze per rit.
  const [legsRaw, setLegsRaw] = useState(null);
  const [selection, setSelection] = useState([]);
  const [planStops, setPlanStops] = useState(null);
  const [planLegOptions, setPlanLegOptions] = useState(null);
  const [planTijd, setPlanTijd] = useState(null);
  const [actieveLeg, setActieveLeg] = useState(0);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [instellingenOpen, setInstellingenOpen] = useState(false);
  const [meldingenOpen, setMeldingenOpen] = useState(false);

  // Sync: pas naar de server schrijven nadat de eerste load klaar is.
  const syncKlaar = useRef(false);
  const syncTimer = useRef(null);

  // Het plan wordt puur afgeleid: routewissel herrekent direct, zonder fetch.
  const plan = useMemo(() => {
    if (!legsRaw) return null;
    return stelPlanSamen({
      legsRaw,
      legOptions: planLegOptions ?? [],
      selection,
      thresholds,
    });
  }, [legsRaw, planLegOptions, selection, thresholds]);

  // Opgeslagen staat laden (hydration-safe: pas na mount) en SW registreren.
  useEffect(() => {
    registreerSw();
    let code = null;
    try {
      const p = JSON.parse(localStorage.getItem(LS.presets) ?? "[]");
      if (Array.isArray(p)) setPresets(p);
      const r = JSON.parse(localStorage.getItem(LS.routes) ?? "[]");
      if (Array.isArray(r)) setRoutes(r);
      const t = JSON.parse(localStorage.getItem(LS.thresholds) ?? "null");
      if (t) setThresholds({ ...DEFAULT_THRESHOLDS, ...t });
      code = localStorage.getItem(LS.synccode) || null;
      setSyncCode(code);
      const keten = JSON.parse(localStorage.getItem(LS.lastChain) ?? "null");
      if (keten?.stops?.length >= 2) {
        setStops(keten.stops);
        const opts = keten.legOptions ?? [];
        // Oude ketens met "auto" op de eerste rit worden "vertrekken nu".
        if (opts[0]?.mode === "auto") opts[0] = { mode: "nu" };
        setLegOptions(opts.length ? opts : [{ mode: "nu" }]);
      }
    } catch {
      // Kapotte localStorage negeren; schone start.
    }
    // Serverdata ophalen als er een code is; server wint bij het laden.
    (async () => {
      if (code) {
        try {
          const res = await fetch(`/api/sync?code=${encodeURIComponent(code)}`);
          if (res.ok) {
            const { data } = await res.json();
            pasServerDataToe(data);
          }
        } catch {
          // Offline of server weg: lokaal verder.
        }
      }
      syncKlaar.current = true;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pasServerDataToe = (data) => {
    if (!data) return;
    if (Array.isArray(data.presets)) {
      setPresets(data.presets);
      localStorage.setItem(LS.presets, JSON.stringify(data.presets));
    }
    if (Array.isArray(data.routes)) {
      setRoutes(data.routes);
      localStorage.setItem(LS.routes, JSON.stringify(data.routes));
    }
    if (data.thresholds) {
      const t = { ...DEFAULT_THRESHOLDS, ...data.thresholds };
      setThresholds(t);
      localStorage.setItem(LS.thresholds, JSON.stringify(t));
    }
  };

  // Wijzigingen (debounced) naar de server sturen.
  useEffect(() => {
    if (!syncKlaar.current || !syncCode) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch("/api/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: syncCode,
          data: { presets, routes, thresholds },
        }),
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(syncTimer.current);
  }, [presets, routes, thresholds, syncCode]);

  // Laatste keten bewaren (voor de volgende sessie op dit apparaat).
  useEffect(() => {
    if (!plan || !planStops) return;
    localStorage.setItem(
      LS.lastChain,
      JSON.stringify({
        stops: planStops,
        legOptions: planLegOptions,
        durations: plan.legs.map((l) => l.duration),
        selection,
      })
    );
  }, [plan, planStops, planLegOptions, selection]);

  const bewaarPreset = (preset) => {
    const next = [...presets.filter((p) => p.naam !== preset.naam), preset];
    setPresets(next);
    localStorage.setItem(LS.presets, JSON.stringify(next));
  };

  const verwijderPreset = (naam) => {
    const next = presets.filter((p) => p.naam !== naam);
    setPresets(next);
    localStorage.setItem(LS.presets, JSON.stringify(next));
  };

  const zetRoutes = (next) => {
    setRoutes(next);
    localStorage.setItem(LS.routes, JSON.stringify(next));
  };

  const bewaarRoute = () => {
    const gekozen = stops.filter(Boolean);
    if (gekozen.length < stops.length || gekozen.length < 2) {
      setFout("Vul eerst alle stops in, dan kun je de route opslaan.");
      return;
    }
    const naam = window.prompt(
      "Naam voor deze route (bv. Woon-werk, Sportschooldag):",
      "Woon-werk"
    );
    if (!naam) return;
    const bestaand = routes.find((r) => r.naam === naam.trim());
    zetRoutes([
      ...routes.filter((r) => r.naam !== naam.trim()),
      {
        naam: naam.trim(),
        stops: gekozen,
        legOptions,
        durations: plan?.legs?.map((l) => l.duration) ?? bestaand?.durations,
        meldingen: bestaand?.meldingen,
      },
    ]);
    setFout(null);
  };

  const laadRoute = (r) => {
    setStops(r.stops);
    setLegOptions(r.legOptions?.length ? r.legOptions : [{ mode: "nu" }]);
    setFout(null);
  };

  const verwijderRoute = (naam) => {
    zetRoutes(routes.filter((r) => r.naam !== naam));
  };

  const wijzigRouteMeldingen = (naam, meldingen) => {
    zetRoutes(routes.map((r) => (r.naam === naam ? { ...r, meldingen } : r)));
  };

  const wijzigThresholds = (t) => {
    setThresholds(t);
    localStorage.setItem(LS.thresholds, JSON.stringify(t));
  };

  const maakSyncCode = async () => {
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const d = await res.json();
      if (!res.ok) return d.error ?? "Kon geen synccode aanmaken.";
      setSyncCode(d.code);
      localStorage.setItem(LS.synccode, d.code);
      // Dit apparaat vult het nieuwe profiel meteen met zijn data.
      await fetch("/api/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: d.code, data: { presets, routes, thresholds } }),
      }).catch(() => {});
      return null;
    } catch {
      return "Kon geen synccode aanmaken (server niet bereikbaar).";
    }
  };

  const koppelSyncCode = async (code) => {
    try {
      const res = await fetch(`/api/sync?code=${encodeURIComponent(code)}`);
      const d = await res.json();
      if (!res.ok) return d.error ?? "Onbekende synccode.";
      setSyncCode(code);
      localStorage.setItem(LS.synccode, code);
      pasServerDataToe(d.data);
      return null;
    } catch {
      return "Koppelen mislukt (server niet bereikbaar).";
    }
  };

  const ontkoppel = () => {
    setSyncCode(null);
    localStorage.removeItem(LS.synccode);
  };

  const bereken = async () => {
    setFout(null);
    const gekozen = stops.filter(Boolean);
    if (gekozen.length < stops.length || gekozen.length < 2) {
      setFout("Vul alle stops in (minimaal je vertrekpunt en je werk).");
      return;
    }
    setBezig(true);
    try {
      const raw = await haalRuweEtappes({ stops: gekozen });
      const zeros = raw.map(() => 0);
      const plan0 = stelPlanSamen({
        legsRaw: raw,
        legOptions,
        selection: zeros,
        thresholds,
      });
      setPlanStops(gekozen);
      setPlanLegOptions(legOptions);
      setLegsRaw(raw);
      setSelection(zeros);
      setPlanTijd(new Date());
      setActieveLeg(plan0.dag?.worstIdx ?? 0);
    } catch (e) {
      setLegsRaw(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const kiesRoute = (legIdx, routeIdx) => {
    setSelection((prev) => {
      const next = prev.slice();
      next[legIdx] = routeIdx;
      return next;
    });
    setActieveLeg(legIdx);
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.v,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAAM,
    description:
      "Gratis fietscheck voor woon-werkverkeer: zie reistijd, fietsweer, wind tegen per deel van de route, regen en temperatuur, met een rapportcijfer per rit en meldingen op je telefoon.",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: "nl",
  };

  return (
    <div className="container">
      <header className="kop">
        <div className="merk">
          <span className="merk-mark" aria-hidden="true" />
          <span className="merk-naam">{APP_NAAM.toLowerCase()}</span>
        </div>
        <span className="spacer" />
        <button className="knop" onClick={() => setMeldingenOpen(true)}>
          Meldingen{syncCode ? " ●" : ""}
        </button>
        <button className="knop" onClick={() => setInstellingenOpen(true)}>
          Instellingen
        </button>
      </header>

      <section className="hero">
        <h1>Vandaag op de fiets naar werk?</h1>
        <p>
          Check in een oogopslag of fietsen naar werk vandaag een goed idee is:
          reistijd, wind (en waar op de route je die tegen hebt), regen en
          temperatuur voor jouw woon-werkrit. Gratis, zonder account, met
          meldingen op je telefoon.
        </p>
      </section>

      <div className="werkblad">
        <div className="blok-planner">
          <section className="paneel">
            <h2 className="paneel-titel">Jouw rit</h2>
            {routes.length > 0 && (
              <div className="chips routechips">
                <span className="routekeuze-label">Mijn routes:</span>
                {routes.map((r) => (
                  <button
                    key={r.naam}
                    className="chip"
                    onClick={() => laadRoute(r)}
                    title={r.stops.map((s) => s.naam.split(",")[0]).join(" → ")}
                  >
                    {r.naam}
                  </button>
                ))}
              </div>
            )}
            <StopsEditor
              stops={stops}
              setStops={setStops}
              legOptions={legOptions}
              setLegOptions={setLegOptions}
              presets={presets}
              onSavePreset={bewaarPreset}
            />
            <div className="actiebalk">
              <button className="knop primair" onClick={bereken} disabled={bezig}>
                {bezig ? "Bezig..." : "Check mijn fietsrit"}
              </button>
              <button className="knop" onClick={bewaarRoute} disabled={bezig}>
                Route opslaan
              </button>
            </div>
          </section>
          {fout && <div className="fout">{fout}</div>}
        </div>

        <div className="blok-map">
          <div className="kaartpaneel">
            <MapView
              legs={plan?.legs}
              actieveLeg={actieveLeg}
              onKiesRoute={kiesRoute}
              presets={presets}
            />
          </div>
        </div>
      </div>

      {plan ? (
        <section className="resultaten" aria-label="Ritinformatie">
          <DagBanner dag={plan.dag} />
          <div className="legs">
            {plan.legs.map((leg, i) => (
              <LegCard
                key={i}
                leg={leg}
                index={i}
                actief={i === actieveLeg}
                onClick={() => setActieveLeg(i)}
                onKiesRoute={kiesRoute}
              />
            ))}
          </div>
          {planTijd && (
            <p className="databron">
              Weerdata: Open-Meteo uurvoorspelling, live opgehaald om{" "}
              {fmtTijd(planTijd)}. Routes: OpenStreetMap.
            </p>
          )}
        </section>
      ) : (
        !fout && (
          <p className="leeg">
            Vul je vertrekpunt en je werk in (tussenstop zoals de sportschool kan
            ook) en klik op Check mijn fietsrit.
          </p>
        )
      )}

      <section className="seotekst">
        <h2>Zo werkt de fietscheck voor woon-werkverkeer</h2>
        <p>
          Vul je route in: van huis naar werk, met als je wilt een tussenstop
          zoals de sportschool of school. Kies vertrekken nu, een vertrektijd of
          een aankomsttijd (dan rekenen we terug wanneer je weg moet). De check
          haalt je fietsroute op, splitst hem in stukken van zo'n 300 meter en
          rekent per stuk uit hoeveel wind je tegen hebt op het uur dat je daar
          fietst. Elke rit krijgt een rapportcijfer voor het fietsweer en een
          advies: prima fietsdag, pittige rit, of vandaag liever niet fietsen.
        </p>

        <h2>Wind tegen op de fiets: zie waar en hoe hard</h2>
        <p>
          Windkracht 4 zegt weinig als de wind schuin mee staat. Daarom rekent de
          check met de richting van elk stuk route: tegenwind is windsnelheid maal
          de cosinus van het verschil tussen windrichting en rijrichting. Op de
          kaart kleurt je route van groen (wind mee) via amber naar rood (wind
          tegen), met pijlen die laten zien waar de wind vandaan komt. Zo weet je
          vooraf of dat ene stuk langs het water de rit zwaar maakt, en of een
          alternatieve fietsroute naar werk minder tegenwind heeft.
        </p>

        <h2>Het beste moment om naar werk te fietsen</h2>
        <p>
          Het weer om 8 uur is niet het weer om 17 uur. De check gebruikt de
          uurvoorspelling: je heenrit en je terugrit krijgen elk hun eigen wind,
          regen en temperatuur. Schuif met je vertrektijd en je ziet direct of een
          uurtje eerder of later vertrekken een droge of snellere rit oplevert.
        </p>

        <h2>Meldingen op je telefoon: elke ochtend je fietsadvies</h2>
        <p>
          Sla je woon-werkroute op en zet per route een ochtendbriefing aan: elke
          werkdag een pushmelding met het dagadvies, de wind en de regen voor jouw
          rit. Of kies een herinnering een kwartier voor vertrek met het actuele
          weer. Werkt op je laptop en op je telefoon; op iPhone zet je de site
          eerst op je beginscherm. Apparaten koppel je met een synccode, zonder
          account of e-mailadres.
        </p>

        <h2>Fietsen naar werk: reistijd en comfort eerlijk vergelijken</h2>
        <p>
          Fietsen naar werk is gezond, goedkoop en vaak verrassend snel, maar
          alleen als je weet wat je onderweg tegenkomt. Deze check weegt reistijd,
          wind, regen, temperatuur en windstoten voor jouw woon-werkrit, zodat je
          's ochtends in een paar seconden beslist: vandaag de fiets, of niet.
        </p>

        <h2>Veelgestelde vragen over fietsen naar werk</h2>
        {FAQ.map((f) => (
          <div key={f.v} className="faq-item">
            <h3>{f.v}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <SettingsPanel
        open={instellingenOpen}
        onClose={() => setInstellingenOpen(false)}
        thresholds={thresholds}
        setThresholds={wijzigThresholds}
        presets={presets}
        onDeletePreset={verwijderPreset}
        routes={routes}
        onDeleteRoute={verwijderRoute}
      />
      <MeldingenPanel
        open={meldingenOpen}
        onClose={() => setMeldingenOpen(false)}
        routes={routes}
        onWijzigRouteMeldingen={wijzigRouteMeldingen}
        syncCode={syncCode}
        onMaakCode={maakSyncCode}
        onKoppelCode={koppelSyncCode}
        onOntkoppel={ontkoppel}
      />
    </div>
  );
}
