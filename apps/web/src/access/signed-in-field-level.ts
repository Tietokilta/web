import type { FieldAccess } from "payload";

export const signedInFieldLevel: FieldAccess = ({ req }) => Boolean(req.user);
