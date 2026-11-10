"use client";

import dynamic from "next/dynamic";

// Any CMS page can contain this block, so load these only where it is used
export const AvailabilityCalendar = dynamic(
  () => import("./availability-calendar"),
);
export const ReservationForm = dynamic(() => import("./reservation-form"));
