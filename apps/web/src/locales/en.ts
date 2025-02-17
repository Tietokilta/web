import { assertType } from "../lib/utils";
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
  "errors.ilmomasiina-signup-not-found":
    "Sign up not found. Please check the URL.",
  "errors.ilmomasiina-unknown-error":
    "An unknown error occurred. Please try again later.",
  "errors.ilmomasiina-validation-failed":
    "Validation failed. Please check the form.",
  "generic.Page": "Page",
  "generic.Version": "Version",
  "heading.Main navigation": "Main navigation",
  "heading.Upcoming events": "Upcoming events",
  "infoscreen.Ruokalistat": "Menus",
  "infoscreen.Bussit": "Buses",
  "infoscreen.Raide-Jokeri": "Raide-Jokeri (Tram)",
  "infoscreen.Metro": "Metro",
  "invoicegenerator.Invoicer name": "Invoicer name",
  "invoicegenerator.Invoicer email": "Invoicer email",
  "invoicegenerator.Phone number": "Phone number",
  "invoicegenerator.Subject": "Subject",
  "invoicegenerator.Description": "Description",
  "invoicegenerator.Bank account number": "Bank account number (IBAN)",
  "invoicegenerator.Date": "Date",
  "invoicegenerator.Submit": "Submit",
  "invoicegenerator.Street name": "Street name",
  "invoicegenerator.City": "City",
  "invoicegenerator.Postal code": "Postal code",
  "invoicegenerator.Product": "Product",
  "invoicegenerator.Quantity": "Quantity",
  "invoicegenerator.Unit": "Unit",
  "invoicegenerator.Unit price": "Unit price",
  "invoicegenerator.Total price": "Total price",
  "invoicegenerator.Attachment": "Attachment",
  "invoicegenerator.Attachments": "Attachments",
  "invoicegenerator.Items": "Items",
  "invoicegenerator.Sent invoice": "Sent invoice",
  "invoicegenerator.Remove": "Remove",
  "invoicegenerator.Add": "Add",
  "invoicegenerator.Address": "Address",
  "invoicegenerator.Confirmation":
    "I confirm that the information I have provided is correct and I have checked that the pictures of the receipts are clear.",
  "invoicegenerator.Invoicer information": "Invoicer information",
  "ilmomasiina.form.You are in queue at position {position}":
    "You are in queue at position {position}.",
  "ilmomasiina.form.You are in the quota {quotaName} at position {position}":
    "You are in the quota {quotaName} at position {position}.",
  "ilmomasiina.form.You are in the quota {quotaName} at position {position}/{quotaSize}":
    "You are in the quota {quotaName} at position {position}/{quotaSize}.",
  "ilmomasiina.form.fieldError.missing": "This field is required.",
  "ilmomasiina.form.fieldError.wrongType":
    "The answer to this field is of the wrong type. Try refreshing the page.",
  "ilmomasiina.form.fieldError.tooLong":
    "Please enter a shorter value for this field.",
  "ilmomasiina.form.fieldError.invalidEmail":
    "Please enter a valid email address.",
  "ilmomasiina.form.fieldError.notANumber": "Please enter a valid number.",
  "ilmomasiina.form.fieldError.notAnOption":
    "The answer to this question isn't in the allowed options. Try refreshing the page.",
  "ilmomasiina.form.optional": "optional",
  "ilmomasiina.form.Shown in the public list of sign ups":
    "Shown in the public list of sign ups",
  "ilmomasiina.form.Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}":
    "Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}",
  "ilmomasiina.form.First name": "First name",
  "ilmomasiina.form.Last name": "Last name",
  "ilmomasiina.form.Email": "Email",
  "ilmomasiina.form.Show name in the public list of sign ups":
    "Show name in the public list of sign ups",
  "ilmomasiina.form.Submit": "Submit",
  "ilmomasiina.form.Update": "Update",
  "ilmomasiina.form.Edit sign up": "Edit sign up",
  "ilmomasiina.form.Delete sign up": "Delete sign up",
  "ilmomasiina.form.Sign up saved": "Sign up saved!",
  "ilmomasiina.form.You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message":
    "You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message.",
  "ilmomasiina.form.Are you sure you want to delete your sign up to {eventTitle}? If you delete your sign up, you will lose your place in the queue.":
    "Are you sure you want to delete your sign up to {eventTitle}? If you delete your sign up, you will lose your place in the queue.",
  "ilmomasiina.form.This action cannot be undone.":
    "This action cannot be undone.",
  "ilmomasiina.form.Your signup cannot be changed anymore as the signup for the event has closed":
    "Your signup cannot be changed anymore as the signup for the event has closed.",
  "ilmomasiina.form.Cancel": "Cancel",
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
  "ilmomasiina.Piilotettu": "Hidden",
  "ilmomasiina.Vahvistamaton": "Unconfirmed",
  "ilmomasiina.Avoin kiintiö": "Open quota",
  "ilmomasiina.Jonossa": "In queue",
  "ilmomasiina.path.events": "events",
  "ilmomasiina.path.all-events": "all-events",
  "ilmomasiina.all-events.Kaikki tapahtumat": "All events",
  "ilmomasiina.status.Ei ilmoittautuneita vielä": "No sign ups yet.",
  "ilmomasiina.status.Ilmoittautuminen alkaa": "Sign ups start on {startDate}",
  "ilmomasiina.status.Ilmo alkaa": "Sign ups start on {startDate}",
  "ilmomasiina.status.Ilmoittautuminen auki":
    "Open for sign ups until {endDate}",
  "ilmomasiina.status.Ilmo auki": "Open for sign ups until {endDate}",
  "ilmomasiina.status.Ilmoittautuminen on päättynyt": "Sign ups have ended",
  "ilmomasiina.status.Ilmoittautumistiedot eivät ole julkisia":
    "Sign up information is not public",
  "ilmomasiina.status.Jonossa": "{queueCount} in queue",
  "ilmomasiina.status.Tapahtumaan ei voi ilmoittautua":
    "Event does not have sign ups",
  "ilmomasiina.Tapahtumat": "Events",
  "ilmomasiina.Tilaa kalenteri": "Subscribe to calendar",
  "ilmomasiina.Kopioidaan leikepöydälle": "Copying to clipboard",
  "ilmomasiina.Kopioitu leikepöydälle": "Copied to clipboard",
  "ilmomasiina.Selaa vanhoja tapahtumia": "Browse old events",
  "not-found.Etusivulle": "To front page",
  "not-found.Tapahtumalistaukseen": "To event list",
  "not-found.Sivua ei löytynyt": "Page not found",
  "not-found.Tapahtumaa ei löytynyt": "Event not found",
  "not-found.Ilmoittautumista ei löytynyt": "Sign up not found",
  "not-found.Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.":
    "Page not found. Check the URL or return to the front page.",
  "not-found.Tapahtumaa ei löytynyt. Tarkista osoite tai palaa tapahtumalistaukseen.":
    "Event not found. Check the URL or return to the event list.",
  "not-found.Ilmoittautumista ei löytynyt tai muokkaustunniste oli väärin. Tarkista osoite tai palaa tapahtumalistaukseen.":
    "Sign up not found or the edit token was invalid. Check the URL or return to the event list.",
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
  "weeklyNewsletter.path": "weekly-newsletters",
  "weeklyNewsletter.link-to-sign-up": "To sign up",
  "weeklyNewsletter.for-event": "for event",
  "calendar.Week": "Week",
  "calendar.Work Week": "Work Week",
  "calendar.Day": "Day",
  "calendar.Month": "Month",
  "calendar.Today": "Today",
  "metadata.title": "Tietokilta",
  "metadata.template": "%s - Tietokilta",
  "metadata.description": "Homepage of the Computer Science Guild",
} as const;

// assert types equal at typescript level
type FiKey = keyof typeof fi;
assertType<Record<FiKey, string>>(en);

export default en;
