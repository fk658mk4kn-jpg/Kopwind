import Link from "next/link";
import Broodkruimel from "@/components/Broodkruimel";
import TekstMetLinks from "@/components/TekstMetLinks";
import DeelKnop from "@/components/DeelKnop";
import AftelTeller from "./AftelTeller";
import WeerVooruitblik from "./WeerVooruitblik";
import ZonKlok from "./ZonKlok";
import MaanBlok from "./MaanBlok";
import DroogKlok from "./DroogKlok";
import WidgetCode from "./WidgetCode";
import { SITE_URL } from "@/lib/site";
import { HUB_NAAM } from "@/lib/brand";
import { vindToolOpId } from "@/lib/tools";
import { platteTekst } from "@/lib/inlineLinks";
import { AFTEL_INHOUD } from "@/content/aftellen";
import { REGIO_HINT } from "@/lib/aftellen/vakanties";
import {
  vraagVan, volgende, komende, weekendStatus, vindAftellerOpId, AFTEL_HUB_PAD,
} from "@/lib/aftellen";
import {
  datumTekst, dagNaam, vandaag, plusDagen, dagenTussen, sleutel, zonTijden, daglengte,
  tijdTekst, duurTekst, wandklok,
} from "@/lib/aftellen/datums";

const DE_BILT = { lat: 52.1, lon: 5.18 };
const DEN_HAAG = { naam: "Den Haag", lat: 52.07, lon: 4.3 };

function dagenZin(m, naam) {
  if (m.isVandaag) return { groot: "Vandaag", sub: `Het is vandaag ${naam}.` };
  if (m.bezig) return { groot: `Nog ${m.nogDagenBezig}`, sub: `${m.nogDagenBezig === 1 ? "dag" : "dagen"} tot het einde. Het is nu ${naam}.` };
  return { groot: String(m.dagen), sub: `${m.dagen === 1 ? "dag" : "dagen"} tot ${naam}` };
}

function wekenTekst(dagen) {
  const w = Math.floor(dagen / 7);
  const r = dagen % 7;
  if (w === 0) return `${r} ${r === 1 ? "dag" : "dagen"}`;
  return `${w} ${w === 1 ? "week" : "weken"}${r ? ` en ${r} ${r === 1 ? "dag" : "dagen"}` : ""}`;
}

/** Dagen tussen start en eind (max zeven) als datum-sleutels voor het weer. */
function weerDatums(start, eind, nuDag) {
  const lijst = [];
  for (let d = start; dagenTussen(d, eind) >= 0 && lijst.length < 7; d = plusDagen(d, 1)) {
    const afstand = dagenTussen(nuDag, d);
    if (afstand >= 0 && afstand <= 6) lijst.push(sleutel(d));
  }
  return lijst;
}

function DatumBlok({ a, m }) {
  const z = dagenZin(m, a.naam);
  const td = a.tijdDoel;
  const exact = m.start && (a.seizoen || a.maan) ? wandklok(m.doelTijdstip) : null;
  return (
    <section className="paneel aftel-hoofd">
      <p className="aftel-groot">{z.groot}</p>
      <p className="aftel-sub">{z.sub}</p>
      <p className="aftel-datum">
        {datumTekst(m.start, { metDag: true })}
        {m.eind && dagenTussen(m.start, m.eind) > 0 ? ` tot en met ${datumTekst(m.eind, { metDag: true })}` : ""}
        {exact ? `, om ${String(exact.u).padStart(2, "0")}:${String(exact.mi).padStart(2, "0")} uur` : ""}
        {td?.label ? ` (teller tot ${td.label})` : ""}
      </p>
      <AftelTeller doel={m.doelTijdstip} klaarTekst={`Het is ${a.naam}.`} />
      {!m.isVandaag && !m.bezig && (
        <ul className="aftel-feiten">
          <li>Dat is {wekenTekst(m.dagen)}</li>
          {!a.geenWerkdagen && (
            <li>
              Daarvan {m.werkdagen} {m.werkdagen === 1 ? "werkdag" : "werkdagen"} (vanaf morgen, zonder feestdagen)
            </li>
          )}
          <li>Het valt op een {dagNaam(m.start)}</li>
        </ul>
      )}
    </section>
  );
}

function VakantieBlok({ a, momenten }) {
  if (!momenten.length) {
    return (
      <section className="paneel aftel-hoofd">
        <p className="aftel-sub">De data voor het volgende schooljaar zijn nog niet vastgesteld. Zodra ze bekend zijn staan ze hier.</p>
      </section>
    );
  }
  return (
    <section className="aftel-regios">
      {momenten.map((m) => {
        const z = dagenZin(m, a.naam);
        return (
          <div key={m.label} className="paneel aftel-regio">
            <h2 className="paneel-titel">{m.label}</h2>
            <p className="aftel-groot klein">{z.groot}</p>
            <p className="aftel-sub">{z.sub}</p>
            <p className="aftel-datum">
              {datumTekst(m.start, { metDag: true })} tot en met {datumTekst(m.eind, { metDag: true })}
            </p>
            {!m.bezig && <p className="aftel-sub">Nog {m.werkdagen} {m.werkdagen === 1 ? "werkdag" : "werkdagen"} te gaan, feestdagen niet meegeteld.</p>}
          </div>
        );
      })}
      <p className="aftel-voetnoot">{REGIO_HINT}</p>
    </section>
  );
}

function DaglichtBlok({ m }) {
  const z = zonTijden(m.start, DE_BILT.lat, DE_BILT.lon);
  const lengte = daglengte(m.start, DE_BILT.lat, DE_BILT.lon);
  const nuDag = vandaag();
  const nuLengte = daglengte(nuDag, DE_BILT.lat, DE_BILT.lon);
  return (
    <section className="paneel aftel-daglicht">
      <h2 className="paneel-titel">Daglicht op die dag in De Bilt</h2>
      <ul className="aftel-feiten">
        <li>Zonsopkomst: {tijdTekst(z.op)}</li>
        <li>Zonsondergang: {tijdTekst(z.onder)}</li>
        <li>Daglengte: {duurTekst(lengte)}</li>
        <li>Vandaag: {duurTekst(nuLengte)} daglicht</li>
      </ul>
    </section>
  );
}

export default function AftelPagina({ afteller: a }) {
  const inhoud = AFTEL_INHOUD[a.id];
  const nu = Date.now();
  const nuDag = vandaag(nu);
  const tool = a.tool ? vindToolOpId(a.tool) : null;
  const momenten = a.soort === "datum" || a.soort === "vakantie" ? volgende(a, nu) : [];
  const eerste = momenten[0];

  let weer = [];
  if (a.weer && a.soort === "datum" && eerste) weer = weerDatums(eerste.start, eerste.eind, nuDag);
  if (a.weer && a.soort === "vakantie" && eerste) {
    const vroegste = [...momenten].sort((x, y) => x.dagen - y.dagen)[0];
    weer = weerDatums(vroegste.start, vroegste.eind, nuDag);
  }
  let weekend = null;
  if (a.soort === "weekend") {
    weekend = weekendStatus(nu);
    const vr = vandaag(weekend.start);
    weer = weerDatums(plusDagen(vr, 1), plusDagen(vr, 2), nuDag);
  }

  let zonStart = null;
  if (a.soort === "zon") {
    const z = zonTijden(nuDag, DE_BILT.lat, DE_BILT.lon);
    zonStart = { op: tijdTekst(z.op), onder: tijdTekst(z.onder), lengte: duurTekst(daglengte(nuDag, DE_BILT.lat, DE_BILT.lon)) };
  }

  const jaren = a.soort === "datum" && !a.maan ? komende(a, 4, nu) : [];
  const verwant = (a.verwant ?? []).map(vindAftellerOpId).filter(Boolean);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: inhoud.faq.map((f) => ({
      "@type": "Question",
      name: f.v,
      acceptedAnswer: { "@type": "Answer", text: platteTekst(f.a) },
    })),
  };

  return (
    <main>
      <Broodkruimel
        items={[
          { naam: HUB_NAAM, href: "/" },
          { naam: "Aftellen en kalender", href: AFTEL_HUB_PAD },
          { naam: a.titel },
        ]}
      />
      <section className="tool-hero">
        <h1>{vraagVan(a)}</h1>
        <p>{inhoud.intro}</p>
      </section>

      {a.soort === "datum" && eerste && <DatumBlok a={a} m={eerste} />}
      {a.soort === "vakantie" && <VakantieBlok a={a} momenten={momenten} />}
      {a.soort === "weekend" && (
        <section className="paneel aftel-hoofd">
          <p className="aftel-label">{weekend.bezig ? "Het is weekend" : "Het weekend begint"}</p>
          <p className="aftel-groot klein">
            {weekend.bezig ? "Geniet ervan" : `${dagNaam(vandaag(weekend.start))} 17:00`}
          </p>
          <AftelTeller doel={weekend.doel} modus="weekend" />
        </section>
      )}
      {a.soort === "zon" && <ZonKlok start={zonStart} modus={a.zonModus} />}
      {a.maan && <MaanBlok nu={nu} />}
      {a.soort === "droog" && <DroogKlok />}

      {a.daglicht && eerste && <DaglichtBlok m={eerste} />}

      {weer.length > 0 && (
        <WeerVooruitblik
          datums={weer}
          plek={a.id === "prinsjesdag" ? DEN_HAAG : undefined}
          sneeuw={Boolean(a.sneeuw)}
          tool={tool ? { slug: tool.slug, naam: tool.naam } : null}
        />
      )}

      <div className="feedback-rij">
        <DeelKnop label="Deel deze teller" />
      </div>

      {(a.soort === "datum" || a.soort === "vakantie") && eerste && (
        <WidgetCode id={a.id} slug={a.slug} siteUrl={SITE_URL} />
      )}

      <section className="seotekst">
        {jaren.length > 1 && (
          <>
            <h2>De komende jaren</h2>
            <table className="aftel-tabel">
              <tbody>
                {jaren.map((d) => (
                  <tr key={sleutel(d)}>
                    <th scope="row">{d.j}</th>
                    <td>{datumTekst(d, { metDag: true, metJaar: false })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {inhoud.blokken.map((b) => (
          <div key={b.kop}>
            <h2>{b.kop}</h2>
            <p>
              <TekstMetLinks tekst={b.tekst} />
            </p>
          </div>
        ))}

        <h2>Veelgestelde vragen</h2>
        {inhoud.faq.map((f) => (
          <details key={f.v} className="faq-item">
            <summary>
              <h3>{f.v}</h3>
            </summary>
            <p>
              <TekstMetLinks tekst={f.a} />
            </p>
          </details>
        ))}
      </section>

      <section className="aftel-verwant">
        <h2>Ook aftellen</h2>
        <div className="aftel-chips">
          {verwant.map((v) => (
            <Link key={v.id} href={`/${v.slug}`} className="chip">
              {v.titel}
            </Link>
          ))}
          <Link href={AFTEL_HUB_PAD} className="chip">
            Alle tellers
          </Link>
        </div>
        {tool && (
          <p className="aftel-weer-door">
            Past hierbij: <Link href={`/${tool.slug}`}>{tool.naam}</Link>
          </p>
        )}
      </section>

      <p className="bijgewerkt-regel">Telling van {datumTekst(nuDag)}, in Nederlandse tijd.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
