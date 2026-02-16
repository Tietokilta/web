/**
 * Finnish localizations in nested structure for next-intl.
 */
const fi = {
  action: {
    Back: "Takaisin",
    Close: "Sulje",
    "Go to next page": "Siirry seuraavalle sivulle",
    "Go to previous page": "Siirry edelliselle sivulle",
    "More pages": "Lisää sivuja",
    Next: "Seuraava",
    Open: "Avaa",
    Previous: "Edellinen",
    "Read more": "Lue lisää",
    "Read more about {something}": "Lue lisää tapahtumasta {something}",
    "Sign up": "Ilmoittaudu",
    "Skip to main content": "Siirry pääsisältöön",
    "Toggle menu": "Avaa valikko",
  },
  error: {
    "Something went wrong": "Jotain meni pieleen",
    errorWithId:
      "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
    "Try again": "Yritä uudelleen",
  },
  errors: {
    "ilmomasiina-event-not-found": "Tapahtumaa ei löytynyt, tarkista osoite.",
    "ilmomasiina-fetch-fail":
      "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
    "ilmomasiina-ilmo-missing-quota-id":
      "Virheellinen pyyntö, yritä uudelleen.",
    "ilmomasiina-signup-not-found":
      "Ilmoittautumista ei löytynyt, tarkista osoite.",
    "ilmomasiina-unknown-error":
      "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
    "ilmomasiina-validation-failed": "Validointi epäonnistui. Tarkista lomake.",
    ilmo: {
      code: {
        BadSession: "Istunto on vanhentunut. Kirjaudu uudelleen.",
        EditConflict: "Muokkausristiriita. Yritä uudelleen.",
        WouldMoveSignupsToQueue: "Ilmoittautumisia siirrettäisiin jonoon.",
        WrongOldPassword: "Väärä vanha salasana.",
        SignupsClosed: "Ilmoittautuminen on suljettu.",
        NoSuchQuota: "Kiintiötä ei löytynyt.",
        NoSuchSignup: "Ilmoittautumista ei löytynyt.",
        BadEditToken: "Virheellinen muokkaustunniste.",
        CannotDeleteSelf: "Et voi poistaa itseäsi.",
        InitialSetupNeeded: "Alustava asetus tarvitaan.",
        InitialSetupAlreadyDone: "Alustava asetus on jo tehty.",
        SignupValidationError: "Ilmoittautumisen validointi epäonnistui.",
        EventValidationError: "Tapahtuman validointi epäonnistui.",
        FST_ERR_VALIDATION: "Validointi epäonnistui.",
      },
      fieldError: {
        missing: "Tämä kenttä on pakollinen.",
        wrongType: "Virheellinen tyyppi.",
        tooLong: "Liian pitkä arvo.",
        invalidEmail: "Virheellinen sähköpostiosoite.",
        notANumber: "Arvon tulee olla numero.",
        notAnOption: "Virheellinen valinta.",
      },
    },
  },
  generic: {
    Page: "Sivu",
    Version: "Versio",
  },
  heading: {
    "Main navigation": "Päävalikko",
    "Upcoming events": "Tulevat tapahtumat",
  },
  infoscreen: {
    Menus: "Ruokalistat",
    allergens:
      "A+ = Sisältää Allergeenejä | L = Laktoositon | VL = Vähälaktoosinen | G = Gluteeniton | M = Maidoton | O+ = Sisältää valkosipulia | VV = Vegaaninen",
    Buses: "Bussit",
    "Raide-Jokeri": "Raide-Jokeri",
    Metro: "Metro",
    "Aalto-university": "Aalto-yliopisto",
  },
  invoicegenerator: {
    "Invoicer name": "Laskuttajan nimi",
    "Invoicer email": "Laskuttajan sähköpostiosoite",
    "Phone number": "Puhelinnumero",
    Subject: "Aihe",
    Description: "Perustelut",
    "Bank account number": "Pankkitilin numero (IBAN)",
    Date: "Päiväys",
    Submit: "Lähetä",
    "Street name": "Katuosoite",
    City: "Kaupunki",
    "Postal code": "Postinumero",
    Product: "Tuote",
    Quantity: "Määrä",
    Unit: "Yksikkö",
    "Unit price": "Yksikköhinta",
    "Total price": "Yhteensä",
    Attachment: "Liite",
    Attachments: "Liitteet",
    Items: "Erittely",
    "Receipt/Product": "Kuitti/Tuote",
    "Sent invoice": "Lasku lähetetty",
    Remove: "Poista",
    Add: "Lisää",
    Address: "Osoite",
    Confirmation:
      "Vakuutan antamani tiedot oikeiksi ja olen tarkistanut, että kuvat kuiteista ovat selkeitä.",
    "Invoicer information": "Laskuttajan tiedot",
  },
  ilmomasiina: {
    form: {
      "You are in queue at position {position}":
        "Olet jonossa sijalla {position}.",
      "You are in the open quota at position {position}/{quotaSize}":
        "Olet avoimessa kiintiössä sijalla {position}/{quotaSize}.",
      "You are in the quota {quotaName} at position {position}":
        "Olet kiintiössä {quotaName} sijalla {position}.",
      "You are in the quota {quotaName} at position {position}/{quotaSize}":
        "Olet kiintiössä {quotaName} sijalla {position}/{quotaSize}.",
      fieldError: {
        missing: "Tämä kenttä on pakollinen.",
        wrongType: "Kentän vastaus on väärää tyyppiä. Kokeile päivittää sivu.",
        tooLong: "Kentän vastaus on liian pitkä.",
        invalidEmail:
          "Sähköpostiosoite on virheellinen. Syötä sallittu sähköpostiosoite.",
        notANumber: "Kentän vastauksen tulee olla numero.",
        notAnOption:
          "Kentän vastaus ei ole sallituissa vaihtoehdoissa. Kokeile päivittää sivu.",
      },
      optional: "valinnainen",
      "Shown in the public list of sign ups":
        "Näytetään julkisessa osallistujalistassa",
      "Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}":
        "Huomio: Ilmoittautuminen suoraan sivuilla on beta-vaiheessa, jos kohtaat ongelmia voit ilmoittautua tapahtuman sivulla ilmomasiinassa: {eventUrl}",
      "First name": "Etunimi",
      "Last name": "Sukunimi",
      Email: "Sähköposti",
      "Show name in the public list of sign ups":
        "Näytä nimi julkisessa osallistujalistassa",
      Submit: "Tallenna",
      Update: "Päivitä",
      "Edit sign up": "Muokkaa ilmoittautumista",
      "Delete sign up": "Poista ilmoittautuminen",
      "Sign up saved": "Ilmoittautuminen tallennettu!",
      "You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message":
        "Voit muokata ilmoittautumistasi tai poistaa sen myöhemmin tästä osoitteesta, joka lähetetään sähköpostiisi vahvistusviestissä.",
      "Your signup cannot be changed anymore as the signup for the event has closed":
        "Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman ilmoittautuminen on sulkeutunut.",
      deleteConfirmation:
        "Oletka varma, että haluat poistaa ilmoittautumisesi tapahtumaan {eventTitle}? Jos poistat ilmoittautumisesi, menetät paikkasi jonossa.",
      actionCannotBeUndone: "Tätä toimintoa ei voi perua.",
      Cancel: "Peruuta",
    },
    headers: {
      Starts: "Alkaa",
      "Sign up time": "Ilmoittautumisaika",
      Category: "Kategoria",
      Quota: "Kiintiö",
      Ends: "Loppuu",
      Name: "Nimi",
      Location: "Paikka",
      Price: "Hinta",
      Position: "Sija",
    },
    "Sign up": "Ilmoittautuminen",
    Signups: "Ilmoittautuneet",
    "Signed up count": "Ilmoittautuneita",
    "No signup": "Ei ilmoittautumista",
    Hidden: "Piilotettu",
    Unconfirmed: "Vahvistamaton",
    "Open quota": "Avoin kiintiö",
    "In queue": "Jonossa",
    Queue: "Jonossa",
    Category: "Kategoria",
    Location: "Paikka",
    Starts: "Alkaa",
    Ends: "Loppuu",
    Price: "Hinta",
    Signup: "Ilmoittautuminen",
    Back: "Takaisin",
    path: {
      events: "tapahtumat",
      "all-events": "kaikki-tapahtumat",
    },
    "all-events": {
      "All events": "Kaikki tapahtumat",
    },
    "Event does not have signups": "Tapahtumaan ei voi ilmoittautua",
    "Signups have ended": "Ilmoittautuminen on päättynyt",
    "Signups open until {endDate}": "Ilmoittautuminen auki {endDate} asti",
    "Signups open on {startDate}": "Ilmoittautuminen alkaa {startDate}",
    "Signup information is not public":
      "Ilmoittautumistiedot eivät ole julkisia.",
    "No signups yet": "Ei ilmoittautuneita vielä.",
    Position: "Sija",
    Name: "Nimi",
    Quota: "Kiintiö",
    "Signup time": "Ilmoittautumisaika",
    "In queue: {queueCount} ({confirmedCount} confirmed)":
      "Jonossa {queueCount} ({confirmedCount} vahvistettu)",
    status: {
      "No signups yet": "Ei ilmoittautuneita vielä.",
      "Sign up starts on {startDate}": "Ilmoittautuminen alkaa {startDate}",
      "Sign up starts {startDate}": "Ilmo alkaa {startDate}",
      "Open for sign ups until {endDate}":
        "Ilmoittautuminen auki {endDate} asti",
      "Sign up until {endDate}": "Ilmo auki {endDate} asti",
      "Sign up has ended": "Ilmoittautuminen on päättynyt",
      "Sign ups are not public": "Ilmoittautumistiedot eivät ole julkisia.",
      "{queueCount} in the queue ({confirmedCount} confirmed)":
        "Jonossa {queueCount} ({confirmedCount} vahvistettu)",
      "This event does not have sign ups": "Tapahtumaan ei voi ilmoittautua",
    },
    Events: "Tapahtumat",
    "Subscribe to calendar": "Tilaa kalenteri",
    "Copying to clipboard": "Kopioidaan leikepöydälle",
    "Copied to clipboard": "Kopioitu leikepöydälle",
    "Browse old events": "Selaa vanhoja tapahtumia",
  },
  "not-found": {
    "To front page": "Etusivulle",
    "To event list": "Tapahtumalistaukseen",
    "Page not found": "Sivua ei löytynyt",
    "Event not found": "Tapahtumaa ei löytynyt",
    "Sign up not found": "Ilmoit­tau­tumista ei löytynyt",
    pageNotFoundDescription:
      "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.",
    eventNotFoundDescription:
      "Tapahtumaa ei löytynyt. Tarkista osoite tai palaa tapahtumalistaukseen.",
    signupNotFoundDescription:
      "Ilmoittautumista ei löytynyt tai muokkaustunniste oli väärin. Tarkista osoite tai palaa tapahtumalistaukseen.",
  },
  weeklyNewsletter: {
    "AYY & Aalto": "AYY & Aalto",
    "Bottom Corner": "Pohjanurkkaus",
    Calendar: "Kalenteri",
    Guild: "Kilta",
    "Next week": "Ensi viikolla",
    "old weekly newsletters": "vanhoja viikkotiedotteita",
    Other: "Muu",
    Read: "Lue",
    "This week": "Tällä viikolla",
    "Sign ups open this week": "Tällä viikolla avoinna olevat ilmoittautumiset",
    title: "Viikkotiedotteet",
    path: "viikkotiedotteet",
    "To sign up": "Ilmoittautumiseen",
    "for event": "tapahtumalle",
  },
  calendar: {
    Week: "Viikko",
    "Work Week": "Työviikko",
    Day: "Päivä",
    Month: "Kuukausi",
    Today: "Tänään",
    Previous: "Edellinen",
    Next: "Seuraava",
  },
  metadata: {
    title: "Tietokilta",
    template: "%s - Tietokilta",
    description: "Tietokilta ry:n kotisivut",
  },
} as const;

export default fi;
