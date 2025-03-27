"use client";

import { PayloadAdminBar } from "@payloadcms/admin-bar";

export function AdminBarClient({
  isPreviewMode,
  id,
  collection,
}: {
  isPreviewMode: boolean;
  id?: string;
  collection?: string;
}) {
  const exitPreview = async () => {
    await fetch("/next_api/exit-preview");
    window.location.reload();
  };

  return (
    <PayloadAdminBar
      className="bottom-0"
      cmsURL={process.env.PUBLIC_SERVER_URL ?? window.location.origin}
      collectionSlug={collection}
      id={id}
      onPreviewExit={() => void exitPreview()} // has to be likes this, otherwise it doesn't run for some reason :shrug:
      preview={isPreviewMode}
      style={{
        top: "auto",
      }}
    />
  );
}
