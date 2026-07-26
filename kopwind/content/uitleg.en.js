/**
 * content/uitleg.en.js
 *
 * The explainer cluster for the English site: the weather in plain words.
 * Short articles that explain why the checks say what they say.
 */

export const UITLEG = [
  {
    slug: "feels-like-temperature",
    vraag: "Why does it feel colder than the thermometer says?",
    titel: "Feels-like temperature: why 12 degrees can feel like 7",
    intro:
      "You don't pick your coat by the thermometer but by your skin. And your skin factors in wind and moisture. That difference is the feels-like temperature, and it's why our checks use it by default.",
    blokken: [
      {
        kop: "Wind steals warmth",
        tekst:
          "Your body warms a thin layer of air around you. Wind keeps blowing that layer away, so you lose heat faster and it feels colder. At 12 degrees and wind force 5 it can easily feel like 7. That's why the outfit check counts wind in full: you dress for what you feel, not for what a weather station measures two metres above a lawn.",
      },
      {
        kop: "Moisture matters too",
        tekst:
          "Damp air conducts heat away better than dry air, and sweat evaporates worse in it. A humid day of 8 degrees therefore bites harder than a dry one. The other way round, sun on your coat makes the feel milder than the thermometer promises.",
      },
      {
        kop: "What we do with it",
        tekst:
          "All checks on Good day for it? work with the hourly feels-like temperature from the forecast. The outfit check turns it into layers across the day, the patio check uses it to find the nicest hours and the bike check weighs the cold on your hands in the verdict.",
      },
    ],
    gerelateerdeToolSlug: "what-to-wear",
    cta: "turns this into concrete outfit advice every morning.",
  },
  {
    slug: "how-laundry-dries",
    vraag: "How does laundry actually dry?",
    titel: "How your wash dries: moisture, wind, warmth and a bit of sun",
    intro:
      "Line-drying is free and your clothes last longer. But one dry day is not like another: sometimes the wash is dry in two hours, sometimes it's still damp at eight in the evening. Here's why.",
    blokken: [
      {
        kop: "Dry air is the engine",
        tekst:
          "Water only evaporates if the air can absorb it. The lower the humidity, the faster it goes. A fresh day with dry air beats a muggy summer day of 24 degrees. That's why the laundry check looks at humidity per hour first.",
      },
      {
        kop: "Wind and warmth help, sun is the bonus",
        tekst:
          "Wind keeps replacing the moist air around your wash with dry air. Warmth speeds up evaporation, and sun on the line adds a little extra. Warm, breezy, dry and sunny is the jackpot: an average load dries in about two hours.",
      },
      {
        kop: "The answer and the clock are two things",
        tekst:
          "Great drying weather at six in the evening no longer helps. The check therefore separates the conditions score from the status line: how good the day is, and whether you can still make it if you hang the wash out right now, with the estimated finish time.",
      },
    ],
    gerelateerdeToolSlug: "dry-laundry-outside",
    cta: "tells you every day whether the wash goes outside, and until what time.",
  },
  {
    slug: "wind-and-cycling",
    vraag: "Why does wind decide your bike ride?",
    titel: "Wind and cycling: why the direction matters more than the speed",
    intro:
      "Rain is annoying, but wind is what makes or breaks a Dutch bike commute. And not the wind speed in the forecast: the angle between the wind and your route.",
    blokken: [
      {
        kop: "Headwind is a hill that never ends",
        tekst:
          "Cycling into a strong wind can double your effort, like riding uphill for the entire stretch. A crosswind costs some energy and steering; a tailwind gives it back. The same wind can be a gift on the way out and a wall on the way home.",
      },
      {
        kop: "Your route decides the angle",
        tekst:
          "A southwesterly wind is a tailwind on a northeast-bound ride and a headwind on the way back. That's why the bike check splits your route into segments and computes the wind angle per part: it can tell you the tough bit is only the two kilometres along the canal.",
      },
      {
        kop: "Gusts are the real spoiler",
        tekst:
          "A steady wind you can lean into; gusts shove you around. The check reads gust speeds separately and weighs them heavier, because a gusty 25 km/h is harder work than a steady 30.",
      },
    ],
    gerelateerdeToolSlug: "bike-to-work",
    cta: "checks the wind against your own route, both ways.",
  },
  {
    slug: "rain-chance",
    vraag: "What does 60% chance of rain actually mean?",
    titel: "Rain chance: what the percentage does and doesn't say",
    intro:
      "A 60% chance of rain doesn't mean it rains 60% of the time, nor that 60% of your town gets wet. It means: in this situation, this hour turns out wet in about 6 of 10 cases. Useful, once you know how to read it.",
    blokken: [
      {
        kop: "Chance per hour, not per day",
        tekst:
          "A day with 80% rain chance can still hold a bone-dry evening. Forecasts give a probability per hour, and those differ wildly across the day. Our checks therefore never judge a whole day on one number: they hunt for the dry blocks.",
      },
      {
        kop: "Chance and amount are different things",
        tekst:
          "A 90% chance of drizzle is a different day than a 40% chance of a cloudburst. That's why the checks read both the probability and the expected millimetres per hour, and let you set your own risk appetite.",
      },
      {
        kop: "How the checks use it",
        tekst:
          "The patio and BBQ checks skip hours with a high shower risk when picking your best block. The laundry check is stricter: one wet hour can undo three hours of drying, so it only counts dry windows long enough to finish the job.",
      },
    ],
    gerelateerdeToolSlug: "patio-weather",
    cta: "uses this to name the hours that stay dry.",
  },
];

export function vindArtikel(slug) {
  return UITLEG.find((a) => a.slug === slug) ?? null;
}
