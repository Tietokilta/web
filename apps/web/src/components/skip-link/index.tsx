import { getScopedI18n } from "../../locales/server";

export async function SkipLink() {
  const t = await getScopedI18n("action");
  return (
    <a
      href="#main"
      className="sr-only z-[1000] block bg-white text-black focus-visible:not-sr-only focus-visible:fixed focus-visible:left-0 focus-visible:top-0 focus-visible:size-fit focus-visible:p-2 focus-visible:font-semibold"
    >
      {t("Skip to main content")}
    </a>
  );
}
