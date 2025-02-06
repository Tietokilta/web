import type { CommitteesYearBlockNode } from "@tietokilta/cms-types/lexical";
import type { JSX } from "react";
import { fetchCommittees } from "../../lib/api/committees";
import { CommitteeCard } from "../committee-card";
import { getCurrentLocale } from "../../locales/server";

export async function CommitteeList({
  year,
}: {
  year: CommitteesYearBlockNode["fields"]["year"];
}): Promise<JSX.Element | null> {
  const locale = await getCurrentLocale();
  const committees = await fetchCommittees({
    where: { year: { equals: year }, hidden: { not_equals: true } },
    locale,
  });

  if (!committees || committees.length === 0) {
    // eslint-disable-next-line no-console -- Nice to know if there is a missing year
    console.warn(`No committees found for year ${year}`);
    return null;
  }

  return (
    <>
      {committees
        .sort((a, b) => {
          // Puts others as last element in the list.
          const others = ["muut", "others"];
          const isAOthers = others.includes(a.name.toLowerCase());
          const isBOthers = others.includes(b.name.toLowerCase());
          if (isBOthers) return -1;
          if (isAOthers) return 1;
          return a.name.localeCompare(b.name, locale);
        })
        .map((committee) => (
          <CommitteeCard committee={committee} key={committee.id} />
        ))}
    </>
  );
}
