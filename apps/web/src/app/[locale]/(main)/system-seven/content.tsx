"use client";
import { useEffect, useState } from "react";
import "./system-seven.css";

const useCountdown = (date: Date) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    date.getTime() - new Date().getTime(),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(date.getTime() - new Date().getTime());
    }, new Date(timeLeft).getMilliseconds());

    return () => {
      clearTimeout(timer);
    };
  }, [date, timeLeft]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return [days, hours, minutes, seconds];
};

export default function SyseContent() {
  const eventDate = new Date("2026-11-17T16:07:00.000+02:00");
  const [days, hours, minutes, seconds] = useCountdown(eventDate);
  const f = (n: number) => `0${Math.max(0, n).toString()}`.slice(-2);
  const dateString = `${f(days)}:${f(hours)}:${f(minutes)}:${f(seconds)}`;

  return (
    <div className="bg-gray-900">
      <div className="wrapper">
        <div className="header-container">
          <h1 className="header">Remaining time:</h1>
          <h2 className="time" suppressHydrationWarning>
            {dateString}
          </h2>
        </div>
      </div>
      <div className="text-container">
        <h2 className="m-5 text-3xl md:text-4xl">
          Confidential, DO NOT DISTRIBUTE!
        </h2>
        <p className="text-sm md:text-lg">
          This video contains confidential information intended only for
          authorized viewers. Any unauthorized viewing, sharing, or distribution
          is strictly prohibited and may violate confidentiality obligations or
          applicable law. This page should definitely not be shared to the Fuksi
          chat!
        </p>
      </div>
      <div className="video-container">
        <iframe
          className="video"
          src="https://www.youtube-nocookie.com/embed/eUzxB2WRfLU?rel=0"
          title="System Seven"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
