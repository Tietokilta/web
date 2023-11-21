import session from "express-session";
import jwt from "jsonwebtoken";
import passport from "passport";
import OAuth2Strategy, { VerifyCallback } from "passport-oauth2";
import { Config } from "payload/config";
import { PaginatedDocs } from "payload/database";
import getCookieExpiration from "payload/dist/utilities/getCookieExpiration";
import { Field, fieldAffectsData, fieldHasSubFields } from "payload/types";

import type { oAuthPluginOptions } from "./types";
import type { Payload } from "payload";
// very fancy chatGPT code
function genRandomPassword(size: number) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  const charsetLength = charset.length;
  const array = new Uint8Array(size);

  crypto.getRandomValues(array);

  for (let i = 0; i < size; i++) {
    password += charset.charAt(array[i] % charsetLength);
  }

  return password;
}

function validateUser(user: unknown): user is User & Record<string, unknown> {
  return (
    typeof user === "object" &&
    user !== null &&
    "email" in user &&
    typeof user.email === "string" &&
    "id" in user &&
    typeof user.id === "string"
  );
}

let payload: Payload;

interface User {
  email?: string;
  id?: string;
}

function oAuthPluginServer(
  incoming: Config,
  options: oAuthPluginOptions,
): Config {
  // Shorthands
  const callbackPath =
    options.callbackPath ??
    (options.callbackURL && new URL(options.callbackURL).pathname) ??
    "/oauth2/callback";
  const authorizePath = options.authorizePath ?? "/oauth2/authorize";
  const collectionSlug = options.userCollection?.slug ?? "users";
  const sub = options.subField?.name ?? "sub";

  // Passport strategy
  if (options.clientID) {
    const strategy = new OAuth2Strategy(
      options,
      async (
        accessToken: string,
        refreshToken: string,
        profile: undefined,
        cb: VerifyCallback,
      ) => {
        let info: {
          sub: string;
          email: string;
          password?: string;
          name?: string;
        };
        let user: User & {
          // dirty fix for the user collection not being defined, but it is fixed with the ? operator
          collection?: NonNullable<
            oAuthPluginOptions["userCollection"]
          >["slug"];
          _strategy?: string;
        };
        let users: PaginatedDocs<User>;
        try {
          // Get the userinfo
          info = await options.userinfo?.(accessToken);
          if (!info) throw new Error("Failed to get userinfo");
          // Match existing user
          users = await payload.find({
            collection: collectionSlug,
            where: { [sub]: { equals: info[sub as "sub"] } },
            showHiddenFields: true,
          });

          if (users.docs?.length) {
            user = users.docs[0];
            user.collection = collectionSlug;
            user._strategy = "oauth2";
          } else {
            // Register new user
            user = await payload.create({
              collection: collectionSlug,
              data: {
                ...info,
                // Stuff breaks when password is missing
                password: info.password ?? genRandomPassword(30),
              },
              showHiddenFields: true,
            });
            payload.logger.info(`Created user ${user.email}`);
            user.collection = collectionSlug;
            user._strategy = "oauth2";
          }

          cb(null, user);
        } catch (error) {
          if (error instanceof Error && "trace" in error) {
            // eslint-disable-next-line no-console
            console.log("signin.fail", error.message, error.trace);
            cb(error);
          }
        }
      },
    );

    // Alternative?
    // strategy.userProfile = async (accessToken, cb) => {
    //   const user = await options.userinfo?.(accessToken)
    //   if (!user) cb(new Error('Failed to get userinfo'))
    //   else cb(null, user)
    // }

    passport.use(strategy);
  } else {
    // eslint-disable-next-line no-console
    console.warn("No client id, oauth disabled");
  }
  // passport.serializeUser((user: Express.User, done) => {
  passport.serializeUser((user: Express.User & User, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: string, done) => {
    const ok = await payload.findByID({ collection: collectionSlug, id });
    done(null, ok);
  });

  return {
    ...incoming,
    onInit: async (incomingPayload) => {
      if (incoming.onInit) await incoming.onInit(incomingPayload);
      // Add additional onInit code by using the onInitExtension function
      payload = incomingPayload;
    },
    endpoints: (incoming.endpoints ?? []).concat([
      {
        path: authorizePath,
        method: "get",
        root: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        handler: passport.authenticate("oauth2"),
      },
      {
        path: callbackPath,
        method: "get",
        root: true,
        handler: session(options.sessionOptions),
      },
      {
        path: callbackPath,
        method: "get",
        root: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        handler: passport.authenticate("oauth2", { failureRedirect: "/" }),
      },
      {
        path: callbackPath,
        method: "get",
        root: true,
        handler(req, res) {
          // Get the Mongoose user
          const collectionConfig = payload.collections[collectionSlug].config;

          // Sanitize the user object
          // let user = userDoc.toJSON({ virtuals: true })
          const user = JSON.parse(JSON.stringify(req.user));
          if (!validateUser(user)) {
            throw new Error("Invalid user");
          }
          // Decide which user fields to include in the JWT
          // Why is this done this way?
          const fieldsToSign = collectionConfig.fields.reduce(
            (signedFields, field: Field) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const result: Record<string, unknown> = {
                ...signedFields,
              };

              if (!fieldAffectsData(field) && fieldHasSubFields(field)) {
                field.fields.forEach((subField) => {
                  if (fieldAffectsData(subField) && subField.saveToJWT) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    result[subField.name] = user[subField.name];
                  }
                });
              }

              if (fieldAffectsData(field) && field.saveToJWT) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                result[field.name] = user[field.name];
              }

              return result;
            },
            {
              email: user.email,
              id: user.id,
              collection: collectionConfig.slug,
            } as object,
          );

          // Sign the JWT
          const token = jwt.sign(fieldsToSign, payload.secret, {
            expiresIn: collectionConfig.auth.tokenExpiration,
          });

          // Set cookie
          res.cookie(`${payload.config.cookiePrefix}-token`, token, {
            path: "/",
            httpOnly: true,
            expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
            secure: collectionConfig.auth.cookies.secure,
            sameSite: collectionConfig.auth.cookies.sameSite,
            domain: collectionConfig.auth.cookies.domain || undefined,
          });

          // Redirect to admin dashboard
          res.redirect("/admin");
        },
      },
    ]),
  };
}
export default oAuthPluginServer;
