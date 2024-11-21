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
  const eventDate = new Date("2024-12-01T15:00:00.000+02:00");
  const [days, hours, minutes, seconds] = useCountdown(eventDate);
  const f = (n: number) => `0${n.toString()}`.slice(-2);
  const dateString = `${f(days)}:${f(hours)}:${f(minutes)}:${f(seconds)}`;

  return (
    <div className="bg-gray-900">
      <div className="wrapper">
        <div className="header-container">
          <h1 className="header">Day of Destruction</h1>
          <h2 className="time" suppressHydrationWarning>
            {dateString}
          </h2>
        </div>
      </div>
      <div className="text-container">
        <h2 className="m-5 text-3xl md:text-4xl">
          Mind control machine instructions
        </h2>
        <p className="text-sm md:text-lg">
          The mind control machine utilizes the fuksi crystal&apos;s power to
          control the minds of Teekkaris. Please watch the video below before
          operating the machine.
        </p>
      </div>
      <div className="video-container">
        <video
          className="video"
          src="https://files.joonatanaatos.fi/syse.mp4"
          controls
        >
          <track kind="captions" srcLang="en" default />
        </video>
      </div>
    </div>
  );
}
