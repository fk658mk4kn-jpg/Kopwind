/**
 * lib/server/db.js
 *
 * Dunne helper voor de Supabase REST-laag (PostgREST), alleen voor
 * servergebruik met de service-role key. Bewust zonder supabase-js:
 * fetch volstaat en scheelt een dependency.
 *
 * Vereist env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */

export function dbGeconfigureerd() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function headers(extra = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function url(pad) {
  return `${process.env.SUPABASE_URL}/rest/v1/${pad}`;
}

/** SELECT: pad is bv. "profielen?code_hash=eq.abc&select=data". */
export async function dbSelect(pad) {
  const res = await fetch(url(pad), { headers: headers(), cache: "no-store" });
  if (!res.ok) {
    // De Supabase-body bevat de echte reden (ontbrekende kolom, schema,
    // RLS). Meenemen in de fout zodat de log bruikbaar is.
    const body = await res.text().catch(() => "");
    throw new Error(`Database select gaf ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

/** INSERT met optie om duplicaten stil te negeren (voor dedupe). */
export async function dbInsert(tabel, rows, { negeerDuplicaten = false } = {}) {
  const prefer = negeerDuplicaten
    ? "resolution=ignore-duplicates,return=representation"
    : "return=representation";
  const res = await fetch(url(tabel), {
    method: "POST",
    headers: headers({ Prefer: prefer }),
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`Database insert gaf ${res.status}`);
  return res.json();
}

/** UPSERT op de primary key. */
export async function dbUpsert(tabel, rows) {
  const res = await fetch(url(tabel), {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`Database upsert gaf ${res.status}`);
  return res.json();
}

/** PATCH: pad met filter, bv. "profielen?code_hash=eq.abc". */
export async function dbPatch(pad, patch) {
  const res = await fetch(url(pad), {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Database patch gaf ${res.status}`);
}

/** DELETE: pad met filter. */
export async function dbDelete(pad) {
  const res = await fetch(url(pad), {
    method: "DELETE",
    headers: headers({ Prefer: "return=minimal" }),
  });
  if (!res.ok) throw new Error(`Database delete gaf ${res.status}`);
}
