import type { Access } from "payload/config";

export const publishedOrSignedIn: Access = ({ req: { user } }) => {
  if (user) {
    return true;
  }
  return {
    or: [
      {
        _status: {
          equals: "published",
        },
      },
      {
        _status: {
          exists: false,
        },
      },
    ],
  };
};
