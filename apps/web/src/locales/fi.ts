export default {
  action: {
    Open: "Avaa",
    Close: "Sulje",
    "Toggle menu": "Avaa valikko",
    "Sign up": "Ilmoittaudu",
    "Read more": "Lue lisää",
    Back: "Takaisin",
    "Try again": "Yritä uudelleen",
    "To the front page": "Etusivulle",
  },
  headings: {
    "Upcoming events": "Tulevat tapahtumat",
    "404": "404 - Sivua ei löytynyt",
    "general-error": "Jotain meni pieleen",
  },
  errors: {
    "ilmomasiina-fetch-fail":
      "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
    "ilmomasiina-event-not-found": "Tapahtumaa ei löytynyt, tarkista osoite.",
    "ilmomasiina-ilmo-missing-quota-id":
      "Virheellinen pyyntö, yritä uudelleen.",
    "ilmomasiina-unknown-error":
      "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
    "general-error":
      "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään.",
    "error-code": "Virheen tunniste on",
    "page-not-found":
      "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.",
  },
  ilmomasiina: {
    Tapahtumat: "Tapahtumat",
    Ilmoittautuneita: "Ilmoittautuneita",
    Ilmoittautuneet: "Ilmoittautuneet",
    Ilmoittautuminen: "Ilmoittautuminen",
    status: {
      "Ilmoittautuminen auki": "Ilmoittautuminen auki {endDate} asti",
      "Ilmoittautuminen on päättynyt": "Ilmoittautuminen on päättynyt",
      "Ilmoittautuminen alkaa": "Ilmoittautuminen alkaa {startDate}",
      "Tapahtumaan ei voi ilmoittautua": "Tapahtumaan ei voi ilmoittautua",
      "Ei ilmoittautuneita vielä": "Ei ilmoittautuneita vielä.",
      Jonossa: "Jonossa {queueCount}",
    },
    headers: {
      Sija: "Sija",
      Nimi: "Nimi",
      Kiintiö: "Kiintiö",
      Ilmoittautumisaika: "Ilmoittautumisaika",
      Kategoria: "Kategoria",
      Paikka: "Paikka",
      Alkaa: "Alkaa",
      Loppuu: "Loppuu",
    },
  },
} as const;
