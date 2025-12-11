import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value;
  const locale = cookieLocale || "en";

  return {
    locale,
    messages: (await import(`../locales/${locale}`)).default,
  };
});
