import type { PayloadHandler } from "payload";
import { signedIn } from "../access/signed-in";
import { importCommittees } from "../util/import";

export const committeesImportController: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return new Response(null, { status: 401 });
  }

  const data = (await req.json?.()) as {
    csv: string;
    year: number;
  };
  const { csv, year } = data;

  if (!csv || !year) {
    return new Response("Missing required fields", { status: 400 });
  }

  const error = await importCommittees(csv, year);

  if (!error) {
    return new Response(null, { status: 200 });
  }
  return new Response(error, { status: 500 });
};
