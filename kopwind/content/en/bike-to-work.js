/** content/en/bike-to-work.js: bike check copy for the English site. */

export const seo = {
  title: "Bike to work today? Wind and cycling weather for your ride",
  description:
    "Can I bike to work today? Check your ride: headwind per part of the route, rain, feels-like temperature and a clear verdict. Free, no account.",
  h1: "Bike to work today?",
  intro:
    "The Netherlands runs on bikes, and the wind runs the show. This check looks at your actual route: where the headwind hits, whether you'll get rained on, and when to leave. One clear answer instead of a weather map.",
};

export const blokken = [
  {
    kop: "Your route, not your region",
    tekst:
      "A forecast for the whole city says little about your ride. The check splits your route into segments and works out the wind angle per part: full headwind on the dike, sheltered in town. You see the tough stretch before you're in it.",
  },
  {
    kop: "Both legs count",
    tekst:
      "A tailwind out means a headwind back. The check scores the ride out and the ride home separately and lets the toughest one set the day's verdict, so you're never surprised at five o'clock.",
  },
  {
    kop: "Leave at the right moment",
    tekst:
      "Half an hour earlier or later can mean the difference between dry and drenched. Save your commute once and the check tells you the best departure time, with a reminder on the days you choose.",
  },
];

export const faq = [
  {
    v: "When is it a good day to bike to work?",
    a: "Dry, a feels-like above your own limit and no strong headwind on your specific route. The check answers in plain words, from Give it a miss to Ideal bike day, and names the reasons: headwind halfway, showers around eight, that kind of thing.",
  },
  {
    v: "How does the check know my headwind?",
    a: "It fetches the hourly wind forecast (speed, gusts and direction) and compares the wind angle with the direction of each segment of your route. Riding into it counts fully; a crosswind counts partly; a tailwind counts in your favour.",
  },
  {
    v: "Can I add a stopover, like the gym or school?",
    a: "Yes. Add up to a few stops and the check plans the chain: each leg gets its own verdict and departure time, and the toughest leg decides whether the bike comes out at all.",
  },
  {
    v: "Does this work anywhere in the Netherlands?",
    a: "Yes. Search any address as a start or stop. The 35 largest cities also have their own page with the live answer for today.",
  },
];
