"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StopsEditor from "@/components/StopsEditor";
import LegCard from "@/components/LegCard";
import DagBanner from "@/components/DagBanner";
import SettingsPanel from "@/components/SettingsPanel";
import MeldingenPanel from "@/components/MeldingenPanel";
import NotificationManager from "@/components/NotificationManager";
import { haalRuweEtappes, stelPlanSamen } from "@/lib/planner";
import { DEFAULT_THRESHOLDS } from "@/lib/advice";
import { DEFAULT_MELDINGEN } from "@/lib/notify";
import { APP_NAAM } from "@/lib/brand";
import { DEMO_STOPS, demoLegOptions, demoFetch } from "@/lib/demo";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

// Opslagsleutels behouden het interne voorvoegsel kopwind, zodat bestaande
// gebruikersdata een naamswissel van de tool overleeft.
const LS = {
  presets: "kopwind.presets",
  thresholds: "kopwind.thresholds",
  lastChain: "kopwind.lastChain",
  meldingen: "kopwind.meldingen",
  routes: "kopwind.routes",
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
];

export default function Page() {
  const [stops, setStops] = useState([null, null]);
  const [legOptions, setLegOptions] = useState([{ mode: "nu" }]);
  const [presets, setPresets] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [thresholds, setThresholds] = useState({ ...DEFAULT_THRESHOLDS });
  const [meldingen, setMeldingen] = useState({ ...DEFAULT_MELDINGEN });

  // Resultaatstaat: ruwe ritten uit het netwerk plus de routekeuze per rit.
  const [legsRaw, setLegsRaw] = useState(null);
  const [selection, setSelection] = useState([]);
  const [planStops, setPlanStops] = useState(null);
  const [planLegOptions, setPlanLegOptions] = useState(null);
  const [actieveLeg, setActieveLeg] = useState(0);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [instellingenOpen, setInstellingenOpen] = useState(false);
  const [meldingenOpen, setMeldingenOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

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

  // Opgeslagen staat laden (hydration-safe: pas na mount).
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(LS.presets) ?? "[]");
      if (Array.isArray(p)) setPresets(p);
      const r = JSON.parse(localStorage.getItem(LS.routes) ?? "[]");
      if (Array.isArray(r)) setRoutes(r);
      const t = JSON.parse(localStorage.getItem(LS.thresholds) ?? "null");
      if (t) setThresholds({ ...DEFAULT_THRESHOLDS, ...t });
      const m = JSON.parse(localStorage.getItem(LS.meldingen) ?? "null");
      if (m) setMeldingen({ ...DEFAULT_MELDINGEN, ...m });
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
  }, []);

  // Laatste keten bewaren voor de meldingen: stops, tijden, reistijden, keuze.
  useEffect(() => {
    if (!plan || isDemo || !planStops) return;
    localStorage.setItem(
      LS.lastChain,
      JSON.stringify({
        stops: planStops,
        legOptions: planLegOptions,
        durations: plan.legs.map((l) => l.duration),
        selection,
      })
    );
  }, [plan, isDemo, planStops, planLegOptions, selection]);

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
    const next = [
      ...routes.filter((r) => r.naam !== naam.trim()),
      { naam: naam.trim(), stops: gekozen, legOptions },
    ];
    setRoutes(next);
    localStorage.setItem(LS.routes, JSON.stringify(next));
    setFout(null);
  };

  const laadRoute = (r) => {
    setStops(r.stops);
    setLegOptions(r.legOptions?.length ? r.legOptions : [{ mode: "nu" }]);
    setFout(null);
  };

  const verwijderRoute = (naam) => {
    const next = routes.filter((r) => r.naam !== naam);
    setRoutes(next);
    localStorage.setItem(LS.routes, JSON.stringify(next));
  };

  const wijzigThresholds = (t) => {
    setThresholds(t);
    localStorage.setItem(LS.thresholds, JSON.stringify(t));
  };

  const wijzigMeldingen = (m) => {
    setMeldingen(m);
    localStorage.setItem(LS.meldingen, JSON.stringify(m));
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
      setIsDemo(false);
      setPlanStops(gekozen);
      setPlanLegOptions(legOptions);
      setLegsRaw(raw);
      setSelection(zeros);
      setActieveLeg(plan0.dag?.worstIdx ?? 0);
    } catch (e) {
      setLegsRaw(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const draaiDemo = async () => {
    setFout(null);
    setBezig(true);
    try {
      const nu = new Date();
      const opties = demoLegOptions(nu);
      const raw = await haalRuweEtappes({ stops: DEMO_STOPS, fetchImpl: demoFetch(nu) });
      const zeros = raw.map(() => 0);
      const plan0 = stelPlanSamen({ legsRaw: raw, legOptions: opties, selection: zeros, thresholds });
      setIsDemo(true);
      setPlanStops(DEMO_STOPS);
      setPlanLegOptions(opties);
      setLegsRaw(raw);
      setSelection(zeros);
      setActieveLeg(plan0.dag?.worstIdx ?? 0);
    } catch (e) {
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

  const meldingenActief = meldingen.ochtend || meldingen.vertrek;

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
      "Gratis fietscheck voor woon-werkverkeer: zie reistijd, fietsweer, wind tegen per deel van de route, regen en temperatuur, met een rapportcijfer per rit.",
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
        <button className="knop" onClick={draaiDemo} disabled={bezig}>
          Demo
        </button>
        <button className="knop" onClick={() => setMeldingenOpen(true)}>
          Meldingen{meldingenActief ? " ●" : ""}
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
          temperatuur voor jouw woon-werkrit. Gratis, zonder account.
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
          {isDemo && (
            <p className="uitleg demo-noot">
              Demoketen door Rotterdam met kunstmatige zuidwestenwind. Rit 1 heeft
              twee routes; klik op de chips of op de gestippelde lijn op de kaart om
              te wisselen en het windverschil te zien.
            </p>
          )}
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
        </section>
      ) : (
        !fout && (
          <p className="leeg">
            Vul je vertrekpunt en je werk in (tussenstop zoals de sportschool kan
            ook), of klik op Demo om te zien wat de check doet.
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
        meldingen={meldingen}
        setMeldingen={wijzigMeldingen}
      />
      <NotificationManager meldingen={meldingen} thresholds={thresholds} />
    </div>
  );
}
