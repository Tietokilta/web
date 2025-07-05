import { draftMode } from "next/headers";
import type { Config } from "@payload-types";
import { AdminBarClient } from "./admin-bar-client";

export async function AdminBar({
  id,
  collection,
}: {
  id?: string;
  collection?: keyof Config["collections"];
}) {
  const { isEnabled: isPreviewMode } = await draftMode();

  return (
    <AdminBarClient
      collection={collection}
      id={id}
      isPreviewMode={isPreviewMode}
    />
  );
}
