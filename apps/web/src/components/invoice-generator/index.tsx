"use client";

import { Button, Checkbox, Input, Textarea } from "@tietokilta/ui";
import Form from "next/form";
import { useParams } from "next/navigation";
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type Ref,
  type ReactNode,
  useActionState,
  useEffect,
  useState,
  startTransition,
  type FormEvent,
  useRef,
  useId,
} from "react";
import { useFormStatus, requestFormReset } from "react-dom";
import { toast } from "sonner";
import type { Locale } from "@i18n/routing";
import {
  prepareAttachment,
  UnsupportedFileError,
} from "@lib/prepare-attachment";
import { useIsAndroidFirefox } from "@lib/use-is-android-firefox";
import type { CostPool } from "@payload-types";
import { SaveAction } from "../../lib/api/external/laskugeneraattori/actions";
import { type InvoiceGeneratorFormState } from "../../lib/api/external/laskugeneraattori/index";
import { NextIntlClientProvider, useTranslations } from "../../locales/client";
import { locales, type Messages } from "../../locales/index";

const MAX_PAYLOAD_SIZE = 24 * 1024 * 1024; // 24MB in bytes

interface GenericFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  name: string;
  ref?: Ref<HTMLInputElement>;
}

function InputLabel({ name, htmlId }: { name: string; htmlId: string }) {
  return (
    <label className="block w-auto" htmlFor={htmlId}>
      {name}
    </label>
  );
}

function InputRow({
  id,
  type,
  unit,
  label,
  name,
  ...restProps
}: GenericFieldProps) {
  const htmlId = id ?? `inputfield.${name}`;
  return (
    <div>
      <InputLabel name={label} htmlId={htmlId} />
      <span className="flex">
        <Input id={htmlId} type={type ?? "text"} name={name} {...restProps} />
        {unit ? <span className="ml-1 translate-y-1">{unit}</span> : null}
      </span>
    </div>
  );
}

function TextAreaInputRow({
  placeholder,
  label,
  name,
  maxLength,
  required,
  id,
}: GenericFieldProps) {
  const htmlId = id ?? `inputfield.${name}`;

  return (
    <div>
      <InputLabel name={label} htmlId={htmlId} />
      <Textarea
        id={htmlId}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
}

// The cost pools are maintained in the CMS and fetched server-side, so adding or renaming a
// toimikunta needs no deploy of either this app or laskugeneraattori
function CostPoolRow({ costPools }: { costPools: CostPool[] }) {
  const t = useTranslations("invoicegenerator");
  const htmlId = useId();
  const helpId = useId();

  // Without a list there is nothing to pick from. Leave the field out rather than blocking the
  // form: the invoice is filed without a cost pool and the backend books it against an account
  // that does not exist, which the treasurer picks up on.
  if (costPools.length === 0) return null;

  return (
    <div>
      <InputLabel name={t("Cost pool")} htmlId={htmlId} />
      <select
        aria-describedby={helpId}
        className="flex h-10 w-full rounded-md border-2 border-gray-900 bg-gray-100 px-3 py-2 text-sm ring-offset-gray-800 focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        defaultValue=""
        id={htmlId}
        name="cost_pool"
        required
      >
        <option disabled value="">
          {t("Cost pool placeholder")}
        </option>
        {costPools.map((costPool) => (
          <option key={costPool.id} value={costPool.id}>
            {costPool.name}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-700" id={helpId}>
        {t("Cost pool help")}
      </p>
    </div>
  );
}

function SubmitButton({
  formState,
}: {
  formState: InvoiceGeneratorFormState | null;
}) {
  const t = useTranslations("invoicegenerator");
  const { pending } = useFormStatus();
  const errorKeys = formState?.errors ? Object.keys(formState.errors) : [];

  useEffect(() => {
    if (formState?.success === true) toast.success(t("Sent invoice"));
  }, [formState, t]);

  return (
    <div>
      <Button className="w-full max-w-sm" type="submit" disabled={pending}>
        {t("Submit")}
      </Button>
      {formState?.success === false && errorKeys.length === 0 ? (
        <p data-form-status aria-live="polite" className="block text-red-600">
          {formState.failure === "rate-limited"
            ? t("Rate limited")
            : formState.failure === "unreachable"
              ? t("Send failed")
              : formState.errorText}
        </p>
      ) : null}
    </div>
  );
}

function DeleteButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const t = useTranslations("invoicegenerator");
  return (
    <Button
      className="my-8"
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {t("Remove")}
    </Button>
  );
}

function InputRowArray({
  Row,
  label,
  itemLabel,
  name,
  state,
  minimumRows,
}: {
  Row: ({
    state,
    index,
  }: {
    state: InvoiceGeneratorFormState | null;
    index: number;
  }) => ReactNode;
  label: string;
  itemLabel: string;
  name: string;
  state: InvoiceGeneratorFormState | null;
  minimumRows?: 1 | 0;
}) {
  const [rows, setRows] = useState<number[]>(minimumRows === 1 ? [0] : []);
  const [counter, setCounter] = useState<number>(1);
  const htmlId = `inputRowArray.${name}`;
  const t = useTranslations("invoicegenerator");

  function addRow() {
    setRows([...rows, counter]);
    setCounter(counter + 1);
  }

  return (
    <div>
      <label htmlFor={htmlId}>
        <h2>{label}</h2>
      </label>
      <fieldset id={htmlId} name={name}>
        <div>
          {rows.map((row, index) => (
            <div key={row} id={`${htmlId}.${index.toString()}`}>
              <h3>
                {itemLabel} {index + 1}
              </h3>
              <Row state={state} index={index} />
              <DeleteButton
                disabled={rows.length === minimumRows}
                onClick={() => {
                  setRows(rows.filter((filterRow) => filterRow !== row));
                }}
              />
            </div>
          ))}
        </div>
        <Button type="button" className="mt-2" onClick={addRow}>
          {t("Add")}
        </Button>
      </fieldset>
    </div>
  );
}

function ErrorMessageBlock({
  children,
  elementName,
  formState,
}: {
  children: ReactNode;
  elementName: string;
  formState: InvoiceGeneratorFormState | null;
}) {
  return (
    <div>
      {children}
      {formState?.errors?.[elementName] ? (
        <span aria-live="polite" className="block text-red-600">
          {formState.errors[elementName]}
        </span>
      ) : null}
    </div>
  );
}

function InvoiceItem({
  state,
  index,
}: {
  state: InvoiceGeneratorFormState | null;
  index: number;
}) {
  const t = useTranslations("invoicegenerator");

  return (
    <fieldset className="flex">
      <span className="mr-1 w-3/5 grow">
        <ErrorMessageBlock
          elementName={`rows[${index.toString()}].product`}
          formState={state}
        >
          <InputRow
            label={t("Product")}
            name="rows.product"
            placeholder="Alepa-kuitti"
            id={`rows[${index.toString()}].product`}
            maxLength={128}
            required
          />
        </ErrorMessageBlock>
      </span>
      <span className="mr-1 w-2/5 grow">
        <ErrorMessageBlock
          elementName={`rows[${index.toString()}].unit_price`}
          formState={state}
        >
          <InputRow
            label={t("Unit price")}
            type="number"
            name="rows.unit_price"
            id={`rows[${index.toString()}].unit_price`}
            required
            step={0.01}
            min={0}
            unit="€"
          />
        </ErrorMessageBlock>
      </span>
    </fieldset>
  );
}

const fileSizeFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${fileSizeFormat.format(bytes / 1024)} KB`
    : `${fileSizeFormat.format(bytes / 1024 / 1024)} MB`;
}

type AttachmentStatus =
  | { kind: "empty" }
  | { kind: "processing" }
  | { kind: "unsupported" }
  | { kind: "ready"; file: File; originalSize: number; preview?: string };

// Shrinks the picked image in place, so the form submits the processed file as usual
function AttachmentInput({ id }: { id: string }) {
  const t = useTranslations("invoicegenerator");
  const inputRef = useRef<HTMLInputElement>(null);
  const latestPick = useRef(0);
  const [status, setStatus] = useState<AttachmentStatus>({ kind: "empty" });
  const preview = status.kind === "ready" ? status.preview : undefined;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const form = inputRef.current?.form;
    const clear = () => {
      latestPick.current++;
      inputRef.current?.setCustomValidity("");
      setStatus({ kind: "empty" });
    };
    form?.addEventListener("reset", clear);
    return () => form?.removeEventListener("reset", clear);
  }, []);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const original = input.files?.[0];
    const pick = ++latestPick.current;
    if (!original) {
      input.setCustomValidity("");
      setStatus({ kind: "empty" });
      return;
    }

    // Holds the submit back until the processed file is in place
    input.setCustomValidity(t("Processing attachment"));
    setStatus({ kind: "processing" });

    let file = original;
    try {
      file = await prepareAttachment(original);
    } catch (error) {
      if (pick !== latestPick.current) return;
      if (error instanceof UnsupportedFileError) {
        input.setCustomValidity(t("Unsupported attachment"));
        setStatus({ kind: "unsupported" });
        return;
      }
      // Anything else, such as running out of memory on a huge photo: send the original
      console.warn("Could not process the attachment", error);
    }
    if (pick !== latestPick.current) return;

    if (file !== original) {
      const files = new DataTransfer();
      files.items.add(file);
      input.files = files.files;
    }
    input.setCustomValidity("");
    setStatus({
      kind: "ready",
      file,
      originalSize: original.size,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    });
  }

  return (
    <div>
      <InputRow
        ref={inputRef}
        label={t("Attachment")}
        id={id}
        name="attachments"
        type="file"
        accept="image/*,application/pdf"
        onChange={(event) => void handleChange(event)}
        required
      />
      {status.kind === "processing" ? (
        <p aria-live="polite" className="text-sm text-gray-700">
          {t("Processing attachment")}
        </p>
      ) : null}
      {status.kind === "unsupported" ? (
        <p aria-live="polite" className="text-sm text-red-600">
          {t("Unsupported attachment")}
        </p>
      ) : null}
      {status.kind === "ready" ? (
        <div className="mt-2 flex items-center gap-3">
          {status.preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local object URL, nothing for next/image to optimise
            <img
              src={status.preview}
              alt=""
              className="size-20 rounded-sm border-2 border-gray-900 object-cover"
            />
          ) : null}
          <p className="text-sm text-gray-700">
            {status.file.size < status.originalSize
              ? `${formatFileSize(status.originalSize)} → ${formatFileSize(status.file.size)}`
              : formatFileSize(status.file.size)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function AttachmentRow({
  state,
  index,
}: {
  state: InvoiceGeneratorFormState | null;
  index: number;
}) {
  const t = useTranslations("invoicegenerator");

  return (
    <fieldset>
      <ErrorMessageBlock
        elementName={`attachment_descriptions[${index.toString()}]`}
        formState={state}
      >
        <TextAreaInputRow
          label={t("Description")}
          id={`attachment_descriptions[${index.toString()}]`}
          name="attachment_descriptions"
          maxLength={512}
          required
        />
      </ErrorMessageBlock>
      <ErrorMessageBlock
        elementName={`attachments[${index.toString()}]`}
        formState={state}
      >
        <AttachmentInput id={`attachments[${index.toString()}]`} />
      </ErrorMessageBlock>
    </fieldset>
  );
}

function InvoiceGeneratorContent({ costPools }: { costPools: CostPool[] }) {
  const [state, formAction] = useActionState(SaveAction, null);
  const t = useTranslations("invoicegenerator");
  const formRef = useRef<HTMLFormElement>(null);
  const isAndroidFirefox = useIsAndroidFirefox();

  // Form submission handler that doesn't reset the form
  // https://github.com/facebook/react/issues/29034#issuecomment-2143595195
  const handleSubmit = (event: FormEvent) => {
    if (!(event.target instanceof HTMLFormElement))
      throw new Error("Form submission event target is not a form element");

    event.preventDefault();

    // Without browser validation (Android Firefox), still wait for attachments to finish processing
    const pendingAttachment = Array.from(
      event.target.querySelectorAll<HTMLInputElement>('input[type="file"]'),
    ).find((input) => input.validity.customError);
    if (pendingAttachment) {
      pendingAttachment.focus();
      return;
    }

    const formData = new FormData(event.target);

    const payloadSize = calculateFormDataSize(formData);

    if (payloadSize > MAX_PAYLOAD_SIZE) {
      toast.error(
        "Total form size exceeds 24MB limit. Please remove some files.",
      );
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const calculateFormDataSize = (formData: FormData): number => {
    let totalSize = 0;

    formData.forEach((value, key) => {
      // Add size of the key
      totalSize += new Blob([key]).size;

      if (value instanceof File) {
        // Add file size
        totalSize += value.size;
      } else {
        // Add string value size
        totalSize += new Blob([value.toString()]).size;
      }
    });
    return totalSize;
  };

  useEffect(() => {
    const errorFields = state?.errors ? Object.keys(state.errors) : [];
    if (errorFields.length !== 0) {
      const lastErrorField = errorFields[errorFields.length - 1];
      const inputWithError =
        (document.getElementsByName(lastErrorField)[0] as HTMLElement | null) ??
        document.getElementById(lastErrorField);
      inputWithError?.focus();
    } else {
      document.querySelector("[data-form-status]")?.scrollIntoView();
    }

    // Reset form on success (because it is not done automatically with handleSubmit)
    if (state?.success && formRef.current) {
      requestFormReset(formRef.current);
    }
  }, [state]);

  return (
    <Form
      className="w-full max-w-prose space-y-4 overflow-x-clip rounded-md border-2 border-gray-900 p-4 py-6 shadow-solid md:px-6 md:py-8"
      ref={formRef}
      noValidate={isAndroidFirefox}
      // Use `onSubmit` instead of `action` to prevent form reset
      onSubmit={handleSubmit}
      // `action` is a required prop anyway
      action={() => undefined}
    >
      <label htmlFor="recipient-info">
        <h2>{t("Invoicer information")}</h2>
      </label>

      <fieldset id="recipient-info">
        <ErrorMessageBlock elementName="recipient_name" formState={state}>
          <InputRow
            label={t("Invoicer name")}
            name="recipient_name"
            placeholder="Teemu Teekkari"
            autoComplete="name"
            maxLength={128}
            required
          />
        </ErrorMessageBlock>
        <ErrorMessageBlock elementName="recipient_email" formState={state}>
          <InputRow
            label={t("Invoicer email")}
            maxLength={128}
            placeholder="teemu.teekkari@aalto.fi"
            name="recipient_email"
            type="email"
            required
          />
        </ErrorMessageBlock>
        <ErrorMessageBlock elementName="phone_number" formState={state}>
          <InputRow
            label={t("Phone number")}
            name="phone_number"
            placeholder="+358451234567"
            type="tel"
            maxLength={32}
            autoComplete="tel"
            required
          />
        </ErrorMessageBlock>
      </fieldset>
      <label htmlFor="address-set">
        <h2>{t("Address")}</h2>
      </label>
      <fieldset id="address-set">
        <ErrorMessageBlock elementName="street_name" formState={state}>
          <InputRow
            label={t("Street name")}
            name="street_name"
            placeholder="Konemiehentie 2"
            maxLength={128}
            required
          />
        </ErrorMessageBlock>
        <ErrorMessageBlock elementName="city" formState={state}>
          <InputRow
            label={t("City")}
            name="city"
            placeholder="Espoo"
            maxLength={128}
            required
          />
        </ErrorMessageBlock>
        <ErrorMessageBlock elementName="zip" formState={state}>
          <InputRow
            label={t("Postal code")}
            name="zip"
            placeholder="02150"
            maxLength={128}
            required
          />
        </ErrorMessageBlock>
      </fieldset>
      <ErrorMessageBlock elementName="subject" formState={state}>
        <InputRow
          label={t("Subject")}
          name="subject"
          maxLength={128}
          required
        />
      </ErrorMessageBlock>
      <ErrorMessageBlock elementName="description" formState={state}>
        <TextAreaInputRow
          label={t("Description")}
          name="description"
          maxLength={4096}
          required
        />
      </ErrorMessageBlock>
      <ErrorMessageBlock elementName="cost_pool" formState={state}>
        <CostPoolRow costPools={costPools} />
      </ErrorMessageBlock>
      <ErrorMessageBlock elementName="bank_account_number" formState={state}>
        {/* MDN: cc-number: A credit card number or other number identifying a payment method, such as an account number. */}
        <InputRow
          label={t("Bank account number")}
          name="bank_account_number"
          placeholder="FI2112345600000785"
          maxLength={128}
          required
        />
      </ErrorMessageBlock>
      <ErrorMessageBlock elementName="rows" formState={state}>
        <InputRowArray
          label={t("Items")}
          itemLabel={t("Receipt/Product")}
          name="rows"
          state={state}
          Row={InvoiceItem}
          minimumRows={1}
        />
      </ErrorMessageBlock>
      <InputRowArray
        label={t("Attachments")}
        itemLabel={t("Attachment")}
        name="attachments"
        state={state}
        Row={AttachmentRow}
      />
      <div className="flex">
        <InputLabel name={t("Confirmation")} htmlId="confirmation-checkbox" />
        <Checkbox id="confirmation-checkbox" className="my-auto" required />
      </div>
      <fieldset>
        <SubmitButton formState={state} />
      </fieldset>
    </Form>
  );
}

export function InvoiceGeneratorForm({ costPools }: { costPools: CostPool[] }) {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale;
  const messages = locales[locale] as Messages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <InvoiceGeneratorContent costPools={costPools} />
    </NextIntlClientProvider>
  );
}
