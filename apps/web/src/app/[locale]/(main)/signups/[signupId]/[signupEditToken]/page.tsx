/* eslint-disable no-nested-ternary -- I like */
import { notFound } from "next/navigation";
import { SignupStatus } from "@tietokilta/ilmomasiina-models";
import { getSignup } from "@lib/api/external/ilmomasiina";
import { getCurrentLocale, getScopedI18n } from "@locales/server";
import { getLocalizedEventTitle } from "@lib/utils";
import { I18nProviderClient } from "@locales/client";
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
    robots: {
      index: false,
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
            {signupInfo.data.signup.status === SignupStatus.IN_QUEUE
              ? t("You are in queue at position {position}", {
                  position: signupInfo.data.signup.position,
                })
              : signupInfo.data.signup.status === SignupStatus.IN_OPEN_QUOTA
                ? t(
                    "You are in the open quota at position {position}/{quotaSize}",
                    {
                      position: signupInfo.data.signup.position,
                      quotaSize: signupInfo.data.event.openQuotaSize,
                    },
                  )
                : signupInfo.data.signup.status === SignupStatus.IN_QUOTA
                  ? t(
                      "You are in the quota {quotaName} at position {position}/{quotaSize}",
                      {
                        quotaName: signupInfo.data.signup.quota.title,
                        position: signupInfo.data.signup.position,
                        quotaSize: signupInfo.data.signup.quota.size,
                      },
                    )
                  : t(
                      "You are in the quota {quotaName} at position {position}",
                      {
                        quotaName: signupInfo.data.signup.quota.title,
                        position: signupInfo.data.signup.position,
                      },
                    )}
          </p>
        </hgroup>
        <I18nProviderClient locale={locale}>
          <SignupForm
            signupId={signupId}
            signupEditToken={signupEditToken}
            signup={signupInfo.data.signup}
            event={signupInfo.data.event}
          />
        </I18nProviderClient>
      </div>
    </main>
  );
}
