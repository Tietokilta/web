export default {
  action: {
    Open: "Avaa",
    Close: "Sulje",
    "Toggle menu": "Avaa valikko",
    "Sign up": "Ilmoittaudu",
    "Read more": "Lue lisää",
    Back: "Takaisin",
  },
  headings: {
    "Upcoming events": "Tulevat tapahtumat",
  },
  errors: {
    "ilmomasiina-fetch-fail":
      "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
    "ilmomasiina-event-not-found": "Tapahtumaa ei löytynyt, tarkista osoite.",
    "ilmomasiina-ilmo-missing-quota-id":
      "Virheellinen pyyntö, yritä uudelleen.",
    "ilmomasiina-unknown-error":
      "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
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
