export default {
  action: {
    Open: "Open",
    Close: "Close",
    "Toggle menu": "Toggle menu",
    "Sign up": "Sign up",
    "Read more": "Read more",
  },
  heading: {
    "Upcoming events": "Upcoming events",
  },
  errors: {
    "ilmomasiina-fetch-fail":
      "Failed to fetch events from Ilmomasiina. Please try again later.",
    "ilmomasiina-event-not-found": "Event not found. Please check the URL.",
    "ilmomasiina-ilmo-missing-quota-id": "Invalid request. Please try again.",
    "ilmomasiina-unknown-error":
      "An unknown error occurred. Please try again later.",
  },
} as const;
