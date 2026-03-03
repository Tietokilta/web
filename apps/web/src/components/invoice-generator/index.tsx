"use client";

import { Button, Checkbox, Input, Textarea } from "@tietokilta/ui";
import { useFormStatus, requestFormReset } from "react-dom";
import {
  type InputHTMLAttributes,
  type ReactNode,
  useActionState,
  useEffect,
  useState,
  startTransition,
  type FormEvent,
  type ChangeEvent,
  useRef,
  useCallback,
} from "react";
import Form from "next/form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useIsAndroidFirefox } from "@lib/use-is-android-firefox";
import type { Locale } from "@i18n/routing";
import { NextIntlClientProvider, useTranslations } from "../../locales/client";
import { locales, type Messages } from "../../locales/index";
import { SaveAction } from "../../lib/api/external/laskugeneraattori/actions";
import { type InvoiceGeneratorFormState } from "../../lib/api/external/laskugeneraattori/index";
import { compressImage, isCompressibleImage } from "../../lib/compress-image";

interface ProcessedAttachment {
  id: number;
  originalFile: File;
  processedFile: File;
  previewUrl: string | null;
  isProcessing: boolean;
  compressionRatio: number | null;
}

const MAX_PAYLOAD_SIZE = 24 * 1024 * 1024; // 24MB in bytes

interface GenericFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  name: string;
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

function SubmitButton({
  formState,
  disabled,
}: {
  formState: InvoiceGeneratorFormState | null;
  disabled?: boolean;
}) {
  const t = useTranslations("invoicegenerator");
  const { pending } = useFormStatus();
  const errorKeys = formState?.errors ? Object.keys(formState.errors) : [];

  useEffect(() => {
    if (formState?.success === true) toast.success(t("Sent invoice"));
  }, [formState, t]);

  return (
    <div>
      <Button
        className="w-full max-w-sm"
        type="submit"
        disabled={pending || disabled}
      >
        {t("Submit")}
      </Button>
      {formState?.success === false && errorKeys.length === 0 ? (
        <p data-form-status aria-live="polite" className="block text-red-600">
          {formState.errorText}
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentInput({
  attachment,
  index,
  onFileChange,
  onRemove,
  formState,
  canRemove,
}: {
  attachment: ProcessedAttachment;
  index: number;
  onFileChange: (id: number, file: File) => void;
  onRemove: (id: number) => void;
  formState: InvoiceGeneratorFormState | null;
  canRemove: boolean;
}) {
  const t = useTranslations("invoicegenerator");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(attachment.id, file);
    }
  };

  const isImage = attachment.processedFile.type.startsWith("image/");
  const showPreview =
    isImage && attachment.previewUrl && !attachment.isProcessing;

  return (
    <div className="mb-4 rounded-md border border-gray-300 p-4">
      <h3 className="mb-2 font-medium">
        {t("Attachment")} {index + 1}
      </h3>

      <fieldset className="space-y-3">
        <ErrorMessageBlock
          elementName={`attachment_descriptions[${index.toString()}]`}
          formState={formState}
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
          formState={formState}
        >
          <div>
            <InputLabel
              name={t("Attachment")}
              htmlId={`attachments[${index.toString()}]`}
            />
            <Input
              ref={fileInputRef}
              id={`attachments[${index.toString()}]`}
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              required={attachment.originalFile.size === 0}
            />
          </div>
        </ErrorMessageBlock>

        {attachment.isProcessing ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            {t("Compressing image")}...
          </div>
        ) : null}

        {showPreview && attachment.previewUrl ? (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- Preview of user-uploaded file */}
            <img
              src={attachment.previewUrl}
              alt={t("Attachment preview")}
              className="max-h-32 max-w-full rounded border border-gray-200 object-contain"
            />
            <div className="mt-1 text-xs text-gray-500">
              {attachment.compressionRatio !== null &&
              attachment.compressionRatio < 1 ? (
                <span>
                  {formatFileSize(attachment.originalFile.size)} →{" "}
                  {formatFileSize(attachment.processedFile.size)}{" "}
                  <span className="text-green-600">
                    (-{Math.round((1 - attachment.compressionRatio) * 100)}%)
                  </span>
                </span>
              ) : (
                <span>{formatFileSize(attachment.processedFile.size)}</span>
              )}
            </div>
          </div>
        ) : null}

        {!isImage && attachment.processedFile.size > 0 ? (
          <div className="mt-1 text-xs text-gray-500">
            {attachment.processedFile.name} (
            {formatFileSize(attachment.processedFile.size)})
          </div>
        ) : null}
      </fieldset>

      <Button
        className="mt-4"
        onClick={() => onRemove(attachment.id)}
        type="button"
        disabled={!canRemove}
      >
        {t("Remove")}
      </Button>
    </div>
  );
}

function AttachmentsSection({
  formState,
  attachmentsRef,
  onProcessingChange,
}: {
  formState: InvoiceGeneratorFormState | null;
  attachmentsRef: React.RefObject<ProcessedAttachment[]>;
  onProcessingChange: (isProcessing: boolean) => void;
}) {
  const t = useTranslations("invoicegenerator");
  const [attachments, setAttachments] = useState<ProcessedAttachment[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Sync attachments to ref for form submission
  useEffect(() => {
    // Using Object.assign to mutate the ref's current array in place
    attachmentsRef.current.length = 0;
    attachmentsRef.current.push(...attachments);
  }, [attachments, attachmentsRef]);

  // Notify parent of processing state changes
  useEffect(() => {
    const isAnyProcessing = attachments.some((a) => a.isProcessing);
    onProcessingChange(isAnyProcessing);
  }, [attachments, onProcessingChange]);

  const addAttachment = () => {
    const emptyFile = new File([], "");
    const newAttachment: ProcessedAttachment = {
      id: idCounter,
      originalFile: emptyFile,
      processedFile: emptyFile,
      previewUrl: null,
      isProcessing: false,
      compressionRatio: null,
    };
    setAttachments((prev) => [...prev, newAttachment]);
    setIdCounter((prev) => prev + 1);
  };

  const removeAttachment = (id: number) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleFileChange = useCallback(async (id: number, file: File) => {
    // Mark as processing
    setAttachments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, originalFile: file, isProcessing: true, previewUrl: null }
          : a,
      ),
    );

    try {
      let processedFile = file;
      let compressionRatio: number | null = null;

      // Compress if it's an image
      if (isCompressibleImage(file)) {
        processedFile = await compressImage(file);
        compressionRatio = processedFile.size / file.size;
      }

      // Create preview URL for images
      let previewUrl: string | null = null;
      if (processedFile.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(processedFile);
      }

      setAttachments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                processedFile,
                previewUrl,
                isProcessing: false,
                compressionRatio,
              }
            : a,
        ),
      );
    } catch (error) {
      console.error("Failed to process attachment:", error);
      // Fall back to original file
      setAttachments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                processedFile: file,
                isProcessing: false,
                compressionRatio: null,
              }
            : a,
        ),
      );
    }
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) {
          URL.revokeObjectURL(a.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only cleanup on unmount
  }, []);

  return (
    <div>
      <h2>{t("Attachments")}</h2>
      <div className="mt-2">
        {attachments.map((attachment, index) => (
          <AttachmentInput
            key={attachment.id}
            attachment={attachment}
            index={index}
            onFileChange={handleFileChange}
            onRemove={removeAttachment}
            formState={formState}
            canRemove={attachments.length > 0}
          />
        ))}
      </div>
      <Button type="button" className="mt-2" onClick={addAttachment}>
        {t("Add")}
      </Button>
    </div>
  );
}

function InvoiceGeneratorContent() {
  const [state, formAction] = useActionState(SaveAction, null);
  const [isProcessingAttachments, setIsProcessingAttachments] = useState(false);
  const t = useTranslations("invoicegenerator");
  const formRef = useRef<HTMLFormElement>(null);
  const attachmentsRef = useRef<ProcessedAttachment[]>([]);
  const isAndroidFirefox = useIsAndroidFirefox();

  // Form submission handler that doesn't reset the form
  // https://github.com/facebook/react/issues/29034#issuecomment-2143595195
  const handleSubmit = (event: FormEvent) => {
    if (!(event.target instanceof HTMLFormElement))
      throw new Error("Form submission event target is not a form element");

    event.preventDefault();
    const formData = new FormData(event.target);

    // Replace file input attachments with processed (compressed) versions
    formData.delete("attachments");
    const processedAttachments = attachmentsRef.current ?? [];
    for (const attachment of processedAttachments) {
      if (attachment.processedFile.size > 0) {
        formData.append("attachments", attachment.processedFile);
      }
    }

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
      <AttachmentsSection
        formState={state}
        attachmentsRef={attachmentsRef}
        onProcessingChange={setIsProcessingAttachments}
      />
      <div className="flex">
        <InputLabel name={t("Confirmation")} htmlId="confirmation-checkbox" />
        <Checkbox id="confirmation-checkbox" className="my-auto" required />
      </div>
      <fieldset>
        <SubmitButton formState={state} disabled={isProcessingAttachments} />
      </fieldset>
    </Form>
  );
}

export function InvoiceGenerator() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale;
  const messages = locales[locale] as Messages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <InvoiceGeneratorContent />
    </NextIntlClientProvider>
  );
}
