import type { Board, BoardMember, Media } from "@tietokilta/cms-types/payload";
import { GmailIcon, TelegramIcon } from "@tietokilta/ui";
import Image from "next/image";
import TikLogo from "../../assets/TiK-logo.png";
import { cn } from "../../lib/utils";

function BoardMemberCard({ boardMember }: { boardMember: BoardMember }) {
  const photo = boardMember.photo as Media | undefined;
  return (
    <li className="shadow-solid relative flex gap-4 overflow-hidden rounded-md border-2 border-gray-900 px-4 pb-6 pt-12 font-mono md:px-6">
      <div className="absolute left-0 top-0 flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2">
        <div className="flex gap-1">
          <span className="bg-secondary-600 h-2 w-2 rounded-full border border-gray-900" />
          <span className="bg-primary-600 h-2 w-2 rounded-full border border-gray-900" />
        </div>
      </div>
      <Image
        alt={photo?.alt ?? ""}
        className={cn(
          "aspect-2/3 max-w-32 border-2 border-gray-900 object-center",
          photo?.url ? "object-cover" : "object-contain",
        )}
        height={photo?.height ?? undefined}
        src={photo?.url ?? TikLogo}
        width={photo?.width ?? undefined}
      />
      <div className="flex flex-col justify-between gap-4">
        <p className="flex flex-col">
          <span className="text-lg font-medium">{boardMember.name}</span>
          <span>{boardMember.title}</span>
        </p>
        <p className="flex flex-col gap-2 text-sm">
          <a
            className="flex items-center gap-1"
            href={`mailto:${boardMember.email}`}
          >
            <GmailIcon className="h-6 w-6 shrink-0" />
            <span className="underline">
              {boardMember.email.replace("@", "\u200b@")}
            </span>
          </a>
          <a
            className="flex items-center gap-1"
            href={`https://t.me/${boardMember.telegram}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <TelegramIcon className="h-6 w-6 shrink-0" />
            <span className="underline">{boardMember.telegram}</span>
          </a>
        </p>
      </div>
    </li>
  );
}

export function BoardGrid({ board }: { board: Board }): JSX.Element {
  const groupPhoto = board.groupPhoto as Media | undefined;
  return (
    <>
      {groupPhoto ? (
        <Image
          alt={groupPhoto.alt}
          className="rounded-md border-2 border-gray-900"
          height={groupPhoto.height ?? 0}
          src={groupPhoto.url ?? "#broke-url"}
          width={groupPhoto.width ?? 0}
        />
      ) : null}
      <ul className="not-prose grid grid-cols-1 items-center justify-center gap-4 md:-mx-16 md:grid-flow-row-dense md:grid-cols-2 md:gap-6 lg:-mx-32 xl:-mx-48 2xl:-mx-64">
        {board.boardMembers.map(({ boardMember }) => (
          <BoardMemberCard
            boardMember={boardMember as BoardMember}
            key={(boardMember as BoardMember).id}
          />
        ))}
      </ul>
    </>
  );
}
