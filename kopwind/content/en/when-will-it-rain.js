/** content/en/when-will-it-rain.js */

export const seo = {
  title: "When will it rain today?",
  description:
    "See when the rain starts, when it turns dry again and whether showers fall within an hour at your location. Accurate to the minute.",
  h1: "When will it rain today?",
  intro:
    "Not just whether it rains matters, but mainly when. This check shows when the next shower falls, when it turns dry again and which hours are safest. For the Netherlands we use 15-minute rain data, so you really see whether you'll make that errand dry.",
};

export const blokken = [
  { kop: "Timing beats the rain chance", tekst: "A day with a 40 percent chance sounds like a gamble, but if that rain falls in one hour-long block, the rest of the day is simply dry. This check looks at the run per quarter hour: when it starts, how long it lasts, and when it clears." },
  { kop: "Plan your departure", tekst: "The question behind the question is usually: can I leave now, or better wait? With the next rain moment and the next dry window you see at a glance whether you'll bridge that twenty-minute errand dry." },
  { kop: "How reliable is this?", tekst: "The 15-minute rain comes, for the Netherlands, from the high-resolution German and French models (ICON-D2 and AROME). A real nowcast, not raw interpolation. For the coming hour it's strikingly accurate; further ahead rain stays fickle." },
];

export const faq = [
  { v: "Will it rain within an hour?", a: "The check puts this at the top as a direct yes or no, based on the rain per quarter hour for the coming hour at your location." },
  { v: "What time does the rain start?", a: "You see the next rain moment as a time. If it's already raining, the check shows when it's expected to turn dry again." },
  { v: "When will it turn dry again?", a: "If it's raining, the check finds the next block of at least an hour dry and shows that as a start time." },
  { v: "Are these scattered showers or prolonged rain?", a: "The summary per part of the day shows whether it's scattered showers or continuous rain." },
  {
    v: "Rain tonight: does it stay dry until morning?",
    a: "Rain during the night checks just as well as daytime here: the timeline runs through the night and shows whether and when anything falls. Handy for laundry left outside, an open window or the question whether the grass is dry early tomorrow.",
  },
  {
    v: "Rain chance per hour: how do I read it?",
    a: "Rain chance per hour is the probability of measurable precipitation in that hour at your spot, not a measure of the amount. Two consecutive hours at 40 percent do not add up to 80; they remain separate chances. This check combines the chance with the expected amount, which is why it can say concretely when the shower falls and when it turns dry again.",
  },
];
