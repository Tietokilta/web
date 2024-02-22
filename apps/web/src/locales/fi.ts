export default {
  action: {
    Open: "Avaa",
    Close: "Sulje",
    "Toggle menu": "Avaa valikko",
    "Sign up": "Ilmoittaudu",
    "Read more": "Lue lisää",
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
} as const;
