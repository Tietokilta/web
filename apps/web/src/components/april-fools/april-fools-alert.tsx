"use client";
import { useEffect } from "react";
import { usePathnameLocale } from "@lib/use-pathname-locale";

export default function AprilFoolsAlert() {
  const locale = usePathnameLocale();
  useEffect(() => {
    const isAprilFoolsDay =
      new Date().getDate() === 1 && new Date().getMonth() === 3;
    const hasSeen = localStorage.getItem("april-fools-alert");
    if (isAprilFoolsDay && !hasSeen) {
      localStorage.setItem("april-fools-alert", "true");
      if (
        // eslint-disable-next-line no-alert -- funny message
        confirm(
          locale === "fi"
            ? "Onneksi olkoon, olet juuri voittanut upouuden IPhone 17 Pro Maxin! Lunastaaksesi voiton, klikkaa OK ja syötä puhelinnumerosi seuraavassa ikkunassa. Kiitos osallistumisesta!"
            : "Congratulations, you've just won a brand new iPhone 17 Pro Max! To claim your prize, click OK and enter your phone number in the next window. Thanks for participating!",
        )
      ) {
        window.location.href = "https://www.jayna.fi/fi";
      }
    }
  });

  return null;
}
