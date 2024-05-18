import type {
  Committee,
  CommitteeMember,
  Media,
} from "@tietokilta/cms-types/payload";
import Image from "next/image";
import { GavelIcon } from "@tietokilta/ui";
import TikLogo from "../../assets/TiK-logo.png";
import { cn, insertSoftHyphens } from "../../lib/utils";

function CommitteeMemberCard({
  committeeMember,
}: {
  committeeMember: CommitteeMember;
}) {
  const photo = committeeMember.photo as Media | undefined;
  const isChair = !!committeeMember.chair;

  return (
    <li className="relative flex w-full max-w-xs flex-col border-2 border-gray-900 sm:w-44">
      <Image
        alt={photo?.alt ?? ""}
        className="w-full border-b-2 border-gray-900 object-cover object-center"
        height={photo?.height ? Math.trunc(photo.height) : undefined}
        src={photo?.url ?? TikLogo}
        width={photo?.width ? Math.trunc(photo.width) : undefined}
      />
      {isChair ? <GavelIcon className="absolute left-0 top-0 h-6 w-6" /> : null}
      <p className="flex flex-1 flex-col bg-gray-100 text-center">
        <span className="font-medium">{committeeMember.name}</span>
        <span className="text-sm">
          {insertSoftHyphens(committeeMember.title)}
        </span>
      </p>
    </li>
  );
}

export function CommitteeCard({
  committee,
  isTightLayout = false,
}: {
  committee: Committee;
  isTightLayout?: boolean;
}): JSX.Element {
  return (
    <section
      className={cn(
        "not-prose shadow-solid relative my-8 flex overflow-hidden rounded-md border-2 border-gray-900 px-4 pb-6 pt-16 font-mono md:px-6",
        !isTightLayout && "md:-mx-8 lg:-mx-32 xl:-mx-48 2xl:-mx-64",
      )}
    >
      <div className="absolute left-0 top-0 flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2">
        <div className="flex w-8 gap-1">
          <div className="bg-secondary-600 h-3 w-3 rounded-full border border-gray-900" />
          <div className="bg-primary-600 h-3 w-3 rounded-full border border-gray-900" />
        </div>
        <h2 className="self-center font-medium">{committee.name}</h2>
        <div className="w-5" />
      </div>
      <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
        {committee.committeeMembers.map(({ committeeMember }) => (
          <CommitteeMemberCard
            committeeMember={committeeMember as CommitteeMember}
            key={(committeeMember as CommitteeMember).id}
          />
        ))}
      </ul>
    </section>
  );
}
