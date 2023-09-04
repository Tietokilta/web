import type { Access } from "payload/config";

export const loggedIn: Access = ({ req: { user } }) => Boolean(user);
