import { draftMode } from "next/headers";
import type { Config } from "@payload-types";
import { env } from "../env";
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
      cmsURL={env.PUBLIC_FRONTEND_URL}
      collection={collection}
      id={id}
      isPreviewMode={isPreviewMode}
    />
  );
}
