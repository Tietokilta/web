import { i18nResources } from "@tietokilta/ilmomasiina-client/dist/locales/index";
import type fi from "./fi";

const ilmo = i18nResources.en.public;
/**
 * English localizations in nested structure for next-intl.
 */
const en = {
  action: {
    Back: "Back",
    Close: "Close",
    "Go to next page": "Go to next page",
    "Go to previous page": "Go to previous page",
    "More pages": "More pages",
    Next: "Next",
    Open: "Open",
    Previous: "Previous",
    "Read more": "Read more",
    "Read more about {something}": "Read more about {something}",
    "Sign up": "Sign up",
    "Skip to main content": "Skip to main content",
    "Toggle menu": "Toggle menu",
  },
  error: {
    "Something went wrong": "Something went wrong",
    errorWithId:
      "Oops, something went wrong. Contact the site administrator. The error ID is",
    "Try again": "Try again",
  },
  errors: {
    "ilmomasiina-event-not-found": "Event not found. Please check the URL.",
    "ilmomasiina-fetch-fail":
      "Failed to fetch events from Ilmomasiina. Please try again later.",
    "ilmomasiina-ilmo-missing-quota-id": "Invalid request. Please try again.",
    "ilmomasiina-signup-not-found": "Sign up not found. Please check the URL.",
    "ilmomasiina-unknown-error":
      "An unknown error occurred. Please try again later.",
    "ilmomasiina-validation-failed":
      "Validation failed. Please check the form.",
    ilmo: {
      code: {
        BadSession: "Session has expired. Please log in again.",
        EditConflict: "Edit conflict. Please try again.",
        WouldMoveSignupsToQueue: "Signups would be moved to the queue.",
        WrongOldPassword: "Incorrect old password.",
        SignupsClosed: "Signups are closed.",
        NoSuchQuota: "Quota not found.",
        NoSuchSignup: "Signup not found.",
        BadEditToken: "Invalid edit token.",
        CannotDeleteSelf: "You cannot delete yourself.",
        InitialSetupNeeded: "Initial setup needed.",
        InitialSetupAlreadyDone: "Initial setup already done.",
        SignupValidationError: "Signup validation failed.",
        EventValidationError: "Event validation failed.",
        FST_ERR_VALIDATION: "Validation failed.",
        OnlinePaymentsDisabled:
          ilmo["editSignup.paymentError.OnlinePaymentsDisabled.description"],
        SignupAlreadyPaid:
          ilmo["editSignup.paymentError.SignupAlreadyPaid.description"],
        PaymentNotRequired:
          ilmo["editSignup.paymentError.PaymentNotRequired.description"],
        PaymentInProgress:
          ilmo["editSignup.paymentError.PaymentInProgress.description"],
        PaymentNotFound:
          ilmo["editSignup.paymentError.PaymentNotFound.description"],
        PaymentNotComplete:
          ilmo["editSignup.paymentError.PaymentNotComplete.description"],
        PaymentRateLimited:
          ilmo["editSignup.paymentError.PaymentRateLimited.description"],
        DefaultPaymentError:
          ilmo["editSignup.paymentError.default.description"],
        SignupInQueue:
          ilmo["editSignup.paymentError.SignupInQueue.description"],
        SignupNotConfirmed: "Signup must be confirmed before payment",
      },
      fieldError: {
        missing: "This field is required.",
        wrongType: "Invalid type.",
        tooLong: "Value is too long.",
        invalidEmail: "Invalid email address.",
        notANumber: "Value must be a number.",
        notAnOption: "Invalid option.",
        duplicateOption:
          "The answer to this question contains duplicate selections.",
      },
    },
  },
  generic: {
    Page: "Page",
    Version: "Version",
  },
  heading: {
    "Main navigation": "Main navigation",
    "Upcoming events": "Upcoming events",
  },
  infoscreen: {
    Menus: "Menus",
    allergens:
      "A+ = Contains Allergens | L = Lactosefree | VL = low-lactose | G = Glutenfree | M = Milkfree | O+ = Contains garlic | VV = Vegan",
    Buses: "Buses",
    "Raide-Jokeri": "Raide-Jokeri (Tram)",
    Metro: "Metro",
    "Aalto-university": "Aalto-university",
  },
  invoicegenerator: {
    "Invoicer name": "Invoicer name",
    "Invoicer email": "Invoicer email",
    "Phone number": "Phone number",
    Subject: "Subject",
    Description: "Description",
    "Bank account number": "Bank account number (IBAN)",
    Date: "Date",
    Submit: "Submit",
    "Street name": "Street name",
    City: "City",
    "Postal code": "Postal code",
    Product: "Product",
    Quantity: "Quantity",
    Unit: "Unit",
    "Unit price": "Unit price",
    "Total price": "Total price",
    Attachment: "Attachment",
    Attachments: "Attachments",
    Items: "Items",
    "Receipt/Product": "Receipt/Product",
    "Sent invoice": "Sent invoice",
    Remove: "Remove",
    Add: "Add",
    Address: "Address",
    Confirmation:
      "I confirm that the information I have provided is correct and I have checked that the pictures of the receipts are clear.",
    "Invoicer information": "Invoicer information",
  },
  ilmomasiina: {
    form: {
      "You are in queue at position {position}":
        "You are in queue at position {position}.",
      "You are in the open quota at position {position}/{quotaSize}":
        "You are in the open quota at position {position}/{quotaSize}.",
      "You are in the quota {quotaName} at position {position}":
        "You are in the quota {quotaName} at position {position}.",
      "You are in the quota {quotaName} at position {position}/{quotaSize}":
        "You are in the quota {quotaName} at position {position}/{quotaSize}.",
      fieldError: {
        missing: "This field is required.",
        wrongType:
          "The answer to this field is of the wrong type. Try refreshing the page.",
        tooLong: "Please enter a shorter value for this field.",
        invalidEmail: "Please enter a valid email address.",
        notANumber: "Please enter a valid number.",
        notAnOption:
          "The answer to this question isn't in the allowed options. Try refreshing the page.",
        duplicateOption:
          "The answer to this question contains duplicate selections.",
      },
      optional: "optional",
      "Shown in the public list of sign ups":
        "Shown in the public list of sign ups",
      "Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}":
        "Note: Sign up integration is in beta, if you encounter any issues you can sign up directly on the event page: {eventUrl}",
      "First name": "First name",
      "Last name": "Last name",
      Email: "Email",
      "Show name in the public list of sign ups":
        "Show name in the public list of sign ups",
      Submit: "Submit",
      Update: "Update",
      "Edit sign up": "Edit sign up",
      "Delete sign up": "Delete sign up",
      "Sign up saved": "Sign up saved!",
      "You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message":
        "You can edit your sign up or delete it later from this page, which will be sent to your email in the confirmation message.",
      "Your signup cannot be changed anymore as the signup for the event has closed":
        "Your signup cannot be changed anymore as the signup for the event has closed.",
      deleteConfirmation:
        "Are you sure you want to delete your sign up to {eventTitle}? If you delete your sign up, you will lose your place in the queue.",
      actionCannotBeUndone: "This action cannot be undone.",
      Cancel: "Cancel",
      uneditablePaidQuestion: ilmo["editSignup.uneditablePaidQuestion"],
    },
    payment: {
      "Payment information": "Payment information",
      "Payment instructions":
        "Payments are handled on the event page. Use the button below to continue.",
      "Go to payment page": "Go to payment page",
      infoMessage:
        "Payments are handled on the event page. Use the button below to continue.",
      pay: "Pay",
      paymentPageHint: "Payment page: {paymentUrl}",
      status: {
        pending: ilmo["editSignup.payment.status.pending"],
        paid: ilmo["editSignup.payment.status.paid"],
        refunded: ilmo["editSignup.payment.status.refunded"],
        inQueue: ilmo["editSignup.payment.status.inQueue"],
      },
      processing: "Processing...",
      error: "Payment error occurred. Please try again.",
    },
    headers: {
      Starts: "Starts",
      "Sign up time": "Sign up time",
      Category: "Category",
      Quota: "Quota",
      Ends: "Ends",
      Name: "Name",
      Location: "Location",
      Price: "Price",
      Position: "Position",
      Product: "Product",
    },
    "Sign up": "Sign up",
    Signups: "Signups",
    "Signed up count": "Signed up",
    "No signup": "No Signup",
    Hidden: "Hidden",
    Unconfirmed: "Unconfirmed",
    "Open quota": "Open quota",
    "In queue": "In queue",
    Queue: "Queue",
    Category: "Category",
    Location: "Location",
    Starts: "Starts",
    Ends: "Ends",
    Price: "Price",
    TotalPrice: "Total price",
    Signup: "Sign up",
    Back: "Back",
    path: {
      events: "events",
      "all-events": "all-events",
    },
    "all-events": {
      "All events": "All events",
    },
    "Event does not have signups": "This event does not have sign ups",
    "Signups have ended": "Sign up has ended",
    "Signups open until {endDate}": "Open for sign ups until {endDate}",
    "Signups open on {startDate}": "Sign up starts on {startDate}",
    "Signup information is not public": "Sign ups are not public",
    "No signups yet": "No sign ups yet.",
    Position: "Position",
    Name: "Name",
    Quota: "Quota",
    "Signup time": "Sign up time",
    "In queue: {queueCount} ({confirmedCount} confirmed)":
      "{queueCount} in the queue ({confirmedCount} confirmed)",
    status: {
      "No signups yet": "No sign ups yet.",
      "Sign up starts on {startDate}": "Sign up starts on {startDate}",
      "Sign up starts {startDate}": "Sign up starts {startDate}",
      "Open for sign ups until {endDate}": "Open for sign ups until {endDate}",
      "Sign up until {endDate}": "Sign up until {endDate}",
      "Sign up has ended": "Sign up has ended",
      "Sign ups are not public": "Sign ups are not public",
      "{queueCount} in the queue ({confirmedCount} confirmed)":
        "{queueCount} in the queue ({confirmedCount} confirmed)",
      "This event does not have sign ups": "This event does not have sign ups",
    },
    Events: "Events",
    "Subscribe to calendar": "Subscribe to calendar",
    "Copying to clipboard": "Copying to clipboard",
    "Copied to clipboard": "Copied to clipboard",
    "Browse old events": "Browse old events",
  },
  "not-found": {
    "To front page": "To front page",
    "To event list": "To event list",
    "Page not found": "Page not found",
    "Event not found": "Event not found",
    "Sign up not found": "Sign up not found",
    pageNotFoundDescription:
      "Page not found. Check the URL or return to the front page.",
    eventNotFoundDescription:
      "Event not found. Check the URL or return to the event list.",
    signupNotFoundDescription:
      "Sign up not found or the edit token was invalid. Check the URL or return to the event list.",
  },
  weeklyNewsletter: {
    "AYY & Aalto": "AYY & Aalto",
    "Bottom Corner": "Bottom Corner",
    Calendar: "Calendar",
    Guild: "Guild",
    "Next week": "Next week",
    "old weekly newsletters": "old weekly newsletters",
    Other: "Other",
    Read: "Read",
    "very old weekly newsletters": "very old weekly newsletters",
    "This week": "This week",
    "Sign ups open this week": "Sign ups open this week",
    title: "Weekly newsletters",
    path: "weekly-newsletters",
    "To sign up": "To sign up",
    "for event": "for event",
  },
  calendar: {
    Week: "Week",
    "Work Week": "Work Week",
    Day: "Day",
    Month: "Month",
    Today: "Today",
    Previous: "Previous",
    Next: "Next",
  },
  metadata: {
    title: "Tietokilta",
    template: "%s - Tietokilta",
    description: "Homepage of the Computer Science Guild",
  },
} as const;

// Type check: ensure en has the same keys as fi (values can differ)
type AssertSameKeys<T, U> = keyof T extends keyof U
  ? keyof U extends keyof T
    ? true
    : never
  : never;
// eslint-disable-next-line @typescript-eslint/naming-convention -- compile-time only
type _CheckSameKeys = AssertSameKeys<typeof en, typeof fi>;

export default en;
