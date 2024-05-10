export default {
  action: {
    Open: "Avaa",
    Close: "Sulje",
    "Toggle menu": "Avaa valikko",
    "Sign up": "Ilmoittaudu",
    "Read more": "Lue lisää",
    Back: "Takaisin",
    Previous: "Edellinen",
    Next: "Seuraava",
    "Go to previous page": "Siirry edelliselle sivulle",
    "Go to next page": "Siirry seuraavalle sivulle",
    "More pages": "Lisää sivuja",
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
  "not-found": {
    "Sivua ei löytynyt": "Sivua ei löytynyt",
    "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.":
      "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.",
    Etusivulle: "Etusivulle",
  },

  error: {
    "Jotain meni pieleen": "Jotain meni pieleen",
    "Hups, jotain meni pieleen.": "Hups, jotain meni pieleen.",
    "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
      "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
    "Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
      "Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
    "Yritä uudelleen": "Yritä uudelleen",
  },
} as const;
