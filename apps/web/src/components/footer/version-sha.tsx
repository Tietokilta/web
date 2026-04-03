import { getTranslations } from "@locales/server";
import { env } from "../../env";

const versionShaLong = env.GIT_COMMIT_SHA;
const year = new Date().getFullYear();
const showVersionSha =
  versionShaLong !== "development" || env.NODE_ENV === "development";
const shaLinkUrl =
  versionShaLong !== "development"
    ? `https://github.com/Tietokilta/web/tree/${versionShaLong}`
    : "https://youtu.be/dQw4w9WgXcQ";

export async function VersionSha() {
  const t = await getTranslations("generic");
  return (
    <span className="text-sm">
      <span>© {year} Tietokilta ry</span>
      {showVersionSha ? (
        <>
          <span> | </span>
          <a
            className="hover:underline"
            href={shaLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">{t("Version")}</span>
            <span>{versionShaLong.slice(0, 7)}</span>
          </a>
        </>
      ) : null}
    </span>
  );
}
