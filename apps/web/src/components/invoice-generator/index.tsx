"use client";

/* eslint-disable no-nested-ternary -- this is pretty cool and readable here */

import { Button, Checkbox, Input, Textarea } from "@tietokilta/ui";
import { useFormState, useFormStatus } from "react-dom";
import {
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import {
  I18nProviderClient,
  useCurrentLocale,
  useScopedI18n,
} from "../../locales/client";
import { SaveAction } from "../../lib/api/external/laskugeneraattori/actions";
import { type InvoiceGeneratorFormState } from "../../lib/api/external/laskugeneraattori/index";

import { Toaster, toast } from "sonner";

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
  placeholder,
  label,
  id,
  name,
  autoComplete,
  type,
  defaultValue,
  multiple,
  required,
  step,
  min,
  onBeforeInput: onInput,
  unit,
  maxLength,
}: GenericFieldProps) {
  const htmlId = id ?? `inputfield.${name}`;

  return (
    <div>
      <InputLabel name={label} htmlId={htmlId} />
      <span className="flex">
        <Input
          id={htmlId}
          name={name}
          type={type ?? "text"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          required={required}
          multiple={multiple}
          step={step}
          min={min}
          onBeforeInput={onInput}
          maxLength={maxLength}
        />
        {unit ? <span className="ml-2 translate-y-1">{unit}</span> : null}
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
}: {
  formState: InvoiceGeneratorFormState | null;
}) {
  const t = useScopedI18n("invoicegenerator");
  const { pending } = useFormStatus();
  const errorKeys = formState?.errors ? Object.keys(formState.errors) : [];

  useEffect(() => {
    if (formState?.success === true) toast.success(t("Sent invoice"));
  }, [formState]);

  return (
    <div>
      <Button className="w-full max-w-sm" type="submit" disabled={pending}>
        {t("Submit")}
      </Button>
      {formState?.success ? (
        <Toaster richColors />
      ) : formState?.success === false && errorKeys.length === 0 ? (
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
  const t = useScopedI18n("invoicegenerator");
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
  const t = useScopedI18n("invoicegenerator");

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
  const t = useScopedI18n("invoicegenerator");

  return (
    <fieldset>
      <ErrorMessageBlock
        elementName={`rows[${index.toString()}].product`}
        formState={state}
      >
        <InputRow
          label={t("Product")}
          name="rows.product"
          id={`rows[${index.toString()}].product`}
          maxLength={128}
          required
        />
      </ErrorMessageBlock>
      <fieldset className="flex">
        <span className="mr-0.5 grow">
          <ErrorMessageBlock
            elementName={`rows[${index.toString()}].quantity`}
            formState={state}
          >
            <InputRow
              label={t("Quantity")}
              name="rows.quantity"
              id={`rows[${index.toString()}].quantity`}
              type="number"
              required
            />
          </ErrorMessageBlock>
        </span>
        <span className="ml-0.5 grow">
          <ErrorMessageBlock
            elementName={`rows[${index.toString()}].unit`}
            formState={state}
          >
            <InputRow
              label={t("Unit")}
              name="rows.unit"
              id={`rows[${index.toString()}].unit`}
              defaultValue="kpl"
              maxLength={128}
              required
            />
          </ErrorMessageBlock>
        </span>
      </fieldset>
      <ErrorMessageBlock
        elementName={`rows[${index.toString()}].unit_price`}
        formState={state}
      >
        <span>
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
        </span>
      </ErrorMessageBlock>
    </fieldset>
  );
}

function AttachmentRow({
  state,
  index,
}: {
  state: InvoiceGeneratorFormState | null;
  index: number;
}) {
  const t = useScopedI18n("invoicegenerator");

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
        <InputRow
          label={t("Attachment")}
          id={`attachments[${index.toString()}]`}
          name="attachments"
          type="file"
          required
        />
      </ErrorMessageBlock>
    </fieldset>
  );
}

function InvoiceGeneratorForm() {
  const [state, formAction] = useFormState(SaveAction, null);
  const t = useScopedI18n("invoicegenerator");

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
  }, [state]);

  return (
    <form
      className="shadow-solid w-full max-w-prose space-y-4 overflow-x-clip rounded-md border-2 border-gray-900 p-4 py-6 md:px-6 md:py-8"
      action={formAction}
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
          autoComplete="cc-number"
          placeholder="FI2112345600000785"
          maxLength={128}
          required
        />
      </ErrorMessageBlock>
      <ErrorMessageBlock elementName="due_date" formState={state}>
        <InputRow label={t("Date")} name="due_date" type="date" required />
      </ErrorMessageBlock>
      <ErrorMessageBlock elementName="rows" formState={state}>
        <InputRowArray
          label={t("Items")}
          itemLabel={t("Product")}
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
    </form>
  );
}

export function InvoiceGenerator() {
  const locale = useCurrentLocale();

  return (
    <I18nProviderClient locale={locale}>
      <InvoiceGeneratorForm />
    </I18nProviderClient>
  );
}
