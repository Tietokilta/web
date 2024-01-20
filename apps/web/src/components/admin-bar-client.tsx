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
  const exitPreview = async () => {
    await fetch("/api/exit-preview");
    window.location.reload();
  };

  return (
    <PayloadAdminBar
      className="bottom-0"
      cmsURL={process.env.PUBLIC_SERVER_URL ?? window.location.origin}
      collection={collection}
      id={id}
      onPreviewExit={void exitPreview}
      preview={isPreviewMode}
      style={{ top: "auto" }}
    />
  );
}
