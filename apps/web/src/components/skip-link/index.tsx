import { getTranslations } from "@locales/server";

export async function SkipLink() {
  const t = await getTranslations("action");
  return (
    <a
      href="#main"
      className="sr-only z-1000 block bg-white text-black focus-visible:not-sr-only focus-visible:fixed focus-visible:top-[env(safe-area-inset-top)] focus-visible:left-[env(safe-area-inset-left)] focus-visible:size-fit focus-visible:p-2 focus-visible:font-semibold"
    >
      {t("Skip to main content")}
    </a>
  );
}
