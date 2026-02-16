"use client";

import { useState } from "react";
import { Button } from "@tietokilta/ui";
import {
  PaymentMode,
  SignupPaymentStatus,
  SignupStatus,
  type SignupForEditResponse,
} from "@tietokilta/ilmomasiina-models";
import { useTranslations } from "@locales/client";
import { useStartPaymentAction } from "@lib/api/external/ilmomasiina/actions";

interface PaymentInfoProps {
  signup: SignupForEditResponse;
  onStartPayment: () => Promise<{
    paymentUrl: string;
  }>;
}

function PaymentInfoClient({ signup, onStartPayment }: PaymentInfoProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("ilmomasiina");
  const tInvoice = useTranslations("invoicegenerator");

  const products = signup.signup.products;
  const price = signup.signup.price;
  if (!price || price === 0 || !products || products.length === 0) {
    return null;
  }

  const currency = signup.signup.currency ?? "EUR";
  const currencyLabel = currency === "EUR" ? "€" : currency;
  const totalPrice = price;

  const isInQuota =
    signup.signup.status === SignupStatus.IN_QUOTA ||
    signup.signup.status === SignupStatus.IN_OPEN_QUOTA;
  const canPayOnline =
    signup.event.payments === PaymentMode.ONLINE &&
    isInQuota &&
    signup.signup.paymentStatus !== SignupPaymentStatus.PAID;

  const formatPrice = (value: number | null | undefined) =>
    !value ? "-" : `${(value / 100).toFixed(2)} ${currencyLabel}`;

  const paymentStatusText = (() => {
    switch (signup.signup.paymentStatus) {
      case SignupPaymentStatus.PAID:
        return t("payment.status.paid");
      case SignupPaymentStatus.PENDING:
        return isInQuota
          ? t("payment.status.pending")
          : t("payment.status.inQueue");
      case SignupPaymentStatus.REFUNDED:
        return t("payment.status.refunded");
      case null:
        return null;
    }
  })();

  const handleStartPayment = async () => {
    try {
      setError(null);
      setProcessing(true);
      const response = await onStartPayment();
      window.location.href = response.paymentUrl;
    } catch (err) {
      setProcessing(false);
      setError(err instanceof Error ? err.message : t("payment.error"));
    }
  };

  return (
    <div className="flex w-full max-w-prose flex-col items-center space-y-4 overflow-x-clip rounded-md border-2 border-gray-900 p-4 py-6 shadow-solid md:px-6 md:py-8">
      <div className="flex w-full flex-col gap-4">
        <h2 className="font-mono text-lg font-semibold text-gray-900">
          {t("payment.Payment information")}
        </h2>
        <div className="block w-full overflow-x-auto rounded-md border-2 border-gray-900 shadow-solid">
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-200">
                <th className="rounded-tl-md border-b border-gray-900 p-2 text-left">
                  {tInvoice("Product")}
                </th>
                <th className="border-b border-gray-900 p-2 text-right">
                  {t("headers.Price")}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.name}
                  className="odd:bg-gray-300 even:bg-gray-200"
                >
                  <td className="border-b border-gray-900 px-2 py-1">
                    {product.amount}x {product.name}
                  </td>
                  <td className="border-b border-gray-900 px-2 py-1 text-right">
                    {formatPrice(product.amount * product.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200">
                <td className="border-t border-gray-900 p-2 font-semibold">
                  {tInvoice("Total price")}
                </td>
                <td className="border-t border-gray-900 p-2 text-right font-semibold">
                  {formatPrice(totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="space-y-2 text-gray-900">
          {signup.event.payments === PaymentMode.DISABLED ? (
            <p>{t("payment.infoMessage")}</p>
          ) : null}
          {signup.event.payments === PaymentMode.MANUAL ? (
            <>
              {paymentStatusText ? <p>{paymentStatusText}</p> : null}
              <p>{t("payment.infoMessage")}</p>
            </>
          ) : null}
          {signup.event.payments === PaymentMode.ONLINE && paymentStatusText ? (
            <p>{paymentStatusText}</p>
          ) : null}
        </div>
        {canPayOnline ? (
          <>
            <Button
              className="mx-auto w-full max-w-sm"
              variant="secondary"
              onClick={() => void handleStartPayment()}
              disabled={processing}
            >
              {processing ? t("payment.processing") : t("payment.pay")}
            </Button>
            {error ? <p className="text-center text-red-600">{error}</p> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

export function PaymentInfo({
  signup,
  signupId,
  signupEditToken,
}: {
  signup: SignupForEditResponse;
  signupId: string;
  signupEditToken: string;
}) {
  const { startPaymentAction } = useStartPaymentAction();

  return (
    <PaymentInfoClient
      signup={signup}
      onStartPayment={() => startPaymentAction(signupId, signupEditToken)}
    />
  );
}
