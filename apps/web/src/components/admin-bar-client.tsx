"use client";

import { PayloadAdminBar } from "@payloadcms/admin-bar";

export function AdminBarClient({
  cmsURL,
  isPreviewMode,
  id,
  collection,
}: {
  cmsURL: string;
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
        <div className="fixed top-20 z-20 w-full bg-red-500 p-2 text-center text-white">
          This is a draft preview
        </div>
      ) : null}
      <PayloadAdminBar
        className="bottom-0"
        cmsURL={cmsURL}
        collectionSlug={collection}
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
