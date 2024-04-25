export default {
  action: {
    Open: "Open",
    Close: "Close",
    "Toggle menu": "Toggle menu",
    "Sign up": "Sign up",
    "Read more": "Read more",
    Back: "Back",
    "Try again": "Try again",
    "To the front page": "To the front page",
  },
  headings: {
    "Upcoming events": "Upcoming events",
    "404": "404 - Page not found",
    "general-error": "Something went wrong",
  },
  errors: {
    "ilmomasiina-fetch-fail":
      "Failed to fetch events from Ilmomasiina. Please try again later.",
    "ilmomasiina-event-not-found": "Event not found. Please check the URL.",
    "ilmomasiina-ilmo-missing-quota-id": "Invalid request. Please try again.",
    "ilmomasiina-unknown-error":
      "An unknown error occurred. Please try again later.",
    "general-error":
      "Oops, something went wrong. Contact the site administrator.",
    "error-code": "The error code is",
    "page-not-found":
      "The page was not found. Check the URL or return to the front page.",
  },
  ilmomasiina: {
    Tapahtumat: "Events",
    Ilmoittautuneita: "Signed up",
    Ilmoittautuneet: "Signed up",
    Ilmoittautuminen: "Sign up",
    status: {
      "Ilmoittautuminen auki": "Open for sign ups until {endDate}",
      "Ilmoittautuminen on päättynyt": "Sign ups have ended",
      "Ilmoittautuminen alkaa": "Sign ups start on {startDate}",
      "Tapahtumaan ei voi ilmoittautua": "Event does not have sign ups",
      "Ei ilmoittautuneita vielä": "No sign ups yet.",
      Jonossa: "{queueCount} in queue",
    },
    headers: {
      Sija: "Place",
      Nimi: "Name",
      Kiintiö: "Quota",
      Ilmoittautumisaika: "Sign up time",
      Kategoria: "Category",
      Paikka: "Location",
      Alkaa: "Starts",
      Loppuu: "Ends",
    },
  },
} as const;
