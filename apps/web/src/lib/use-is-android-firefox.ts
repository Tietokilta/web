"use client";

import { useEffect, useState } from "react";

/**
 * Detects if the user is on Android Firefox (GeckoView).
 *
 * This is needed because Firefox on Android doesn't show HTML5 form validation
 * bubbles, causing forms to silently fail validation without user feedback.
 * See: https://bugzilla.mozilla.org/show_bug.cgi?id=1510450
 *
 * When true, forms should use `noValidate` and rely on server-side validation.
 */
export function useIsAndroidFirefox(): boolean {
  const [isAndroidFirefox, setIsAndroidFirefox] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isFirefox = /Firefox|FxiOS/i.test(userAgent);
    setIsAndroidFirefox(isAndroid && isFirefox);
  }, []);

  return isAndroidFirefox;
}
