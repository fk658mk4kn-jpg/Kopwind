/** content/en/bike-to-work.js: bike check copy for the English site. */

export const seo = {
  title: "Bike to work today: can I and will it be good cycling weather?",
  description:
    "Can I bike to work today? Check your ride: headwind per part of the route, rain, feels-like temperature and a clear verdict. Free, no account.",
  h1: "Bike to work today?",
  intro:
    "The Netherlands runs on bikes, and the wind runs the show. This check looks at your actual route: where the headwind hits, whether you'll get rained on, and when to leave. A concrete answer instead of a weather map.",
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
    a: "Dry, a feels-like above your own limit and no strong headwind on your specific route. The check answers in plain words, from Give it a miss to Ideal bike day, and names the reasons: headwind halfway, showers around eight, that kind of thing. In winter the road surface joins in: in frost, glance at [the icy roads check](tool:gladheid). And if you train on the road bike rather than commute, [the road ride check](tool:wielrennen) finds the best window of the day.",
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
  {
    v: "Cycling in wind force 5: is that doable?",
    a: "Cycling in wind force 5 (around 30 to 38 km/h) is doable but hard work: a headwind easily costs you a third of your speed and crosswind pushes you off line, especially on open stretches and bridges. The bike check runs the wind per riding direction, so you see whether the ride out or the ride home is the tough one.",
  },
  {
    v: "Cycling in the rain: better to leave earlier or later?",
    a: "Cycling in the rain can often be dodged by shifting smartly: most showers last under half an hour. The check compares your departure time with the shower timing, so you see whether leaving ten minutes earlier or later keeps you dry. In long rain spells the choice is simpler: rain gear on or another mode.",
  },
];
