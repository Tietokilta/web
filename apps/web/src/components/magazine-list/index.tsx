import type {
  Magazine,
  MagazineIssue,
  Media,
  Document,
} from "@tietokilta/cms-types/payload";
import Image from "next/image";
import TikLogo from "../../assets/TiK-logo.png";

function IssueCard({ issue }: { issue: MagazineIssue }) {
  const thumbnail = issue.thumbnail as Media;
  const file = issue.file as Document;
  return (
    <>
      <Image
        alt={thumbnail.alt}
        className="w-full border-b-2 border-gray-900 object-cover object-center"
        height={thumbnail.height ?? undefined}
        src={thumbnail.url ?? TikLogo}
        width={thumbnail.width ?? undefined}
      />
      <a href={file.url ?? ""}>{issue.title}</a>
    </>
  );
}

export function MagazineList({
  magazine,
}: {
  magazine: Magazine;
}): JSX.Element {
  return (
    <>
      {magazine.issues?.map(({ issue }) => (
        <IssueCard
          issue={issue as MagazineIssue}
          key={(issue as MagazineIssue).id}
        />
      ))}
    </>
  );
}
