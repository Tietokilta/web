import type {
  CollectionSlug,
  Field,
  PayloadHandler,
  PayloadRequest,
  Validate,
} from "payload";
import { signedIn } from "../access/signed-in";

type CommitteeCollection = "committees" | "committee-members";

export interface ValidationIssue {
  collection: CommitteeCollection;
  id: string;
  label: string;
  path: string;
  message: string;
}

export interface ValidationResult {
  /** `null` when all years were validated. */
  year: string | null;
  committeeCount: number;
  committeeMemberCount: number;
  issues: ValidationIssue[];
}

type Doc = Record<string, unknown>;
type Problem = [path: string, message: string];

const isRecord = (value: unknown): value is Doc =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const checkReference = async (
  req: PayloadRequest,
  relationTo: string,
  id: string,
): Promise<string | undefined> => {
  const { totalDocs } = await req.payload.count({
    collection: relationTo as CollectionSlug,
    where: { id: { equals: id } },
  });
  return totalDocs === 0
    ? `Referenced ${relationTo} document ${id} does not exist`
    : undefined;
};

const validateDoc = async (
  req: PayloadRequest,
  collection: CommitteeCollection,
  doc: Doc,
): Promise<Problem[]> => {
  const problems: Problem[] = [];

  const walk = async (
    fields: Field[],
    siblingData: Doc,
    parentPath: (string | number)[],
  ): Promise<void> => {
    for (const field of fields) {
      if (field.type === "ui" || !("name" in field)) continue;

      const path = [...parentPath, field.name];
      const value = siblingData[field.name];

      let message: string | true | undefined;
      if (
        field.type === "relationship" &&
        typeof field.relationTo === "string" &&
        typeof value === "string"
      ) {
        message = await checkReference(req, field.relationTo, value);
      }
      const validate = field.validate as Validate | undefined;
      message ??= await validate?.(value, {
        ...field,
        blockData: {},
        collectionSlug: collection,
        data: doc,
        event: "submit",
        id: typeof doc.id === "string" ? doc.id : undefined,
        operation: "update",
        overrideAccess: true,
        path,
        preferences: { fields: {} },
        req,
        siblingData,
      } as Parameters<Validate>[1]);
      if (typeof message === "string") {
        problems.push([path.join("."), message]);
      }

      if (field.type === "array" && Array.isArray(value)) {
        for (const [index, row] of value.entries()) {
          if (isRecord(row)) {
            await walk(field.fields, row, [...path, index]);
          }
        }
      }
    }
  };

  await walk(req.payload.collections[collection].config.fields, doc, []);
  return problems;
};

const validateCollection = async (
  req: PayloadRequest,
  collection: CommitteeCollection,
  yearField: string,
  year: string | null,
  issues: ValidationIssue[],
): Promise<number> => {
  const { docs } = await req.payload.find({
    collection,
    where: year === null ? undefined : { [yearField]: { equals: year } },
    depth: 0,
    pagination: false,
  });

  for (const doc of docs as unknown as Doc[]) {
    const id = String(doc.id);
    const name = typeof doc.name === "string" ? doc.name : id;
    const label = `${String(doc[yearField])}: ${name}`;

    for (const [path, message] of await validateDoc(req, collection, doc)) {
      issues.push({ collection, id, label, path, message });
    }
  }
  return docs.length;
};

export const validateCommitteesController: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return new Response(null, { status: 401 });
  }

  const body = (await req.json?.().catch(() => undefined)) as
    | { year?: string | number; all?: boolean }
    | undefined;
  const year = body?.all === true ? null : String(body?.year ?? "");
  if (year !== null && !/^\d{4}$/.test(year)) {
    return new Response("Invalid year", { status: 400 });
  }

  const issues: ValidationIssue[] = [];
  const committeeCount = await validateCollection(
    req,
    "committees",
    "year",
    year,
    issues,
  );
  const committeeMemberCount = await validateCollection(
    req,
    "committee-members",
    "guildYear",
    year,
    issues,
  );

  return Response.json({
    year,
    committeeCount,
    committeeMemberCount,
    issues,
  } satisfies ValidationResult);
};
