import Link from "next/link";

/** Broodkruimel voor de programmatische pagina's. */
export default function Broodkruimel({ items }) {
  return (
    <nav className="broodkruimel" aria-label="Kruimelpad">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="kruimel-scheider" aria-hidden="true">/</span>}
          {it.href ? <Link href={it.href}>{it.naam}</Link> : <span>{it.naam}</span>}
        </span>
      ))}
    </nav>
  );
}
