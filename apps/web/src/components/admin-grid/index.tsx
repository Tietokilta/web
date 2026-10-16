import Image from "next/image";
import type { JSX } from "react";
import type { Admin, AdminMember, Media } from "@payload-types";
import TikLogo from "../../assets/TiK-logo.png";
import { cn, insertSoftHyphens } from "../../lib/utils";

function AdminMemberCard({ adminMember }: { adminMember: AdminMember }) {
  const photo = adminMember.photo as Media | undefined;
  const name = adminMember.name.replace(/-/g, "‑"); // use non-breaking hyphens
  return (
    <li className="flex flex-col overflow-hidden rounded-md border-2 border-gray-900 font-mono shadow-solid">
      <div className="flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2">
        <div className="flex gap-1">
          <span className="size-2 rounded-full border border-gray-900 bg-secondary-600" />
          <span className="size-2 rounded-full border border-gray-900 bg-primary-600" />
        </div>
      </div>
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
      <p className="flex grow flex-col justify-center bg-gray-100 p-2 text-center text-balance">
        <span className="font-medium">{name}</span>
        <span className="text-sm">{insertSoftHyphens(adminMember.title)}</span>
      </p>
    </li>
  );
}

export function AdminGrid({ admin }: { admin: Admin }): JSX.Element {
  const groupPhoto = admin.groupPhoto as Media | undefined;
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
      <ul className="not-prose grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 md:-mx-8 md:gap-4 lg:-mx-32 lg:gap-6 xl:-mx-48 xl:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] xl:gap-8 2xl:-mx-64">
        {admin.adminMembers.map(({ adminMember }) => (
          <AdminMemberCard
            adminMember={adminMember as AdminMember}
            key={(adminMember as AdminMember).id}
          />
        ))}
      </ul>
    </>
  );
}
