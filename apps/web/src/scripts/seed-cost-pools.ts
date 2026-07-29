#!/usr/bin/env tsx
/* eslint-disable no-console -- this is a script */
import path from "node:path";
import dotenv from "dotenv";
import payloadInit from "payload";

const __dirname = import.meta.dirname;

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

const { PAYLOAD_SECRET } = process.env;
if (!PAYLOAD_SECRET) {
  throw Error("PAYLOAD_SECRET NOT SET, exiting");
}

/**
 * The toimikunnat as they were in laskugeneraattori's cost_pools.toml, which this collection
 * replaces. Seeded once; from here on the list is maintained in the admin UI.
 *
 * The account is the first four digits of the invoice's reference number, which is how the
 * accounting software knows where to book the payment.
 *
 * The English names follow the committees page (/en/committees) wherever a pool matches a
 * committee, so the same body is called the same thing everywhere on the site. The rest are
 * budget lines rather than committees, and the event-like ones (Sitsit, TiKkujoulut, ...) keep
 * their Finnish name in English because that is what they are called in both languages.
 */
const COST_POOLS: { name: { fi: string; en: string }; account: string }[] = [
  { name: { fi: "Abimarkkinointi", en: "Student Marketing" }, account: "4201" },
  { name: { fi: "Alumnitoimikunta", en: "Alumni Committee" }, account: "4202" },
  {
    name: { fi: "Digitoimikunta", en: "Digital Services Committee" },
    account: "4203",
  },
  {
    name: { fi: "Herkkukurkkutoimikunta", en: "Songmaster Committee" },
    account: "4205",
  },
  { name: { fi: "KV-toiminta", en: "International affairs" }, account: "4206" },
  { name: { fi: "Kiltahuone", en: "Guild room" }, account: "4208" },
  {
    name: { fi: "Kulttuuritoimikunta", en: "Culture Committee" },
    account: "4211",
  },
  {
    name: { fi: "Liikuntatoimikunta", en: "Sports Committee" },
    account: "4212",
  },
  { name: { fi: "Muistinnollaus", en: "Muistinnollaus" }, account: "4213" },
  { name: { fi: "Marttakerho", en: "Grandma Committee" }, account: "4214" },
  { name: { fi: "N-toimikunta", en: "N Committee" }, account: "4215" },
  { name: { fi: "Opintotoimikunta", en: "Study Committee" }, account: "4216" },
  { name: { fi: "Pakettiauto", en: "Van" }, account: "4218" },
  { name: { fi: "Pelitoimikunta", en: "Gaming Committee" }, account: "4219" },
  {
    name: { fi: "Fuksitoiminta kevät", en: "Phuksi activities, spring" },
    account: "4221",
  },
  {
    name: { fi: "Fuksitoiminta syksy", en: "Phuksi activities, autumn" },
    account: "4222",
  },
  { name: { fi: "Fuksibileet", en: "Phuksi party" }, account: "4223" },
  { name: { fi: "Sitsit", en: "Sitsit" }, account: "4227" },
  {
    name: { fi: "Ulkotoimikunta", en: "External Affairs Committee" },
    account: "4230",
  },
  {
    name: { fi: "Yrityssuhdetoimikunta", en: "Corporate Relations Committee" },
    account: "4231",
  },
  { name: { fi: "ISOhenkilötoiminta", en: "ISO activities" }, account: "4232" },
  {
    name: { fi: "Huomionosoitustyöryhmä", en: "Honors working group" },
    account: "4234",
  },
  {
    name: {
      fi: "Hallinnon käyttökulut",
      en: "Administration operating expenses",
    },
    account: "4236",
  },
  {
    name: {
      fi: "Hallinnon vaihtokulut",
      en: "Administration handover expenses",
    },
    account: "4237",
  },
  { name: { fi: "Kiltakokoukset", en: "Guild meetings" }, account: "4240" },
  {
    name: { fi: "Edustuslahjat", en: "Representation gifts" },
    account: "4241",
  },
  {
    name: { fi: "Vuosijuhlaedustukset", en: "Annual ball representations" },
    account: "4242",
  },
  {
    name: { fi: "Toimihenkilötoiminta", en: "Volunteer activities" },
    account: "4243",
  },
  { name: { fi: "Kilta-avustukset", en: "Guild grants" }, account: "4245" },
  { name: { fi: "TiKkujoulut", en: "TiKkujoulut" }, account: "4248" },
  {
    name: { fi: "Yhdenvertaisuustoimikunta", en: "Equality Committee" },
    account: "4255",
  },
  {
    name: { fi: "Arkistotoimikunta", en: "Archive Committee" },
    account: "4256",
  },
  { name: { fi: "Snackbar", en: "Snackbar" }, account: "4260" },
  {
    name: { fi: "Tanssii Tikin Kanssa", en: "Tanssii Tikin Kanssa" },
    account: "4261",
  },
  { name: { fi: "Reliikit", en: "Relics" }, account: "4262" },
  { name: { fi: "Virkistäytyminen", en: "Recreation" }, account: "4263" },
  { name: { fi: "Mentorointi", en: "Mentoring" }, account: "4264" },
  {
    name: { fi: "Kansainvälisyystoiminta", en: "Internationality activities" },
    account: "4265",
  },
  { name: { fi: "Tuntematon", en: "Unknown" }, account: "4298" },
];

const seedCostPools = async (): Promise<void> => {
  // stupid hack because of stupidness https://github.com/payloadcms/payload/issues/5282
  const payload = await payloadInit.init({
    config: (await import("../payload.config")).default,
  });

  let created = 0;
  let translated = 0;
  let skipped = 0;

  for (const { name, account } of COST_POOLS) {
    // Matching on the account keeps re-runs idempotent and never renames a pool the treasurer
    // has already edited by hand
    const existing = await payload.find({
      collection: "cost-pools",
      where: { account: { equals: account } },
      limit: 1,
      locale: "en",
      // Without this the fi name is returned as the en one, and every pool would look translated
      fallbackLocale: false,
    });

    const [existingCostPool] = existing.docs;

    if (existingCostPool) {
      if (existingCostPool.name) {
        console.log(`skipping ${account} ${name.fi}, exists`);
        skipped += 1;
        continue;
      }

      // Seeded before the name was localized, so only the fi value exists
      await payload.update({
        collection: "cost-pools",
        id: existingCostPool.id,
        locale: "en",
        data: { name: name.en },
        context: { disableRevalidate: true },
      });
      console.log(`translated ${account} ${name.fi} -> ${name.en}`);
      translated += 1;
      continue;
    }

    const costPool = await payload.create({
      collection: "cost-pools",
      locale: "fi",
      data: { name: name.fi, account },
      // We are not inside a Next request, so revalidateTag() would throw
      context: { disableRevalidate: true },
    });
    // Locales are written one at a time, so the en name needs its own update
    await payload.update({
      collection: "cost-pools",
      id: costPool.id,
      locale: "en",
      data: { name: name.en },
      context: { disableRevalidate: true },
    });
    console.log(`created ${account} ${name.fi} / ${name.en}`);
    created += 1;
  }

  console.log(
    `done: ${created.toString()} created, ${translated.toString()} translated, ${skipped.toString()} already existed`,
  );
  process.exit(0);
};

await seedCostPools();
