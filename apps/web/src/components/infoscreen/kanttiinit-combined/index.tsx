"use client";

import {Restaurant, type RestaurantMenu} from "../../../lib/types/kanttiinit-types.ts";
import {useEffect, useState} from "react";
import type {RenderableStop} from "../../../lib/types/hsl-helper-types.ts";
import {kanttiinitFetcher} from "../../../lib/fetcher.ts";
import {useRouter} from "next/navigation";

export function KanttiinitCombined({
  menus,
  setMenus,
}: {
  menus: RestaurantMenu[];
  setMenus: React.Dispatch<React.SetStateAction<RestaurantMenu[]>>;
}) {
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    // This use effect updates the times displayed on the info screen
    const fetchData = async (): Promise<void> => {
      try {
        const result: { status: number; result: Restaurant[] | null } =
          await kanttiinitFetcher("https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids=2,7,52&priceCategories=student");
        //console.log("Fetched data", result.status)
        if (result.status === 200) {
          setError("");
          // setMenus(result.result ? result.result : []);
        } else {
          setError("Error fetching data");
          router.push("/infonaytto/naytto");
        }
      } catch (err: any) {
        setError(err.message);
        router.push("/infonaytto/naytto");
      }
    };
    // Call fetchData immediately and then set up the interval
    fetchData().catch((err: Error) => {
      setError(err.message);
    });
    const intervalId = setInterval(fetchData, 3600000); // timeout n milliseconds

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [menus, setMenus]);
  return (
    <div>
      <h1>{}</h1>
    </div>
  );
}
