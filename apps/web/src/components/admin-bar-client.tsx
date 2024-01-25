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
    await fetch("/next_api/exit-preview");
    window.location.reload();
  };

  return (
    <>
      {isPreviewMode ? (
        <div className="top-30 fixed z-20 w-full bg-red-500 p-2 text-center text-white">
          This is a draft preview
        </div>
      ) : null}
      <PayloadAdminBar
        className="bottom-0"
        cmsURL={process.env.PUBLIC_SERVER_URL ?? window.location.origin}
        collection={collection}
        id={id}
        onPreviewExit={() => void exitPreview()} // has to be likes this, otherwise it doesn't run for some reason :shrug:
        preview={isPreviewMode}
        style={{
          top: "auto",
        }}
      />
    </>
  );
}
