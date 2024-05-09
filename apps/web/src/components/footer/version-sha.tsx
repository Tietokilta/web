const versionShaLong = process.env.GIT_COMMIT_SHA;
const year = new Date().getFullYear();
const showVersionSha =
  versionShaLong &&
  (versionShaLong !== "development" || process.env.NODE_ENV === "development");
const shaLinkUrl =
  versionShaLong !== "development"
    ? `https://github.com/Tietokilta/web/commit/${versionShaLong}`
    : "https://youtu.be/dQw4w9WgXcQ";

export function VersionSha() {
  return (
    <span className=" text-sm">
      © {year} Tietokilta ry
      {showVersionSha ? (
        <>
          {" "}
          |{" "}
          <a
            className="hover:underline"
            href={shaLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {versionShaLong.slice(0, 7)}
          </a>
        </>
      ) : null}
    </span>
  );
}
