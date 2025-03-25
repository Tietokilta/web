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
  "error.Oops, something went wrong": "Hups, jotain meni pieleen.",
  "error.Something went wrong": "Jotain meni pieleen",
  "error.Oops, something went terribly wrong. Contact the site administrator. The error ID is":
    "Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
  "error.Oops, something went wrong. Contact the site administrator. The error ID is":
    "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
  "error.Try again": "Yritä uudelleen",
  "errors.Event not found. Please check the URL":
    "Tapahtumaa ei löytynyt, tarkista osoite.",
  "errors.Failed to fetch events from Ilmomasiina. Please try again later":
    "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
  "errors.Invalid request. Please try again":
    "Virheellinen pyyntö, yritä uudelleen.",
  "errors.Sign up not found. Please check the URL":
    "Ilmoittautumista ei löytynyt, tarkista osoite.",
  "errors.An unknown error occurred. Please try again later":
    "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
  "errors.Validation failed. Please check the form":
    "Validointi epäonnistui. Tarkista lomake.",
  "generic.Page": "Sivu",
  "generic.Version": "Versio",
  "heading.Main navigation": "Päävalikko",
  "heading.Upcoming events": "Tulevat tapahtumat",
  "infoscreen.Menus": "Ruokalistat",
  "infoscreen.Allergen information":
    "A+ = Sisältää Allergeenejä | L = Laktoositon | VL = Vähälaktoosinen | G" +
    "        = Gluteeniton | M = Maidoton | O+ = Sisältää" +
    "        valkosipulia | VV = Vegaaninen",
  "infoscreen.Buses": "Bussit",
  "infoscreen.Raide-Jokeri": "Raide-Jokeri",
  "infoscreen.Metro": "Metro",
  "infoscreen.Aalto University": "Aalto-yliopisto",
  "invoicegenerator.Invoicer name": "Laskuttajan nimi",
  "invoicegenerator.Invoicer email": "Laskuttajan sähköpostiosoite",
  "invoicegenerator.Phone number": "Puhelinnumero",
  "invoicegenerator.Subject": "Aihe",
  "invoicegenerator.Description": "Perustelut",
  "invoicegenerator.Bank account number": "Pankkitilin numero (IBAN)",
  "invoicegenerator.Date": "Päiväys",
  "invoicegenerator.Submit": "Lähetä",
  "invoicegenerator.Street name": "Katuosoite",
  "invoicegenerator.City": "Kaupunki",
  "invoicegenerator.Postal code": "Postinumero",
  "invoicegenerator.Product": "Tuote",
  "invoicegenerator.Quantity": "Määrä",
  "invoicegenerator.Unit": "Yksikkö",
  "invoicegenerator.Unit price": "Yksikköhinta",
  "invoicegenerator.Total price": "Yhteensä",
  "invoicegenerator.Attachment": "Liite",
  "invoicegenerator.Attachments": "Liitteet",
  "invoicegenerator.Items": "Erittely",
  "invoicegenerator.Sent invoice": "Lasku lähetetty",
  "invoicegenerator.Remove": "Poista",
  "invoicegenerator.Add": "Lisää",
  "invoicegenerator.Address": "Osoite",
  "invoicegenerator.Confirmation":
    "Vakuutan antamani tiedot oikeiksi ja olen tarkistanut, että kuvat kuiteista ovat selkeitä.",
  "invoicegenerator.Invoicer information": "Laskuttajan tiedot",
  "ilmomasiina.form.You are in queue at position {position}":
    "Olet jonossa sijalla {position}.",
  "ilmomasiina.form.You are in the quota {quotaName} at position {position}":
    "Olet kiintiössä {quotaName} sijalla {position}.",
  "ilmomasiina.form.You are in the quota {quotaName} at position {position}/{quotaSize}":
    "Olet kiintiössä {quotaName} sijalla {position}/{quotaSize}.",
  "ilmomasiina.form.fieldError.missing": "Tämä kenttä on pakollinen.",
  "ilmomasiina.form.fieldError.wrongType":
    "Kentän vastaus on väärää tyyppiä. Kokeile päivittää sivu.",
  "ilmomasiina.form.fieldError.tooLong": "Kentän vastaus on liian pitkä.",
  "ilmomasiina.form.fieldError.invalidEmail":
    "sähköpostiosoite on virheellinen. Syötä sallittu sähköpostiosoite.",
  "ilmomasiina.form.fieldError.notANumber":
    "Kentän vastauksen tulee olla numero.",
  "ilmomasiina.form.fieldError.notAnOption":
    "Kentän vastaus ei ole sallituissa vaihtoehdoissa. Kokeile päivittää sivu.",
  "ilmomasiina.form.optional": "valinnainen",
  "ilmomasiina.form.Shown in the public list of sign ups":
    "Näytetään julkisessa osallistujalistassa",
  "ilmomasiina.form.Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}":
    "Huomio: Ilmoittautuminen suoraan sivuilla on beta-vaiheessa, jos kohtaat ongelmia voit ilmoittautua tapahtuman sivulla ilmomasiinassa: {eventUrl}",
  "ilmomasiina.form.First name": "Etunimi",
  "ilmomasiina.form.Last name": "Sukunimi",
  "ilmomasiina.form.Email": "Sähköposti",
  "ilmomasiina.form.Show name in the public list of sign ups":
    "Näytä nimi julkisessa osallistujalistassa",
  "ilmomasiina.form.Submit": "Tallenna",
  "ilmomasiina.form.Update": "Päivitä",
  "ilmomasiina.form.Edit sign up": "Muokkaa ilmoittautumista",
  "ilmomasiina.form.Delete sign up": "Poista ilmoittautuminen",
  "ilmomasiina.form.Sign up saved": "Ilmoittautuminen tallennettu!",
  "ilmomasiina.form.You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message":
    "Voit muokata ilmoittautumistasi tai poistaa sen myöhemmin tästä osoitteesta, joka lähetetään sähköpostiisi vahvistusviestissä.",
  "ilmomasiina.form.Your signup cannot be changed anymore as the signup for the event has closed":
    "Ilmoittautumistasi ei voi enää muokata tai perua, koska tapahtuman ilmoittautuminen on sulkeutunut.",
  "ilmomasiina.form.Are you sure you want to delete your sign up to {eventTitle}? If you delete your sign up, you will lose your place in the queue.":
    "Oletka varma, että haluat poistaa ilmoittautumisesi tapahtumaan {eventTitle}? Jos poistat ilmoittautumisesi, menetät paikkasi jonossa.",
  "ilmomasiina.form.This action cannot be undone.":
    "Tätä toimintoa ei voi perua.",
  "ilmomasiina.form.Cancel": "Peruuta",
  "ilmomasiina.headers.Starts": "Alkaa",
  "ilmomasiina.headers.Sign up time": "Ilmoittautumisaika",
  "ilmomasiina.headers.Category": "Kategoria",
  "ilmomasiina.headers.Quota": "Kiintiö",
  "ilmomasiina.headers.Ends": "Loppuu",
  "ilmomasiina.headers.Name": "Nimi",
  "ilmomasiina.headers.Location": "Paikka",
  "ilmomasiina.headers.Price": "Hinta",
  "ilmomasiina.headers.Place": "Sija",
  "ilmomasiina.Sign up": "Ilmoittautuminen",
  "ilmomasiina.Signed up participants": "Ilmoittautuneet",
  "ilmomasiina.Number of signups": "Ilmoittautuneita",
  "ilmomasiina.No signup": "Ei ilmoittautumista",
  "ilmomasiina.Hidden": "Piilotettu",
  "ilmomasiina.Unconfirmed": "Vahvistamaton",
  "ilmomasiina.Open quota": "Avoin kiintiö",
  "ilmomasiina.In queue": "Jonossa",
  "ilmomasiina.path.events": "tapahtumat",
  "ilmomasiina.path.all-events": "kaikki-tapahtumat",
  "ilmomasiina.all-events.All events": "Kaikki tapahtumat",
  "ilmomasiina.status.No sign ups yet": "Ei ilmoittautuneita vielä.",
  "ilmomasiina.status.Sign up starts on date":
    "Ilmoittautuminen alkaa {startDate}",
  "ilmomasiina.status.Sign up starts": "Ilmo alkaa {startDate}",
  "ilmomasiina.status.Open for sign ups until":
    "Ilmoittautuminen auki {endDate} asti",
  "ilmomasiina.status.Sign up until": "Ilmo auki {endDate} asti",
  "ilmomasiina.status.Sign up has ended": "Ilmoittautuminen on päättynyt",
  "ilmomasiina.status.Sign ups are not public":
    "Ilmoittautumistiedot eivät ole julkisia.",
  "ilmomasiina.status.Queue count": "Jonossa {queueCount}",
  "ilmomasiina.status.This event does not have sign ups":
    "Tapahtumaan ei voi ilmoittautua",
  "ilmomasiina.Events": "Tapahtumat",
  "ilmomasiina.Subscribe to calendar": "Tilaa kalenteri",
  "ilmomasiina.Copying to clipboard": "Kopioidaan leikepöydälle",
  "ilmomasiina.Copied to clipboard": "Kopioitu leikepöydälle",
  "ilmomasiina.Browse old events": "Selaa vanhoja tapahtumia",
  "not-found.To front page": "Etusivulle",
  "not-found.To event list": "Tapahtumalistaukseen",
  "not-found.Page not found": "Sivua ei löytynyt",
  "not-found.Event not found": "Tapahtumaa ei löytynyt",
  "not-found.Sign up not found": "Ilmoit­tau­tumista ei löytynyt",
  "not-found.Page not found. Check the URL or return to the front page":
    "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.",
  "not-found.Event not found. Check the URL or return to the event list":
    "Tapahtumaa ei löytynyt. Tarkista osoite tai palaa tapahtumalistaukseen.",
  "not-found.Sign up not found or the edit token was invalid. Check the URL or return to the event list":
    "Ilmoittautumista ei löytynyt tai muokkaustunniste oli väärin. Tarkista osoite tai palaa tapahtumalistaukseen.",
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
  "weeklyNewsletter.link-to-sign-up": "Ilmoittautumiseen",
  "weeklyNewsletter.for-event": "tapahtumalle",
  "calendar.Week": "Viikko",
  "calendar.Work Week": "Työviikko",
  "calendar.Day": "Päivä",
  "calendar.Month": "Kuukausi",
  "calendar.Today": "Tänään",
  "metadata.title": "Tietokilta",
  "metadata.template": "%s - Tietokilta",
  "metadata.description": "Tietokilta ry:n kotisivut",
} as const;

type EnKey = keyof typeof en;

// assert types equal at typescript level
assertType<Record<EnKey, string>>(fi);

export default fi;
