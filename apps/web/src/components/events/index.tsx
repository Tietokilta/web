"use client";
import Eventslist from "../events-list";
import { useEffect, useState } from "react";

export function Events() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set an interval to update the count every second (1000ms)
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return <Eventslist key={Math.random()} />;
}

export default Events;
