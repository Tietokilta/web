import { redirect } from "next/navigation";

interface PageProps {
  params: {
    ilmomasiinaPath: string[];
  };
}

const ilmomasiinaBaseUrl =
  process.env.PUBLIC_ILMOMASIINA_URL ?? "https://ilmo.tietokilta.fi";

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

export default function Page({ params: { ilmomasiinaPath } }: PageProps) {
  const url = new URL(
    ilmomasiinaPath
      .map((segment) => getReplacement(segment) ?? segment)
      .join("/"),
    ilmomasiinaBaseUrl,
  );
  return redirect(url.toString());
}
