"use server";

import {
  type InvoiceGeneratorFormState,
  type LaskugeneraattoriRequest,
} from "./index";

type ErrorArray = [
  string,
  {
    message: string;
  },
][];

interface ErrorResponse {
  errors?: ErrorArray;
}

// https://stackoverflow.com/a/22015930
const zip = <T>(...arr: T[][]) =>
  Array(Math.max(...arr.map((a) => a.length)))
    .fill(0)
    .map((_, i) => arr.map((a) => a[i]));

const laskugeneraattoriBaseUrl =
  process.env.NEXT_PUBLIC_LASKUGENERAATTORI_URL ??
  "https://laskutus.tietokilta.fi";

export async function SaveAction(
  currentState: unknown,
  formData: FormData,
): Promise<InvoiceGeneratorFormState> {
  const product = formData.getAll("rows.product");
  const quantity = formData.getAll("rows.quantity");
  const unit = formData.getAll("rows.unit");
  const unitPrice = formData.getAll("rows.unit_price");

  const rows = zip(product, quantity, unit, unitPrice).map((row) => {
    // Safe conversion to cents without floating-point arithmetic
    const unitPriceString = row[3] as string;
    const decimalSeparator = unitPriceString.includes(".") ? "." : ",";
    const unitPriceStringParts = unitPriceString.split(decimalSeparator, 2);

    // Sanity check, the browser form validation should not allow too precise values
    if (unitPriceStringParts[1]?.length > 2) {
      throw Error("Too precise unit price");
    }

    const bigIntCents =
      unitPriceStringParts.length > 1
        ? BigInt(unitPriceStringParts[1].padEnd(2, "0"))
        : BigInt(0);

    const bigIntUnitPrice =
      BigInt(unitPriceStringParts[0]) * BigInt("100") + bigIntCents;

    // Shouldn't ever happen
    if (bigIntUnitPrice > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw Error("Too large unit price");
    }

    return {
      product: row[0] as string,
      quantity: Number(row[1]),
      unit: row[2] as string,
      unit_price: Number(bigIntUnitPrice),
    };
  });

  const attachments = formData.getAll("attachments") as File[];

  const json: LaskugeneraattoriRequest = {
    recipient_name: formData.get("recipient_name") as string,
    recipient_email: formData.get("recipient_email") as string,
    address: {
      street: formData.get("street_name") as string,
      city: formData.get("city") as string,
      zip: formData.get("zip") as string,
    },
    phone_number: formData.get("phone_number") as string,
    subject: formData.get("subject") as string,
    description: formData.get("description") as string,
    bank_account_number: formData.get("bank_account_number") as string,
    due_date: formData.get("due_date") as string,
    rows,
    attachment_descriptions: formData.getAll(
      "attachment_descriptions",
    ) as string[],
  };
  const data = new FormData();
  data.append("data", JSON.stringify(json));
  attachments.forEach((attachment) => {
    data.append("attachments", attachment);
  });

  const res = await fetch(`${laskugeneraattoriBaseUrl}/invoices`, {
    method: "post",
    body: data,
  });

  if (res.ok) {
    return {
      success: true,
    };
  }

  const body = await res.text();

  function tryParse(): ErrorArray {
    try {
      const errorResponse = JSON.parse(body) as ErrorResponse;
      return errorResponse.errors ?? [];
    } catch {
      return [];
    }
  }

  const errors: string[][] = tryParse().map((error) => [
    error[0].startsWith("data.") ? error[0].substring(5) : error[0],
    error[1].message,
  ]);

  return {
    success: false,
    errorText: body,
    errors: errors.reduce(
      (obj, error) => ({ ...obj, [error[0]]: error[1] }),
      {},
    ),
  };
}
