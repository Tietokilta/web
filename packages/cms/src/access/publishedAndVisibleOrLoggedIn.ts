import type { Access } from "payload/config";

export const publishedAndVisibleOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
    hidden: {
      equals: false,
    },
  };
};
