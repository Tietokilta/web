export default {
  action: {
    Open: "Open",
    Close: "Close",
    "Toggle menu": "Toggle menu",
    "Sign up": "Sign up",
    "Read more": "Read more",
    Back: "Back",
    Previous: "Previous",
    Next: "Next",
    "Go to previous page": "Go to previous page",
    "Go to next page": "Go to next page",
    "More pages": "More pages",
    "Skip to main content": "Skip to main content",
  },
  heading: {
    "Upcoming events": "Upcoming events",
  },
  errors: {
    "ilmomasiina-fetch-fail":
      "Failed to fetch events from Ilmomasiina. Please try again later.",
    "ilmomasiina-event-not-found": "Event not found. Please check the URL.",
    "ilmomasiina-ilmo-missing-quota-id": "Invalid request. Please try again.",
    "ilmomasiina-unknown-error":
      "An unknown error occurred. Please try again later.",
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
  "not-found": {
    "Sivua ei löytynyt": "Page not found",
    "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.":
      "Page not found. Check the URL or return to the front page.",
    Etusivulle: "To front page",
  },
  error: {
    "Jotain meni pieleen": "Something went wrong",
    "Hups, jotain meni pieleen.": "Oops, something went wrong.",
    "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
      "Oops, something went wrong. Contact the site administrator. The error ID is",
    "Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
      "Oops, something went terribly wrong. Contact the site administrator. The error ID is",
    "Yritä uudelleen": "Try again",
  },
  weeklyNewsletter: {
    title: "Weekly newsletters",
    calendar: "Calendar",
    guild: "Guild",
    "ayy-aalto": "AYY & Aalto",
    other: "Other",
    "bottom-corner": "Bottom Corner",
    "this-week": "This week",
    "next-week": "Next week",
    "this-week-signups": "Sign ups open this week",
    read: "Read",
    "old-link": "old weekly newsletters",
    "super-old-link": "very old weekly newsletters",
  },
} as const;
