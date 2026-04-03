import { draftMode } from "next/headers";
import { env } from "../env";
import { RefreshRouteOnSaveClient } from "./live-preview";

export async function LivePreview() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <RefreshRouteOnSaveClient serverURL={env.PUBLIC_FRONTEND_URL} />;
}
