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
  "errors.ilmomasiina-signup-not-found":
    "Ilmoittautumista ei löytynyt, tarkista osoite.",
  "errors.ilmomasiina-unknown-error":
    "Ilmomasiinassa tapahtui virhe. Yritä myöhemmin uudelleen.",
  "errors.ilmomasiina-validation-failed":
    "Validointi epäonnistui. Tarkista lomake.",
  "generic.Page": "Sivu",
  "generic.Version": "Versio",
  "heading.Main navigation": "Päävalikko",
  "heading.Upcoming events": "Tulevat tapahtumat",
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
  "ilmomasiina.Piilotettu": "Piilotettu",
  "ilmomasiina.Vahvistamaton": "Vahvistamaton",
  "ilmomasiina.Avoin kiintiö": "Avoin kiintiö",
  "ilmomasiina.Jonossa": "Jonossa",
  "ilmomasiina.path.events": "tapahtumat",
  "ilmomasiina.path.all-events": "kaikki-tapahtumat",
  "ilmomasiina.all-events.Kaikki tapahtumat": "Kaikki tapahtumat",
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
  "ilmomasiina.Tilaa kalenteri": "Tilaa kalenteri",
  "ilmomasiina.Kopioidaan leikepöydälle": "Kopioidaan leikepöydälle",
  "ilmomasiina.Kopioitu leikepöydälle": "Kopioitu leikepöydälle",
  "ilmomasiina.Selaa vanhoja tapahtumia": "Selaa vanhoja tapahtumia",
  "not-found.Etusivulle": "Etusivulle",
  "not-found.Tapahtumalistaukseen": "Tapahtumalistaukseen",
  "not-found.Sivua ei löytynyt": "Sivua ei löytynyt",
  "not-found.Tapahtumaa ei löytynyt": "Tapahtumaa ei löytynyt",
  "not-found.Ilmoittautumista ei löytynyt": "Ilmoit­tau­tumista ei löytynyt",
  "not-found.Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.":
    "Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.",
  "not-found.Tapahtumaa ei löytynyt. Tarkista osoite tai palaa tapahtumalistaukseen.":
    "Tapahtumaa ei löytynyt. Tarkista osoite tai palaa tapahtumalistaukseen.",
  "not-found.Ilmoittautumista ei löytynyt tai muokkaustunniste oli väärin. Tarkista osoite tai palaa tapahtumalistaukseen.":
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
} as const;

type EnKey = keyof typeof en;

// assert types equal at typescript level
assertType<Record<EnKey, string>>(fi);

export default fi;
