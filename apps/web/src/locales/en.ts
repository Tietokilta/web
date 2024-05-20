import { assertType, type Equals } from "../lib/utils";
import type fi from "./fi";

/**
 * English localizations, supports one level of nesting.
 */
const en = {
  "action.Back": "Back",
  "action.Close": "Close",
  "action.Go to next page": "Go to next page",
  "action.Go to previous page": "Go to previous page",
  "action.More pages": "More pages",
  "action.Next": "Next",
  "action.Open": "Open",
  "action.Previous": "Previous",
  "action.Read more": "Read more",
  "action.Read more about {something}": "Read more about {something}",
  "action.Sign up": "Sign up",
  "action.Skip to main content": "Skip to main content",
  "action.Toggle menu": "Toggle menu",
  "error.Hups, jotain meni pieleen.": "Oops, something went wrong.",
  "error.Jotain meni pieleen": "Something went wrong",
  "error.Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
    "Oops, something went terribly wrong. Contact the site administrator. The error ID is",
  "error.Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on":
    "Oops, something went wrong. Contact the site administrator. The error ID is",
  "error.Yritä uudelleen": "Try again",
  "errors.ilmomasiina-event-not-found":
    "Event not found. Please check the URL.",
  "errors.ilmomasiina-fetch-fail":
    "Failed to fetch events from Ilmomasiina. Please try again later.",
  "errors.ilmomasiina-ilmo-missing-quota-id":
    "Invalid request. Please try again.",
  "errors.ilmomasiina-unknown-error":
    "An unknown error occurred. Please try again later.",
  "generic.Page": "Page",
  "generic.Version": "Version",
  "heading.Upcoming events": "Upcoming events",
  "ilmomasiina.headers.Alkaa": "Starts",
  "ilmomasiina.headers.Ilmoittautumisaika": "Sign up time",
  "ilmomasiina.headers.Kategoria": "Category",
  "ilmomasiina.headers.Kiintiö": "Quota",
  "ilmomasiina.headers.Loppuu": "Ends",
  "ilmomasiina.headers.Nimi": "Name",
  "ilmomasiina.headers.Paikka": "Location",
  "ilmomasiina.headers.Sija": "Place",
  "ilmomasiina.Ilmoittautuminen": "Sign up",
  "ilmomasiina.Ilmoittautuneet": "Signed up",
  "ilmomasiina.Ilmoittautuneita": "Signed up",
  "ilmomasiina.path.events": "events",
  "ilmomasiina.status.Ei ilmoittautuneita vielä": "No sign ups yet.",
  "ilmomasiina.status.Ilmoittautuminen alkaa": "Sign ups start on {startDate}",
  "ilmomasiina.status.Ilmoittautuminen auki":
    "Open for sign ups until {endDate}",
  "ilmomasiina.status.Ilmoittautuminen on päättynyt": "Sign ups have ended",
  "ilmomasiina.status.Jonossa": "{queueCount} in queue",
  "ilmomasiina.status.Tapahtumaan ei voi ilmoittautua":
    "Event does not have sign ups",
  "ilmomasiina.Tapahtumat": "Events",
  "not-found.Etusivulle": "To front page",
  "not-found.Sivua ei löytynyt": "Page not found",
  "not-found.Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.":
    "Page not found. Check the URL or return to the front page.",
  "weeklyNewsletter.ayy-aalto": "AYY & Aalto",
  "weeklyNewsletter.bottom-corner": "Bottom Corner",
  "weeklyNewsletter.calendar": "Calendar",
  "weeklyNewsletter.guild": "Guild",
  "weeklyNewsletter.next-week": "Next week",
  "weeklyNewsletter.old-link": "old weekly newsletters",
  "weeklyNewsletter.other": "Other",
  "weeklyNewsletter.read": "Read",
  "weeklyNewsletter.super-old-link": "very old weekly newsletters",
  "weeklyNewsletter.this-week": "This week",
  "weeklyNewsletter.this-week-signups": "Sign ups open this week",
  "weeklyNewsletter.title": "Weekly newsletters",
} as const;

type EnKey = keyof typeof en;
type FiKey = keyof typeof fi;

// assert types equal at typescript level
assertType<Equals<EnKey, FiKey>>();

export default en;
