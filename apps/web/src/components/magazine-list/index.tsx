import type {
  Magazine,
  MagazineIssue,
  Media,
  Document,
} from "@tietokilta/cms-types/payload";
import Image from "next/image";
import _ from "lodash";
import TikLogo from "../../assets/TiK-logo.png";

function IssueCard({ issue }: { issue: MagazineIssue }) {
  const thumbnail = issue.thumbnail as Media;
  const file = issue.file as Document;
  return (
    <div className="w-full max-w-xs sm:w-44">
      <a href={file.url ?? ""}>
        <Image
          alt={thumbnail.alt}
          className="aspect-[1/1.41] w-full object-contain object-bottom"
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
          className="not-prose shadow-solid dark:shadow-dark-fg dark:border-dark-fg relative my-8 flex overflow-hidden rounded-md border-2 border-gray-900 px-4 pb-6 pt-16 font-mono md:-mx-8 md:px-6 lg:-mx-32 xl:-mx-48 2xl:-mx-64"
        >
          <div className="absolute left-0 top-0 flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2">
            <div className="flex w-5 gap-1">
              <span className="bg-secondary-600 size-2 rounded-full border border-gray-900" />
              <span className="bg-primary-600 size-2 rounded-full border border-gray-900" />
            </div>
            <span className="self-center text-sm font-medium">{year}</span>
            <div className="w-5" />
          </div>
          <div className="flex max-w-[800px] flex-wrap justify-start gap-8">
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
