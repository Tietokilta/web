import { redirect } from "next/navigation";
import { completePayment } from "@lib/api/external/ilmomasiina";

interface PageProps {
  params: Promise<{
    signupId: string;
    signupEditToken: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { signupId, signupEditToken } = params;

  // Complete the payment
  await completePayment(signupId, signupEditToken);

  // Redirect to signup edit page
  redirect(`/signups/${signupId}/${signupEditToken}`);
}
