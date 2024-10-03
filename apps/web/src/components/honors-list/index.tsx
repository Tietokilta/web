import type { AwardedHonor, Honor } from "@tietokilta/cms-types/payload";
import { ChevronDownIcon } from "@tietokilta/ui";
import _ from "lodash";

function AwardedPersonDropdown({
  awardedPerson,
}: {
  awardedPerson: AwardedHonor;
}) {
  return (
    <div className="not-prose shadow-solid relative my-4 flex overflow-hidden rounded-md border-2 border-gray-900 px-2 pt-11 font-mono md:px-3">
      <details className="group contents">
        <summary
          className={`absolute left-0 top-0 flex w-full ${awardedPerson.description ? "cursor-pointer" : ""} justify-between border-b-2 border-gray-900 bg-gray-100 p-2 md:px-3 [&::-webkit-details-marker]:hidden [&::marker]:hidden`}
        >
          <p className="self-center truncate font-medium">
            {awardedPerson.name}
          </p>
          {awardedPerson.description && (
            <ChevronDownIcon className="size-6 transition-all group-open:rotate-180" />
          )}
        </summary>
        {awardedPerson.description && (
          <div className="text-md py-2">
            <p>{awardedPerson.description}</p>
          </div>
        )}
      </details>
    </div>
  );
}

function YearGroup({
  year,
  awardedPersons,
}: {
  year: number;
  awardedPersons: AwardedHonor[];
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-4 text-xl font-semibold">{year}</h3>
      <div className="space-y-4">
        {awardedPersons.map((person) => (
          <AwardedPersonDropdown awardedPerson={person} key={person.id} />
        ))}
      </div>
    </div>
  );
}

export function HonorsList({ honor }: { honor: Honor }): JSX.Element {
  const awardedPersons = honor.awardedHonors.map(
    (item) => item.awardedHonor as AwardedHonor,
  );
  const awardsByYear = _.groupBy(
    awardedPersons,
    (awardedPerson) => (awardedPerson as AwardedHonor).guildYear,
  );
  const years = _.uniq(
    awardedPersons.map(
      (awardedPerson) => (awardedPerson as AwardedHonor).guildYear,
    ),
  ).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-8">
      {Object.entries(years).map((awardYear) => (
        <YearGroup
          year={parseInt(awardYear[1])}
          awardedPersons={awardsByYear[awardYear[1]]}
          key={awardYear[1]}
        />
      ))}
    </div>
  );
}
