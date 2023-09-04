import { AdminBarClient } from "./AdminBarClient";

import { draftMode } from "next/headers";
import { Config } from "payload/generated-types";

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
      isPreviewMode={isPreviewMode}
      id={id}
      collection={collection}
    />
  );
}
