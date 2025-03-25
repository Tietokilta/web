import type { Access } from "payload";

export const publishedAndVisibleOrSignedIn: Access = ({ req: { user } }) => {
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
