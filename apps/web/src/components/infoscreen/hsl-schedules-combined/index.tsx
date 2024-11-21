"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HSLSchedule } from "../hsl-schedule";
import { type RenderableStop } from "../../../lib/types/hsl-helper-types.ts";
import { hslFetcher } from "../../../lib/fetcher.ts";

export function HSLcombinedSchedule({
  stopData,
  setStopData,
}: {
  stopData: RenderableStop[];
  setStopData: React.Dispatch<React.SetStateAction<RenderableStop[]>>;
}) {
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // This use effect updates the times displayed on the info screen
    const fetchData = async (): Promise<void> => {
      try {
        const result: { status: number; result: RenderableStop[] | null } =
          await hslFetcher();
        //console.log("Fetched data", result.status)
        if (result.status === 200) {
          setError("");
          setStopData(result.result ? result.result : []);
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
    const intervalId = setInterval(fetchData, 4000); // timeout n milliseconds

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [router, setStopData]);

  if (error !== "") {
    return (
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">{error}</h1>
      </div>
    );
  }
  return (
    <div className="w-full flex-row justify-center">
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">
          Aalto-yliopisto (M)
        </h1>
      </div>
      <div className="flex w-full justify-between gap-4 p-8 pt-0">
        {stopData.map((res) => (
          <HSLSchedule
            key={res.arrivals[0].headSign}
            result={res}
            className="flex flex-col gap-4"
          />
        ))}
      </div>
    </div>
  );
}
