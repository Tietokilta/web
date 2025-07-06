import Image from "next/image";
import type { JSX } from "react";
import {
  ChevronDownIcon,
  GavelIcon,
  GmailIcon,
  TelegramIcon,
} from "@tietokilta/ui";
import type { Committee, CommitteeMember, Media } from "@payload-types";
import TikLogo from "../../assets/TiK-logo.png";
import { cn, insertSoftHyphens } from "../../lib/utils";

function CommitteeMemberCard({
  committeeMember,
}: {
  committeeMember: CommitteeMember;
}) {
  const photo = committeeMember.photo as Media | undefined;
  const isChair = !!committeeMember.chair;
  const name = committeeMember.name.replace(/-/g, "\u2011"); // use non-breaking hyphens
  const parseTG = (username: string) => username.replace("@", "");
  return (
    <li className="relative flex flex-col border-2 border-gray-900">
      <Image
        alt={photo?.alt ?? ""}
        className={cn(
          "h-48 w-full border-b-2 border-gray-900 object-center",
          photo?.url ? "object-cover" : "bg-gray-100 object-contain",
        )}
        height={photo?.height ? Math.trunc(photo.height) : undefined}
        src={photo?.url ?? TikLogo}
        width={photo?.width ? Math.trunc(photo.width) : undefined}
      />
      {isChair ? <GavelIcon className="absolute left-0 top-0 size-6" /> : null}
      <p className="flex grow flex-col justify-center text-balance bg-gray-100 text-center">
        <span className="font-medium">{name}</span>
        <span className="text-sm">
          {insertSoftHyphens(committeeMember.title)}
        </span>
        <span className="flex items-center justify-center space-x-2">
          {committeeMember.email ? (
            <span className="m-1 text-sm">
              <a
                className="flex items-center gap-1"
                href={`mailto:${committeeMember.email}`}
              >
                <span className="sr-only">
                  {committeeMember.name} Email: {committeeMember.email}
                </span>
                <GmailIcon className="size-6 shrink-0" />
              </a>
            </span>
          ) : null}
          {committeeMember.telegramUsername ? (
            <span className="m-1 text-sm">
              <a
                className="flex items-center gap-1"
                href={`https://t.me/${parseTG(committeeMember.telegramUsername)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="sr-only">
                  {committeeMember.name} Telegram:{" "}
                  {parseTG(committeeMember.telegramUsername)}
                </span>
                <TelegramIcon className="size-6 shrink-0" />
              </a>
            </span>
          ) : null}
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
        "not-prose shadow-solid relative my-6 flex overflow-hidden rounded-md border-2 border-gray-900 px-2 pt-11 font-mono md:my-8 md:px-4 lg:px-6",
        !isTightLayout && "md:-mx-8 lg:-mx-32 xl:-mx-48 2xl:-mx-64",
      )}
    >
      <details open className="group w-full">
        <summary className="absolute left-0 top-0 flex w-full cursor-pointer justify-between border-b-2 border-gray-900 bg-gray-100 p-2 [&::-webkit-details-marker]:hidden [&::marker]:hidden">
          <span className="flex w-5 gap-1 sm:w-8">
            <span className="bg-secondary-600 size-2 rounded-full border border-gray-900 sm:size-3" />
            <span className="bg-primary-600 size-2 rounded-full border border-gray-900 sm:size-3" />
          </span>
          <h2 className="self-center truncate font-medium">{committee.name}</h2>
          <ChevronDownIcon className="size-6 transition-all group-open:rotate-180" />
        </summary>
        <ul className="my-6 grid w-full grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lg:gap-6 xl:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] xl:gap-8">
          {committee.committeeMembers.map(({ committeeMember }) => {
            if (!committeeMember) {
              // eslint-disable-next-line no-console -- For debugging
              console.error(
                `Committee ${committee.name} contains a committee member with no value`,
              );
              return null;
            }
            return (
              <CommitteeMemberCard
                committeeMember={committeeMember as CommitteeMember}
                key={(committeeMember as CommitteeMember).id}
              />
            );
          })}
        </ul>
      </details>
    </section>
  );
}
