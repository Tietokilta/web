"use client";

import dynamic from "next/dynamic";

// Any CMS page can contain this block, so load the form only where it is used
export const InvoiceGeneratorForm = dynamic(() =>
  import("./index").then((module) => module.InvoiceGeneratorForm),
);
