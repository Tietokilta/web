/* eslint-disable no-nested-ternary -- I like */
import { notFound } from "next/navigation";
import { getSignup } from "../../../../../../lib/api/external/ilmomasiina";
import { openGraphImage } from "../../../../../shared-metadata";
import {
  deleteSignUpAction,
  saveSignUpAction,
} from "../../../../../../lib/api/external/ilmomasiina/actions";
import {
  getCurrentLocale,
  getScopedI18n,
} from "../../../../../../locales/server";
import { getLocalizedEventTitle } from "../../../../../../lib/utils";
import { SignupForm } from "./signup-form";

interface PageProps {
  params: Promise<{
    signupId: string;
    signupEditToken: string;
  }>;
}

export const generateMetadata = async (props: PageProps) => {
  const params = await props.params;

  const { signupId, signupEditToken } = params;

  const signupInfo = await getSignup(signupId, signupEditToken);
  const t = await getScopedI18n("ilmomasiina.form");

  if (!signupInfo.ok) {
    return {};
  }

  return {
    title: `${t("Edit sign up")} - ${signupInfo.data.event.title}`,
    description: signupInfo.data.event.description,
    openGraph: {
      ...openGraphImage,
    },
  };
};

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { signupId, signupEditToken } = params;

  const signupInfo = await getSignup(signupId, signupEditToken);

  if (!signupInfo.ok && signupInfo.error === "ilmomasiina-signup-not-found") {
    notFound();
  }

  if (!signupInfo.ok) {
    throw new Error("Failed to fetch signup info");
  }

  const locale = await getCurrentLocale();
  const t = await getScopedI18n("ilmomasiina.form");

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative flex max-w-4xl flex-col items-center gap-8 p-4 md:p-6">
        <hgroup className="space-y-4 text-pretty">
          <h1 className="font-mono text-2xl md:text-4xl">
            {t("Edit sign up")} -{" "}
            {getLocalizedEventTitle(signupInfo.data.event.title, locale)}
          </h1>
          <p>
            {signupInfo.data.signup.status === "in-queue"
              ? t("You are in queue at position {position}", {
                  position: signupInfo.data.signup.position,
                })
              : typeof signupInfo.data.signup.quota.size === "number"
                ? t(
                    "You are in the quota {quotaName} at position {position}/{quotaSize}",
                    {
                      quotaName: signupInfo.data.signup.quota.title,
                      position: signupInfo.data.signup.position,
                      quotaSize: signupInfo.data.signup.quota.size,
                    },
                  )
                : t("You are in the quota {quotaName} at position {position}", {
                    quotaName: signupInfo.data.signup.quota.title,
                    position: signupInfo.data.signup.position,
                  })}
          </p>
        </hgroup>
        <SignupForm
          signupId={signupId}
          signupEditToken={signupEditToken}
          signup={signupInfo.data.signup}
          event={signupInfo.data.event}
          saveAction={saveSignUpAction}
          deleteAction={deleteSignUpAction}
        />
      </div>
    </main>
  );
}
