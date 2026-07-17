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
import * as hardloopweerNl from "./hardloopweer.js";
import * as strandweerNl from "./strandweer.js";
import * as autoWassenNl from "./auto-wassen.js";
import * as krabbenNl from "./krabben.js";
import * as gladheidNl from "./gladheid.js";
import * as wandelenNl from "./wandelen.js";
import * as buitenSportenNl from "./buiten-sporten.js";
import * as padelOfTennisNl from "./padel-of-tennis.js";
import * as suppenOfKajakkenNl from "./suppen-of-kajakken.js";
import * as picknickweerNl from "./picknickweer.js";
import * as buitenZwemmenNl from "./buiten-zwemmen.js";
import * as sterrenkijkenNl from "./sterrenkijken.js";
import * as grasmaaienNl from "./grasmaaien.js";
import * as ramenWassenNl from "./ramen-wassen.js";
import * as zonnepanelenNl from "./zonnepanelen.js";
import * as barbecueweer from "./barbecueweer.js";
import * as zonkracht from "./zonkracht.js";
import * as hooikoorts from "./hooikoorts.js";
import * as korteBroek from "./korte-broek-weer.js";
import * as jasAan from "./jas-aan-of-uit.js";
import * as tShirt from "./t-shirt-weer.js";
import * as wanneerRegen from "./wanneer-gaat-het-regenen.js";
import * as parapluMee from "./paraplu-mee.js";

import * as bikeToWork from "./en/bike-to-work.js";
import * as dryLaundryOutside from "./en/dry-laundry-outside.js";
import * as whatToWear from "./en/what-to-wear.js";
import * as patioWeather from "./en/patio-weather.js";
import * as runningWeather from "./en/running-weather.js";
import * as beachWeather from "./en/beach-weather.js";
import * as washTheCar from "./en/wash-the-car.js";
import * as windscreenFrost from "./en/windscreen-frost.js";
import * as icyRoads from "./en/icy-roads.js";
import * as walkingEn from "./en/walking.js";
import * as outdoorWorkoutEn from "./en/outdoor-workout.js";
import * as padelOrTennisEn from "./en/padel-or-tennis.js";
import * as supOrKayakEn from "./en/sup-or-kayak.js";
import * as picnicWeatherEn from "./en/picnic-weather.js";
import * as outdoorSwimmingEn from "./en/outdoor-swimming.js";
import * as stargazingEn from "./en/stargazing.js";
import * as mowTheLawnEn from "./en/mow-the-lawn.js";
import * as cleanTheWindowsEn from "./en/clean-the-windows.js";
import * as solarPanelsEn from "./en/solar-panels.js";
import * as bbqWeather from "./en/bbq-weather.js";
import * as sunscreen from "./en/sunscreen.js";
import * as hayFever from "./en/hay-fever.js";
import * as shorts from "./en/shorts-weather.js";
import * as coat from "./en/coat-or-no-coat.js";
import * as tShirtEn from "./en/t-shirt-weather.js";
import * as whenRain from "./en/when-will-it-rain.js";
import * as umbrella from "./en/umbrella-today.js";

const PER_SLUG =
  LOCALE === "en"
    ? {
        "bike-to-work": bikeToWork,
        "dry-laundry-outside": dryLaundryOutside,
        "what-to-wear": whatToWear,
        "patio-weather": patioWeather,
        "running-weather": runningWeather,
        "beach-weather": beachWeather,
        "wash-the-car": washTheCar,
        "windscreen-frost": windscreenFrost,
        "icy-roads": icyRoads,
        "walking": walkingEn,
        "outdoor-workout": outdoorWorkoutEn,
        "padel-or-tennis": padelOrTennisEn,
        "sup-or-kayak": supOrKayakEn,
        "picnic-weather": picnicWeatherEn,
        "outdoor-swimming": outdoorSwimmingEn,
        "stargazing": stargazingEn,
        "mow-the-lawn": mowTheLawnEn,
        "clean-the-windows": cleanTheWindowsEn,
        "solar-panels": solarPanelsEn,
        "bbq-weather": bbqWeather,
        "sunscreen": sunscreen,
        "hay-fever": hayFever,
        "shorts-weather": shorts,
        "coat-or-no-coat": coat,
        "t-shirt-weather": tShirtEn,
        "when-will-it-rain": whenRain,
        "umbrella-today": umbrella,
      }
    : {
        "fietsen-naar-werk": fietsenNaarWerk,
        "was-buiten-drogen": wasBuitenDrogen,
        "wat-trek-ik-aan": watTrekIkAan,
        "terrasweer": terras,
        "hardloopweer": hardloopweerNl,
        "strandweer": strandweerNl,
        "auto-wassen": autoWassenNl,
        "krabben": krabbenNl,
        "gladheid": gladheidNl,
        "wandelen": wandelenNl,
        "buiten-sporten": buitenSportenNl,
        "padel-of-tennis": padelOfTennisNl,
        "suppen-of-kajakken": suppenOfKajakkenNl,
        "picknickweer": picknickweerNl,
        "buiten-zwemmen": buitenZwemmenNl,
        "sterrenkijken": sterrenkijkenNl,
        "grasmaaien": grasmaaienNl,
        "ramen-wassen": ramenWassenNl,
        "zonnepanelen": zonnepanelenNl,
        "barbecueweer": barbecueweer,
        "zonkracht": zonkracht,
        "hooikoorts": hooikoorts,
        "korte-broek-weer": korteBroek,
        "jas-aan-of-uit": jasAan,
        "t-shirt-weer": tShirt,
        "wanneer-gaat-het-regenen": wanneerRegen,
        "paraplu-mee": parapluMee,
      };

export function inhoudVoorTool(slug) {
  return PER_SLUG[slug] ?? null;
}
