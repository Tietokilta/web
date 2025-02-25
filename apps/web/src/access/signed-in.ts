import type { Access } from "payload/config";

export const signedIn: Access = ({ req }) => Boolean(req.user);
