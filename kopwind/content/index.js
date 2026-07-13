/**
 * content/index.js
 * Koppelt toolslugs aan hun SEO-content (teksten, blokken, FAQ), in de
 * taal van deze deployment. De sleutels zijn de slugs zoals ze in het
 * register staan, dus per taal anders.
 */

import { LOCALE } from "../lib/i18n/locale.js";

import * as fietsenNaarWerk from "./fietsen-naar-werk.js";
import * as wasBuitenDrogen from "./was-buiten-drogen.js";
import * as watTrekIkAan from "./wat-trek-ik-aan.js";
import * as terras from "./terras.js";
import * as barbecueweer from "./barbecueweer.js";

import * as bikeToWork from "./en/bike-to-work.js";
import * as dryLaundryOutside from "./en/dry-laundry-outside.js";
import * as whatToWear from "./en/what-to-wear.js";
import * as patioWeather from "./en/patio-weather.js";
import * as bbqWeather from "./en/bbq-weather.js";

const PER_SLUG =
  LOCALE === "en"
    ? {
        "bike-to-work": bikeToWork,
        "dry-laundry-outside": dryLaundryOutside,
        "what-to-wear": whatToWear,
        "patio-weather": patioWeather,
        "bbq-weather": bbqWeather,
      }
    : {
        "fietsen-naar-werk": fietsenNaarWerk,
        "was-buiten-drogen": wasBuitenDrogen,
        "wat-trek-ik-aan": watTrekIkAan,
        "terrasweer": terras,
        "barbecueweer": barbecueweer,
      };

export function inhoudVoorTool(slug) {
  return PER_SLUG[slug] ?? null;
}
