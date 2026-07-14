export interface InvoiceGeneratorFormState {
  success?: boolean;
  errorText?: string;
  errors?: Partial<Record<string, string>>;
}

export interface LaskugeneraattoriRow {
  product: string;
  unit_price: number;
}

export interface CostPool {
  id: string;
  name: string;
  account: string;
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
  // Left out when the cost pools could not be loaded, in which case the backend books the
  // invoice against an account that does not exist so the treasurer assigns it by hand
  cost_pool?: string;
  rows: LaskugeneraattoriRow[];
  attachment_descriptions: string[];
}
