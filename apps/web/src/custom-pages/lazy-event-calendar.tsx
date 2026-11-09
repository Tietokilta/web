"use client";

import dynamic from "next/dynamic";

// The CMS route renders every page type, and Next loads all of a route's client
// code up front unless a client component splits it off like this
const EventCalendar = dynamic(() => import("./event-calendar"));

export default EventCalendar;
