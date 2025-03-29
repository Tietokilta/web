export interface InvoiceGeneratorFormState {
  success?: boolean;
  errorText?: string;
  errors?: Partial<Record<string, string>>;
}

export interface LaskugeneraattoriRow {
  product: string;
  unit_price: number;
}

export interface LaskugeneraattoriRequest {
  recipient_name: string;
  recipient_email: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  phone_number: string;
  subject: string;
  description: string;
  bank_account_number: string;
  due_date: string;
  rows: LaskugeneraattoriRow[];
  attachment_descriptions: string[];
}
