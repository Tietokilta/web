import payload from "payload";
import type {
  Board,
  Committee,
  BoardMember as BoardMemberType,
  CommitteeMember as CommitteeMemberType,
} from "@tietokilta/cms-types/payload";
import { parse } from "papaparse";
import { type PayloadRequest } from "payload/types";
import { CommitteeMembers } from "../collections/committees/committee-members";
import { BoardMembers } from "../collections/board/board-members";
import { Boards } from "../collections/board/boards";
import type { CommitteesSlug } from "../collections/committees/committees";

interface CommitteeMember {
  title: string;
  name: string;
}

function parseCSV(rawCsv: string): string[][] {
  const result = parse(rawCsv);
  return result.data as string[][];
}

function parseCommittees(
  data: string[][],
): Record<string, CommitteeMember[]> | undefined {
  const dataLength = data.length;
  const dataWidth = data[0].length;

  // Find where the header row is
  let headerIndex = 0;
  while (data[headerIndex]?.[0] !== "Hallitus" && headerIndex < dataLength)
    headerIndex++;

  if (headerIndex === dataLength - 1) {
    throw new Error("No header found");
  }

  const result: Record<string, CommitteeMember[]> = {};
  let committeeIndex = 0;
  let shouldContinue = true;

  while (shouldContinue) {
    const committeeMembers = [];
    const committeeName = data[headerIndex][committeeIndex];

    // Find all members of the committee
    let memberIndex = headerIndex + 2;
    while (
      memberIndex < dataLength &&
      data[memberIndex][committeeIndex]?.trim() !== ""
    ) {
      committeeMembers.push({
        title: data[memberIndex][committeeIndex],
        name: data[memberIndex][committeeIndex + 1],
      });
      memberIndex++;
    }

    result[committeeName] = committeeMembers;

    // Find where the next committee starts
    committeeIndex++;
    while (
      committeeIndex < dataWidth &&
      (data[headerIndex][committeeIndex] ?? "").trim() === ""
    ) {
      committeeIndex++;
    }

    if (committeeIndex >= dataWidth - 1) {
      shouldContinue = false;
    }
  }

  return result;
}

async function createCommittee(
  committeeName: string,
  members: CommitteeMember[],
  guildYear: Committee["year"],
  transactionID?: string,
): Promise<void> {
  const promises = [];
  for (const [index, member] of members.entries()) {
    if (member.name === "") continue;
    promises.push(
      payload.create({
        collection: CommitteeMembers.slug,
        data: {
          guildYear,
          name: member.name,
          title: member.title,
          chair: index === 0,
        },
        locale: "fi",
        req: transactionID
          ? ({
              transactionID,
            } as PayloadRequest)
          : undefined,
      }),
    );
  }

  const committeeMembers = (await Promise.all(promises)).map(
    (member: CommitteeMemberType) => ({ committeeMember: member.id }),
  );

  const collection: CommitteesSlug = "committees";
  await payload.create({
    collection,
    data: {
      year: guildYear,
      name: committeeName,
      committeeMembers,
    },
    locale: "fi",
    req: transactionID
      ? ({
          transactionID,
        } as PayloadRequest)
      : undefined,
  });
}

async function createBoard(
  members: CommitteeMember[],
  guildYear: Board["year"],
  transactionID?: string,
): Promise<void> {
  const promises = [];
  for (const member of members) {
    promises.push(
      payload.create({
        collection: BoardMembers.slug,
        data: {
          guildYear,
          name: member.name,
          title: member.title,
        },
        locale: "fi",
        req: transactionID
          ? ({
              transactionID,
            } as PayloadRequest)
          : undefined,
      }),
    );
  }

  const boardMembers = (await Promise.all(promises)).map(
    (member: BoardMemberType) => ({ boardMember: member.id }),
  );

  await payload.create({
    collection: Boards.slug,
    data: {
      year: guildYear,
      boardMembers,
    },
    locale: "fi",
    req: transactionID
      ? ({
          transactionID,
        } as PayloadRequest)
      : undefined,
  });
}

async function createCommittees(
  year: number,
  committees: Record<string, CommitteeMember[]>,
): Promise<void> {
  const collection: CommitteesSlug = "committees";
  const existingCommittees = await payload.find({
    collection,
    where: {
      year: {
        equals: year,
      },
    },
    pagination: false,
  });

  const existingBoards = await payload.find({
    collection: Boards.slug,
    where: {
      year: {
        equals: year,
      },
    },
    pagination: false,
  });

  if (existingCommittees.docs.length > 0 || existingBoards.docs.length > 0) {
    throw new Error("A committee already exists for this year");
  }

  const transactionID = (await payload.db.beginTransaction?.()) as
    | string
    | null;
  if (transactionID === null) {
    throw new Error("Failed to start transaction");
  }

  const committeesToBeCreated: Promise<void>[] = [];
  for (const [committeeName, members] of Object.entries(committees)) {
    if (committeeName.toLocaleLowerCase() === "hallitus") {
      committeesToBeCreated.push(
        createBoard(members, year.toString() as Board["year"], transactionID),
      );
    } else {
      committeesToBeCreated.push(
        createCommittee(
          committeeName,
          members,
          year.toString() as Committee["year"],
          transactionID,
        ),
      );
    }
  }
  await Promise.all(committeesToBeCreated);

  await payload.db.commitTransaction?.(transactionID);
}

export async function importCommittees(
  rawCsv: string,
  committeeYear: number,
): Promise<string> {
  try {
    const data = parseCSV(rawCsv);
    const committees = parseCommittees(data);
    if (!committees) {
      return "Failed to parse committees";
    }
    await createCommittees(committeeYear, committees);
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }
  return "";
}
