import { redirect } from "next/navigation";
import { err } from "../helpers";
import { baseUrl, type IlmomasiinaSignupResponse } from ".";

// TODO: check if this makes any sense to introduce extra steps for signing up
// perhaps it's much better to fetch on client side directly and then redirect
export async function signUp(formData: FormData) {
  "use server";

  const quotaId = formData.get("quotaId");
  if (!quotaId) {
    return err("ilmomasiina-ilmo-missing-quota-id");
  }

  const response = await fetch(`${baseUrl}/api/signups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quotaId }),
  });

  if (!response.ok) {
    return err("ilmomasiina-unknown-error");
  }

  const data = (await response.json()) as IlmomasiinaSignupResponse;

  if ("statusCode" in data) {
    return err("ilmomasiina-unknown-error");
  }

  redirect(`${baseUrl}/signup/${data.id}/${data.editToken}`);
}
