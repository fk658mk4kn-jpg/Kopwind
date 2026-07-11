/**
 * scripts/maak-iconen.mjs
 *
 * Genereert de PWA-iconen zonder externe designtools: een teal vlak met
 * drie witte windlijnen met ronde uiteinden. Eenmalig draaien:
 *   node scripts/maak-iconen.mjs
 * Schrijft: app/icon.png (512), app/apple-icon.png (180),
 * public/icons/icon-192.png en public/icons/icon-512.png.
 */

import { PNG } from "pngjs";
import { writeFileSync, mkdirSync } from "node:fs";

const ACHTERGROND = [14, 116, 144]; // #0e7490
const WIT = [255, 255, 255];

function tekenIcoon(maat) {
  const png = new PNG({ width: maat, height: maat });

  // Achtergrond vullen.
  for (let y = 0; y < maat; y++) {
    for (let x = 0; x < maat; x++) {
      const i = (maat * y + x) << 2;
      png.data[i] = ACHTERGROND[0];
      png.data[i + 1] = ACHTERGROND[1];
      png.data[i + 2] = ACHTERGROND[2];
      png.data[i + 3] = 255;
    }
  }

  const zetWit = (x, y) => {
    if (x < 0 || y < 0 || x >= maat || y >= maat) return;
    const i = (maat * Math.round(y) + Math.round(x)) << 2;
    png.data[i] = WIT[0];
    png.data[i + 1] = WIT[1];
    png.data[i + 2] = WIT[2];
    png.data[i + 3] = 255;
  };

  // Horizontale lijn met ronde uiteinden: rechthoek plus twee halve schijven.
  const lijn = (x0, x1, yc, dikte) => {
    const r = dikte / 2;
    for (let y = Math.floor(yc - r); y <= Math.ceil(yc + r); y++) {
      for (let x = Math.floor(x0 - r); x <= Math.ceil(x1 + r); x++) {
        const dy = y - yc;
        let binnen = false;
        if (x >= x0 && x <= x1) {
          binnen = Math.abs(dy) <= r;
        } else {
          const dx = x < x0 ? x - x0 : x - x1;
          binnen = dx * dx + dy * dy <= r * r;
        }
        if (binnen) zetWit(x, y);
      }
    }
  };

  // Drie windlijnen, gecentreerd binnen de veilige zone (voor maskable).
  const dikte = maat * 0.075;
  lijn(maat * 0.2, maat * 0.66, maat * 0.36, dikte);
  lijn(maat * 0.26, maat * 0.8, maat * 0.51, dikte);
  lijn(maat * 0.2, maat * 0.58, maat * 0.66, dikte);

  return PNG.sync.write(png);
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("app/icon.png", tekenIcoon(512));
writeFileSync("app/apple-icon.png", tekenIcoon(180));
writeFileSync("public/icons/icon-192.png", tekenIcoon(192));
writeFileSync("public/icons/icon-512.png", tekenIcoon(512));
console.log("Iconen geschreven.");
