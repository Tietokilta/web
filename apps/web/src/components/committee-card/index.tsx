import type {
  Committee,
  CommitteeMember,
  Media,
} from "@tietokilta/cms-types/payload";
import Image from "next/image";
import TikLogo from "../../assets/TiK-logo.png";

function CommitteeMemberCard({
  committeeMember,
}: {
  committeeMember: CommitteeMember;
}) {
  const photo = committeeMember.photo as Media | undefined;
  return (
    <div className="w-full max-w-xs border-2 border-gray-900 sm:w-44">
      <Image
        alt={photo?.alt ?? ""}
        className="w-full border-b-2 border-gray-900 object-cover object-center"
        height={photo?.height ?? undefined}
        src={photo?.url ?? TikLogo}
        width={photo?.width ?? undefined}
      />
      <p className="flex flex-col bg-gray-100 text-center">
        <span className="text-lg font-medium">{committeeMember.name}</span>
        <span>{committeeMember.title}</span>
      </p>
    </div>
  );
}

export function CommitteeCard({
  committee,
}: {
  committee: Committee;
}): JSX.Element {
  return (
    <ul className="not-prose shadow-solid relative my-8 flex overflow-hidden rounded-md border-2 border-gray-900 px-4 pb-6 pt-12 font-mono md:-mx-16 md:px-6 lg:-mx-32 xl:-mx-48 2xl:-mx-64">
      <div className="absolute left-0 top-0 flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2">
        <div className="flex w-5 gap-1">
          <span className="bg-secondary-600 h-2 w-2 rounded-full border border-gray-900" />
          <span className="bg-primary-600 h-2 w-2 rounded-full border border-gray-900" />
        </div>
        <span className="self-center text-sm font-medium">
          {committee.name}
        </span>
        <div className="w-5" />
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {committee.committeeMembers.map(({ committeeMember }) => (
          <CommitteeMemberCard
            committeeMember={committeeMember as CommitteeMember}
            key={(committeeMember as CommitteeMember).id}
          />
        ))}
      </div>
    </ul>
  );
}
