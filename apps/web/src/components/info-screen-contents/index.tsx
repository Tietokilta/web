import { useEffect, useState } from "react";
import {HSLcombinedSchedule} from "../hsl-schedules-combined";
import { Foods } from "../foods";
import Eventslist from "../events-list";

export function InfoScreenContents() {
    const [current, setCurrent] = useState(0);

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
                <HSLcombinedSchedule/>
            </div>
        );
    } else if (current === 1) {
        return (
            <div className="h-full flex-1 bg-gray-200">
                <Eventslist/>
            </div>
        );
    }
}
