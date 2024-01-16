export type IlmomasiinaResponse = IlmomasiinaEvent[];

export interface IlmomasiinaEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  openQuotaSize: number;
  category: string;
  description: string;
  /**
   * Can be empty string
   */
  price: string;
  location: string;
  /**
   * Can be empty string
   */
  webpageUrl: string;
  /**
   * Can be empty string
   */
  facebookUrl: string;
  signupsPublic: boolean;
  quotas: EventQuota[];
}

export interface EventQuota {
  id: string;
  title: string;
  size: number;
  signupCount: number;
}

// TODO: better env handling since next.js doesn't have that built-in
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ideally would throw during build, but let's at least throw here if it's missing
const baseUrl = process.env.PUBLIC_ILMOMASIINA_URL!;

export const fetchEvents = async (): Promise<IlmomasiinaResponse> => {
  const response = await fetch(`${baseUrl}/api/events`);
  const data = (await response.json()) as IlmomasiinaResponse;

  return data;
};
