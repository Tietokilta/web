"use client";
import { useEffect } from "react";

export default function AprilFoolsAlert() {
  useEffect(() => {
    const isAprilFoolsDay =
      new Date().getDate() === 1 && new Date().getMonth() === 3;
    const hasSeen = localStorage.getItem("april-fools-alert");
    if (isAprilFoolsDay && !hasSeen) {
      localStorage.setItem("april-fools-alert", "true");
      if (
        // eslint-disable-next-line no-alert -- funny message
        confirm(
          "Onneksi olkoon, olet juuri voittanut upouuden IPhone 17 Pro Maxin! Lunastaaksesi voiton, klikkaa OK ja syötä puhelinnumerosi seuraavassa ikkunassa. Kiitos osallistumisesta!",
        )
      ) {
        window.location.href = "https://www.jayna.fi/fi";
      }
    }
  });

  return null;
}
