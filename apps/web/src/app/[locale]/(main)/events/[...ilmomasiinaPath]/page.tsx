import { redirect } from "next/navigation";
import { env } from "../../../../../env";

interface PageProps {
  params: Promise<{
    ilmomasiinaPath: string[];
  }>;
}

const ilmomasiinaBaseUrl = env.NEXT_PUBLIC_ILMOMASIINA_URL;

/** workaround some ilmomasiina purkka */
const languageMappings = {
  ilmo: "signup",
} as const;

const getReplacement = (key: string) => {
  if (key in languageMappings) {
    return languageMappings[key as Key];
  }
};

type Key = keyof typeof languageMappings;

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { ilmomasiinaPath } = params;

  const url = new URL(
    ilmomasiinaPath
      .map((segment) => getReplacement(segment) ?? segment)
      .join("/"),
    ilmomasiinaBaseUrl,
  );
  return redirect(url.toString());
}
