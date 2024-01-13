import type { Config } from "@tietokilta/cms-types/payload";
import { draftMode } from "next/headers";
import { AdminBarClient } from "./admin-bar-client";

export function AdminBar({
  id,
  collection,
}: {
  id?: string;
  collection?: keyof Config["collections"];
}) {
  const { isEnabled: isPreviewMode } = draftMode();

  return (
    <AdminBarClient
      collection={collection}
      id={id}
      isPreviewMode={isPreviewMode}
    />
  );
}
