"use client";

import { PayloadAdminBar } from "payload-admin-bar";

export function AdminBarClient({
  isPreviewMode,
  id,
  collection,
}: {
  isPreviewMode: boolean;
  id?: string;
  collection?: string;
}) {
  return (
    <PayloadAdminBar
      cmsURL={process.env.NEXT_PUBLIC_API_URL ?? window?.location.origin}
      onPreviewExit={async () => {
        await fetch("/api/exit-preview");
        window.location.reload();
      }}
      preview={isPreviewMode}
      id={id}
      collection={collection}
      className="bottom-0"
      style={{ top: "auto" }}
    />
  );
}
