
/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("event").del();

  await knex("event").insert([
    {
      id: 1,
      price: 100,
      currency: "DKK",
      title: "Copenhagen Coffee Crawl",
      description:
        "A relaxed Saturday walk between 4 specialty cafés. Includes tasting notes, small pastry, and a guide to brewing styles.",
      date: "2026-05-10",
      time: "10:00:00",
      venue: "Copenhagen City Center",
      ticket_capacity: 25,
    },
    {
      id: 2,
      price: 150,
      currency: "DKK",
      title: "After-Work Board Games Night",
      description:
        "Drop in with friends or come solo. We’ll teach quick games, set you up at a table, and keep the vibe cozy and social.",
      date: "2026-05-12",
      time: "18:00:00",
      venue: "Aarhus Game Lounge",
      ticket_capacity: 40,
    },
    {
      id: 3,
      price: 250,
      currency: "DKK",
      title: "Beginner Pasta Workshop",
      description:
        "Hands-on workshop: mix dough, roll sheets, shape pasta, and finish with a simple sauce.",
      date: "2026-05-15",
      time: "17:00:00",
      venue: "Copenhagen Food Studio",
      ticket_capacity: 15,
    },
    {
      id: 4,
      price: 0,
      currency: "DKK",
      title: "Sunday Park Run & Stretch",
      description:
        "Easy-paced community run (5K-ish) followed by guided stretching. All levels welcome.",
      date: "2026-05-18",
      time: "09:00:00",
      venue: "Frederiksberg Park",
      ticket_capacity: 100,
    },
    {
      id: 5,
      price: 75,
      currency: "DKK",
      title: "Indie Film Screening: Short Nights",
      description: "A curated set of local short films with a short Q&A after.",
      date: "2026-05-20",
      time: "20:00:00",
      venue: "Nordic Film Theater",
      ticket_capacity: 60,
    },
    {
      id: 6,
      price: 180,
      currency: "DKK",
      title: "Photography Walk: City Lights",
      description:
        "Evening photo walk focused on street scenes and reflections.",
      date: "2026-05-22",
      time: "19:30:00",
      venue: "Nyhavn, Copenhagen",
      ticket_capacity: 20,
    },
    {
      id: 7,
      price: 120,
      currency: "DKK",
      title: "Bread & Butter Tasting",
      description:
        "Taste 6 breads and 5 butters (classic + flavored). Learn fermentation basics.",
      date: "2026-05-25",
      time: "14:00:00",
      venue: "Bakehouse Lab",
      ticket_capacity: 30,
    },
    {
      id: 8,
      price: 300,
      currency: "DKK",
      title: "Live Jazz Trio at the Loft",
      description:
        "An intimate jazz session with modern standards and originals.",
      date: "2026-05-28",
      time: "19:00:00",
      venue: "The Loft, Copenhagen",
      ticket_capacity: 45,
    },
  ]);
}
