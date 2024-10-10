import type {
  Document,
  Magazine,
  MagazineIssue,
  Media,
} from "@tietokilta/cms-types/payload";
import _ from "lodash";
import Image from "next/image";
import TikLogo from "../../assets/TiK-logo.png";

function IssueCard({ issue }: { issue: MagazineIssue }) {
  const thumbnail = issue.thumbnail as Media;
  const file = issue.file as Document;
  return (
    <div className="w-full max-w-xs min-[460px]:w-44">
      <a href={file.url ?? ""}>
        <Image
          alt={thumbnail.alt}
          height={thumbnail.height ?? undefined}
          src={thumbnail.url ?? TikLogo}
          width={thumbnail.width ?? undefined}
        />
        <p className="text-balance">{issue.title}</p>
      </a>
    </div>
  );
}

export function MagazineList({
  magazine,
}: {
  magazine: Magazine;
}): React.ReactNode {
  if (magazine.type !== "Alkorytmi" || !magazine.issues) return null;

  const issuesByYear = _.groupBy(
    magazine.issues,
    (issue) => (issue.issue as MagazineIssue).year,
  );

  const years = _.uniq(
    magazine.issues.map((issue) => (issue.issue as MagazineIssue).year),
  ).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      {years.map((year) => (
        <ul
          key={year}
          className="not-prose shadow-solid relative my-8 flex overflow-hidden rounded-md border-2 border-gray-900 px-4 pb-6 pt-16 font-mono md:-mx-8 md:px-6 lg:-mx-32 xl:-mx-48 2xl:-mx-64"
        >
          <div className="absolute left-0 top-0 flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2">
            <div className="flex w-5 gap-1">
              <span className="bg-secondary-600 size-2 rounded-full border border-gray-900" />
              <span className="bg-primary-600 size-2 rounded-full border border-gray-900" />
            </div>
            <span className="self-center text-sm font-medium">{year}</span>
            <div className="w-5" />
          </div>
          <div className="grid max-w-64 grid-cols-1 items-baseline gap-8 min-[460px]:max-w-none min-[460px]:grid-cols-2 min-[660px]:grid-cols-3 lg:grid-cols-4">
            {issuesByYear[year]
              .sort(
                (a, b) =>
                  Number((a.issue as MagazineIssue).issueNumber) -
                  Number((b.issue as MagazineIssue).issueNumber),
              )
              .map(({ issue }) => (
                <IssueCard
                  issue={issue as MagazineIssue}
                  key={(issue as MagazineIssue).id}
                />
              ))}
          </div>
        </ul>
      ))}
    </>
  );
}
