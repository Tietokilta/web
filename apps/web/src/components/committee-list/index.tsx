import type { CommitteesYearBlockNode } from "@tietokilta/cms-types/lexical";
import { fetchCommittees } from "../../lib/api/committees";
import type { Locale } from "../../lib/dictionaries";
import { CommitteeCard } from "../committee-card";

export async function CommitteeList({
  year,
  lang,
}: {
  year: CommitteesYearBlockNode["fields"]["year"];
  lang: Locale;
}): Promise<JSX.Element | null> {
  const committees = await fetchCommittees({
    where: { year: { equals: year } },
    locale: lang,
  });

  if (!committees || committees.length === 0) {
    // eslint-disable-next-line no-console -- Nice to know if there is a missing year
    console.warn(`No committees found for year ${year}`);
    return null;
  }

  return (
    <>
      {committees.map((committee) => (
        <CommitteeCard committee={committee} key={committee.id} />
      ))}
    </>
  );
}
