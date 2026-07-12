import test from "node:test";
import assert from "node:assert/strict";
import { droogsnelheid, geschatteDroogtijd, fmtUren } from "../lib/engine/drogen.js";

test("droogsnelheid: regen of hoge buienkans maakt het uur ongeschikt", () => {
  assert.equal(droogsnelheid({ rh: 50, temp: 20, wind: 20, neerslag: 0.5, kans: 0 }), 0);
  assert.equal(droogsnelheid({ rh: 50, temp: 20, wind: 20, neerslag: 0, kans: 60 }), 0);
});

test("droogsnelheid: wind en zon helpen, vochtige lucht remt", () => {
  const basis = { temp: 18, neerslag: 0, kans: 10, rh: 60 };
  const metWind = droogsnelheid({ ...basis, wind: 20 });
  const zonderWind = droogsnelheid({ ...basis, wind: 0 });
  const vochtig = droogsnelheid({ ...basis, wind: 20, rh: 90 });
  const metZon = droogsnelheid({ ...basis, wind: 20, dag: true, bewolking: 20 });
  assert.ok(metWind > zonderWind);
  assert.ok(vochtig < metWind);
  assert.ok(metZon > metWind, "zonbonus bij heldere daglicht-hemel");
});

test("geschatteDroogtijd: schaalt met kracht en kan langer zijn dan de dag", () => {
  assert.equal(geschatteDroogtijd(0), null);
  assert.ok(geschatteDroogtijd(100) < geschatteDroogtijd(30));
  assert.ok(geschatteDroogtijd(10) > 12, "traag weer mag voorbij de daglengte");
});

test("fmtUren: komma en zonder loze nul", () => {
  assert.equal(fmtUren(3.42), "3,4");
  assert.equal(fmtUren(3.0), "3");
});
