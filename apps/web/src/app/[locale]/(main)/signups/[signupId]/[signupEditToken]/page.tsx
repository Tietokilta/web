/* eslint-disable no-nested-ternary -- I like */
import { notFound } from "next/navigation";
import { SignupStatus } from "@tietokilta/ilmomasiina-models";
import Link from "next/link";
import { Button } from "@tietokilta/ui";
import { type Metadata } from "next";
import { getMessages } from "next-intl/server";
import { getSignup } from "@lib/api/external/ilmomasiina";
import { getLocale, getTranslations } from "@locales/server";
import { NextIntlClientProvider } from "@locales/client";
import { SignupForm } from "./signup-form";

interface PageProps {
  params: Promise<{
    signupId: string;
    signupEditToken: string;
  }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;

  const { signupId, signupEditToken } = params;
  const locale = await getLocale();

  const signupInfo = await getSignup(signupId, signupEditToken, locale);
  const t = await getTranslations("ilmomasiina.form");

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
  const locale = await getLocale();

  const signupInfo = await getSignup(signupId, signupEditToken, locale);

  if (!signupInfo.ok && signupInfo.error === "ilmomasiina-signup-not-found") {
    notFound();
  }

  if (!signupInfo.ok) {
    throw new Error("Failed to fetch signup info");
  }

  const t = await getTranslations("ilmomasiina.form");
  const tAction = await getTranslations("action");
  const tp = await getTranslations("ilmomasiina.path");
  const messages = await getMessages();

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative flex max-w-4xl flex-col items-center gap-8 p-4 md:p-6">
        <Button className="self-start" type="button" variant="backLink" asChild>
          <Link
            href={`/${locale}/${tp("events")}/${signupInfo.data.event.slug}`}
          >
            {tAction("Back")}
          </Link>
        </Button>
        <hgroup className="space-y-4 text-pretty">
          <h1 className="font-mono text-2xl md:text-4xl">
            {t("Edit sign up")} - {signupInfo.data.event.title}
          </h1>
          <p>
            {signupInfo.data.signup.status === SignupStatus.IN_QUEUE
              ? t("You are in queue at position {position}", {
                  position: String(signupInfo.data.signup.position ?? "-"),
                })
              : signupInfo.data.signup.status === SignupStatus.IN_OPEN_QUOTA
                ? t(
                    "You are in the open quota at position {position}/{quotaSize}",
                    {
                      position: String(signupInfo.data.signup.position ?? "-"),
                      quotaSize: String(signupInfo.data.event.openQuotaSize),
                    },
                  )
                : signupInfo.data.signup.status === SignupStatus.IN_QUOTA
                  ? t(
                      "You are in the quota {quotaName} at position {position}/{quotaSize}",
                      {
                        quotaName: signupInfo.data.signup.quota.title,
                        position: String(
                          signupInfo.data.signup.position ?? "-",
                        ),
                        quotaSize: String(
                          signupInfo.data.signup.quota.size ?? "-",
                        ),
                      },
                    )
                  : t(
                      "You are in the quota {quotaName} at position {position}",
                      {
                        quotaName: signupInfo.data.signup.quota.title,
                        position: String(
                          signupInfo.data.signup.position ?? "-",
                        ),
                      },
                    )}
          </p>
        </hgroup>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SignupForm
            signupId={signupId}
            signupEditToken={signupEditToken}
            signup={signupInfo.data.signup}
            event={signupInfo.data.event}
          />
        </NextIntlClientProvider>
      </div>
    </main>
  );
}
