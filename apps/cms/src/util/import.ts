import payload from "payload";
import type {
  Committee,
  CommitteeMember as CommitteeMemberType,
} from "@tietokilta/cms-types/payload";
import type { PayloadRequest } from "payload/types";
import { CommitteeMembers } from "../collections/committees/committee-members";

interface CommitteeMember {
  title: string;
  name: string;
}

function parseCSV(rawCsv: string): string[][] {
  return rawCsv.split("\n").map((line) => line.split(","));
}

function parseCommittees(
  data: string[][],
): Record<string, CommitteeMember[]> | undefined {
  const dataLength = data.length;
  const dataWidth = data[0].length;

  // Find where the header row is
  let headerIndex = 0;
  while (data[headerIndex][0] !== "Hallitus" && headerIndex < dataLength)
    headerIndex++;

  if (headerIndex === dataLength - 1) {
    payload.logger.error("No header found");
    return;
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
      data[memberIndex][committeeIndex].trim() !== ""
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

async function createCommittees(
  year: number,
  committees: Record<string, CommitteeMember[]>,
): Promise<boolean> {
  const existingCommittees = await payload.find({
    collection: "committees",
    where: {
      year: {
        equals: year,
      },
    },
    pagination: false,
  });

  if (existingCommittees.docs.length > 0) {
    payload.logger.error("A committee already exists for this year");
    return false;
  }

  const transactionID = await payload.db.beginTransaction?.();
  if (transactionID === null) {
    payload.logger.error("Failed to start transaction");
    return false;
  }

  for (const [committeeName, members] of Object.entries(committees)) {
    const promises = [];
    for (const member of members) {
      promises.push(
        payload.create({
          collection: CommitteeMembers.slug,
          data: {
            guildYear: year.toString() as CommitteeMemberType["guildYear"],
            name: member.name,
            title: member.title,
          },
          locale: "fi",
          req: {
            transactionID,
          } as PayloadRequest,
        }),
      );
    }

    const committeeMembers = (await Promise.all(promises)).map(
      (member: CommitteeMemberType) => ({ id: member.id }),
    );

    await payload.create({
      collection: "committees",
      data: {
        year: year.toString() as Committee["year"],
        name: committeeName,
        committeeMembers,
      },
    });
  }

  return true;
}

export async function importCommittees(
  rawCsv: string,
  committeeYear: number,
): Promise<boolean> {
  const data = parseCSV(rawCsv);
  const committees = parseCommittees(data);
  if (!committees) {
    return false;
  }

  await createCommittees(committeeYear, committees);
  return true;
}
