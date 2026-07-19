/**
 * content/en/road-cycling-weather.js
 * SEO content for the road cycling check (v3.25.0 "Pampero").
 */

export const seo = {
  title: "Road cycling weather today: is it and will it be good riding weather?",
  description:
    "Is it road cycling weather today? See the best dry window with manageable wind for a road ride, with a start time and the reason. Free.",
  intro:
    "The road ride check finds the best window for a ride on the road bike: dry tarmac first, then wind, and only then temperature. Per day you see whether it's riding weather, when to set off and why.",
};

export const blokken = [
  {
    kop: "Wet tarmac is the real spoiler",
    tekst:
      "On thin tyres, wet asphalt is the biggest risk factor: longer braking distances, less grip in corners and slippery manhole covers. The check therefore zeroes any hour with real rainfall and counts drizzle heavily. Just stopped raining doesn't mean a dry road; allow an hour or two of drying with wind and sun.",
  },
  {
    kop: "Wind is the main enemy",
    tekst:
      "Where a walker mostly feels wind as fresh, wind on a road bike costs watts and joy directly: you ride fast enough to make your own. The check punishes wind harder than the other outdoor checks, and gusts above 45 km/h count separately for twitchy handling. Riding your commute and want the wind per direction? That's what [the bike check](tool:fiets-naar-werk) does.",
  },
  {
    kop: "Cold is fine with the right kit",
    tekst:
      "With a proper winter jacket, overshoes and gloves, five degrees rides beautifully; cold is mostly about clothing and about hands and face. Only around freezing does the check flip, because icy patches come into play and kit stops keeping up. Set your own cold limit if you bail earlier or later.",
  },
  {
    kop: "Pick your start time wisely",
    tekst:
      "Wind often builds through the day with thermals and settles towards the evening; showers cluster in the afternoon in many weather types. That's why the check centres the best riding window instead of a daily average: a mediocre day often still has a fine morning or evening block.",
  },
];

export const faq = [
  {
    v: "How is this different from the bike check?",
    a: "Intent. [Bike to work](tool:fiets-naar-werk) is an obligation: you want to know how hard it gets, per riding direction, on your own route. Road cycling is a choice: you're looking for the best window of the day to train, and you can route your loop around the wind. That's why this is a location check with a riding window, not a route planner.",
  },
  {
    v: "From what wind speed does road cycling stop being fun?",
    a: "It differs per rider, so the limit is adjustable. As a rule of thumb: up to 20 km/h you barely notice, around 30 it becomes work, and above 38 it's a slog for most, certainly solo. Gusts weigh extra: they make handling twitchy on open stretches and around passing traffic.",
  },
  {
    v: "It just stopped raining. Can I head out?",
    a: "Better wait a little. Wet asphalt stays slippery for one to two hours after a shower, longer in the shade and in still air. That's why the check doesn't just look at this moment's rainfall but also at the hours before it when picking the best window.",
  },
  {
    v: "Can I ride in winter?",
    a: "Often yes: dry frost with little wind rides fine in winter kit, and the check will show that if your cold limit allows it. Do watch for frozen patches on bridges and in the shade; [the icy roads check](tool:gladheid) looks at that per morning.",
  },
  {
    v: "Does riding direction count in the verdict?",
    a: "No, deliberately not. A training ride is a loop: what you fight on the way out pushes you home, and you can plan your route around the wind. The verdict is about the weather at your start point and the best window. Want wind per direction on a fixed route, use [the bike check](tool:fiets-naar-werk).",
  },
];
