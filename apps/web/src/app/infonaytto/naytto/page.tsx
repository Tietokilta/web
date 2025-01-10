"use client";
import { useEffect, useState } from "react";
import type { RenderableStop } from "../../../components/infoscreen/types/hsl-helper-types.ts";
import type { IlmomasiinaEvent } from "../../../lib/api/external/ilmomasiina/index.ts";
import type { RestaurantMenu } from "../../../components/infoscreen/types/kanttiinit-types.ts";
import { fetchMenus } from "../../../components/infoscreen/kanttiinit-combined/update.ts";
import { HSLcombinedSchedule } from "../../../components/infoscreen/hsl-schedules-combined";
import { KanttiinitCombined } from "../../../components/infoscreen/kanttiinit-combined";
import Eventslist from "../../../components/infoscreen/events-list";

export default function InfoScreenContents() {
  const [current, setCurrent] = useState(0);
  const [stopData, setStopData] = useState<RenderableStop[]>([]);
  const [events, setEvents] = useState<IlmomasiinaEvent[]>([]);
  const [menus, setMenus] = useState<RestaurantMenu[]>([]);

  // Change screen every x seconds
  useEffect(() => {
    const setNextChild = () => {
      setCurrent((prev) => (prev + 1) % 3);
    };

    const intervalId = setInterval(setNextChild, 15000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Update menus (here so that the interval is set up only once)
  useEffect(() => {
    // Call fetchData immediately and then set up the interval
    fetchMenus(setMenus).catch((_err: unknown) => {
      // Error handling can be added later
    });
    const intervalId = setInterval(() => {
      void fetchMenus(setMenus);
    }, 3600000); // timeout n milliseconds

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (current === 0) {
    return (
      <div className="h-full flex-1 bg-white">
        <HSLcombinedSchedule stopData={stopData} setStopData={setStopData} />
      </div>
    );
  } else if (current === 1) {
    return (
      <div className="h-full flex-1 bg-white">
        <Eventslist
          events={events}
          setEvents={setEvents}
          showIlmostatus={false}
        />
      </div>
    );
  } else if (current === 2) {
    return (
      <div className="h-full flex-1 bg-white">
        <KanttiinitCombined menus={menus} />
      </div>
    );
  }
}
