import type { Response } from "express";
import type { PayloadRequest } from "payload/types";
import { signedIn } from "../access/signed-in";
import { importCommittees } from "../util/import";

export const importController = async (
  req: PayloadRequest,
  res: Response,
): Promise<void> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
  }

  const { csv, year } = req.body as {
    csv: string;
    year: number;
  };

  if (!csv || !year) {
    res.sendStatus(400);
  }

  const success = await importCommittees(csv, year);

  if (success) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};
