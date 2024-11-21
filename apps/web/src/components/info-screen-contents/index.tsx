import { useEffect, useState } from "react";
import {HSLcombinedSchedule} from "../hsl-schedules-combined";
import { Foods } from "../foods";
import Eventslist from "../events-list";
import { type RenderableStop } from "../../lib/types/hsl-helper-types";
import { type RestaurantMenu } from "../../lib/types/kanttiinit-types";
import { type IlmomasiinaEvent } from "../../lib/api/external/ilmomasiina";

export function InfoScreenContents() {
    const [current, setCurrent] = useState(0);
    const [stopData, setStopData] = useState<RenderableStop[]>([]);
    const [events, setEvents] = useState<IlmomasiinaEvent[]>([]);
    const [foods, setFoods] = useState<RestaurantMenu[]>([]);

    useEffect(() => {
        const setNextChild = () => {
            setCurrent(prev => (prev + 1) % 2);
        };

        const intervalId = setInterval(setNextChild, 5000);

        // Clear the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    if (current === 0) {
        return (
            <div className="h-full flex-1 bg-gray-200">
                <HSLcombinedSchedule stopData={stopData} setStopData={setStopData}/>
            </div>
        );
    } else if (current === 1) {
        return (
            <div className="h-full flex-1 bg-gray-200">
                <Eventslist events={events} setEvents={setEvents}/>
            </div>
        );
    } else if (current === 2) {
        return (
            <div className="h-full flex-1 bg-gray-200">
                <Foods />
            </div>
        );
    }
}
