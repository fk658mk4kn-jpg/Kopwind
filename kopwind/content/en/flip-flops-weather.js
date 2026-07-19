/**
 * content/en/flip-flops-weather.js
 * Question page on the clothing check (v3.25.0 "Pampero"): its own
 * answer to the flip-flop question, the full parent check below.
 */

export const seo = {
  title: "Is it flip-flop weather today? Instant yes or no",
  description:
    "Is it flip-flop weather today? An instant answer on feels-like temperature and rain: yes, no or a borderline call with the reason. Free, no account.",
  intro:
    "Flip-flops ask a little more of the weather than shorts do: warm feet want proper summer degrees, and wet soles are slippery. This check gives an instant yes or no, with the full clothing advice below.",
};

export const blokken = [
  {
    kop: "When is it flip-flop weather?",
    tekst:
      "From a feels-like of roughly 21 degrees, flip-flops are comfortable all day; between 16 and 21 the afternoon works fine, but mornings and evenings are fresh on bare feet. The check looks at the day's swing, not just the peak, because feet notice the difference between 10:00 and 15:00 like nothing else.",
  },
  {
    kop: "Rain and flip-flops don't mix",
    tekst:
      "Rubber on wet tiles is slippery, and wet feet stay wet. With showers during your time outside, the check turns the answer to borderline or no, even when it's warm enough. Useful alongside: [when will it rain](tool:regen-timing) shows the shower timing to the minute.",
  },
];

export const faq = [
  {
    v: "From what temperature can I wear flip-flops?",
    a: "As a rule of thumb: from 21 degrees feels-like all day, from around 17 only in the afternoon window. That's deliberately a touch stricter than [shorts weather](tool:korte-broek): bare feet cool faster than bare legs, especially in wind.",
  },
  {
    v: "Why does the check say no when it's warm?",
    a: "Almost always because of rain. Wet soles are slippery on tiles and in shops, and soaked flip-flops walk heavily. If the shower falls outside your moments outdoors, it doesn't count against you.",
  },
  {
    v: "Does this apply to sandals too?",
    a: "Largely yes: the temperature limit is similar. Sandals with a heel strap sit firmer and are less slippery in a light shower, so you can take the borderline call a bit more generously there.",
  },
];
