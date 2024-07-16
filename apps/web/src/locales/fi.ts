import { assertType } from "../lib/utils";
import type en from "./en";

/**
 * Finnish localizations, supports one level of nesting.
 */
const fi = {
  "action.Back": "Takaisin",
  "action.Close": "Sulje",
  "action.Go to next page": "Siirry seuraavalle sivulle",
  "action.Go to previous page": "Siirry edelliselle sivulle",
  "action.More pages": "Lisää sivuja",
  "action.Next": "Seuraava",
  "action.Open": "Avaa",
  "action.Previous": "Edellinen",
  "action.Read more": "Lue lisää",
  "action.Read more about {something}": "Lue lisää tapahtumasta {something}",
  "action.Sign up": "Ilmoittaudu",
  "action.Skip to main content": "Siirry pääsisältöön",
  "action.Toggle menu": "Avaa valikko",
  "error.Hups, jotain meni pieleen.": "Hups, jotain meni pieleen.",
  "error.Jotain meni pieleen": "Jotain meni pieleen",
  "error.Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
    "Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
  "error.Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
    "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
  "error.Yritä uudelleen": "Yritä uudelleen",
  "errors.ilmomasiina-event-not-found":
    "Tapahtumaa ei löytynyt, tarkista osoite.",
  "errors.ilmomasiina-fetch-fail":
    "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
  "errors.ilmomasiina-ilmo-missing-quota-id":
    "Virheellinen pyyntö, yritä uudelleen.",
  "errors.ilmomasiina-unknown-error":
    "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
  "generic.Page": "Sivu",
  "generic.Version": "Versio",
  "heading.Upcoming events": "Tulevat tapahtumat",
  "ilmomasiina.headers.Alkaa": "Alkaa",
  "ilmomasiina.headers.Ilmoittautumisaika": "Ilmoittautumisaika",
  "ilmomasiina.headers.Kategoria": "Kategoria",
  "ilmomasiina.headers.Kiintiö": "Kiintiö",
  "ilmomasiina.headers.Loppuu": "Loppuu",
  "ilmomasiina.headers.Nimi": "Nimi",
  "ilmomasiina.headers.Paikka": "Paikka",
  "ilmomasiina.headers.Sija": "Sija",
  "ilmomasiina.Ilmoittautuminen": "Ilmoittautuminen",
  "ilmomasiina.Ilmoittautuneet": "Ilmoittautuneet",
  "ilmomasiina.Ilmoittautuneita": "Ilmoittautuneita",
  "ilmomasiina.path.events": "tapahtumat",
  "ilmomasiina.status.Ei ilmoittautuneita vielä": "Ei ilmoittautuneita vielä.",
  "ilmomasiina.status.Ilmoittautuminen alkaa":
    "Ilmoittautuminen alkaa {startDate}",
  "ilmomasiina.status.Ilmoittautuminen auki":
    "Ilmoittautuminen auki {endDate} asti",
  "ilmomasiina.status.Ilmoittautuminen on päättynyt":
    "Ilmoittautuminen on päättynyt",
  "ilmomasiina.status.Ilmoittautumistiedot eivät ole julkisia":
    "Ilmoittautumistiedot eivät ole julkisia.",
  "ilmomasiina.status.Jonossa": "Jonossa {queueCount}",
  "ilmomasiina.status.Tapahtumaan ei voi ilmoittautua":
    "Tapahtumaan ei voi ilmoittautua",
  "ilmomasiina.Tapahtumat": "Tapahtumat",
  "not-found.Etusivulle": "Etusivulle",
  "not-found.Sivua ei löytynyt": "Sivua ei löytynyt",
  "not-found.Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.":
    "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.",
  "weeklyNewsletter.ayy-aalto": "AYY & Aalto",
  "weeklyNewsletter.bottom-corner": "Pohjanurkkaus",
  "weeklyNewsletter.calendar": "Kalenteri",
  "weeklyNewsletter.guild": "Kilta",
  "weeklyNewsletter.next-week": "Ensi viikolla",
  "weeklyNewsletter.old-link": "vanhoja viikkotiedotteita",
  "weeklyNewsletter.other": "Muu",
  "weeklyNewsletter.read": "Lue",
  "weeklyNewsletter.super-old-link": "erittäin vanhoja viikkotiedotteita",
  "weeklyNewsletter.this-week": "Tällä viikolla",
  "weeklyNewsletter.this-week-signups":
    "Tällä viikolla avoinna olevat ilmoittautumiset",
  "weeklyNewsletter.title": "Viikkotiedotteet",
  "weeklyNewsletter.path": "viikkotiedotteet",
  "calendar.Week": "Viikko",
  "calendar.Work Week": "Työviikko",
  "calendar.Day": "Päivä",
  "calendar.Month": "Kuukausi",
  "calendar.Today": "Tänään",
} as const;

type EnKey = keyof typeof en;

// assert types equal at typescript level
assertType<Record<EnKey, string>>(fi);

export default fi;
