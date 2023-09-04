import { Payload } from "payload";
import { defaultUser } from "./seedData/user";
/**
 * Runs the seeding process if the root user does not exist, otherwise skips it
 * @param payload Payload instance
 * @returns void
 */
export async function seedPayload(payload: Payload) {
  const alreadyExistsUser = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: defaultUser.email,
      },
    },
  });
  if (alreadyExistsUser.docs.length) {
    payload.logger.info("Root user already exists, skipping seeding");
    return;
  }

  payload.logger.info("Seeding root user");
  await payload.create<"users">({
    collection: "users",
    data: defaultUser,
  });
}
