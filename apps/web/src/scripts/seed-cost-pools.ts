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
 */
const COST_POOLS: { name: string; account: string }[] = [
  { name: "Abimarkkinointi", account: "4201" },
  { name: "Alumnitoimikunta", account: "4202" },
  { name: "Digitoimikunta", account: "4203" },
  { name: "Herkkukurkkutoimikunta", account: "4205" },
  { name: "KV-toiminta", account: "4206" },
  { name: "Kiltahuone", account: "4208" },
  { name: "Kulttuuritoimikunta", account: "4211" },
  { name: "Liikuntatoimikunta", account: "4212" },
  { name: "Muistinnollaus", account: "4213" },
  { name: "Marttakerho", account: "4214" },
  { name: "N-toimikunta", account: "4215" },
  { name: "Opintotoimikunta", account: "4216" },
  { name: "Pakettiauto", account: "4218" },
  { name: "Pelitoimikunta", account: "4219" },
  { name: "Fuksitoiminta kevät", account: "4221" },
  { name: "Fuksitoiminta syksy", account: "4222" },
  { name: "Fuksibileet", account: "4223" },
  { name: "Sitsit", account: "4227" },
  { name: "Ulkotoimikunta", account: "4230" },
  { name: "Yrityssuhdetoimikunta", account: "4231" },
  { name: "ISOhenkilötoiminta", account: "4232" },
  { name: "Huomionosoitustyöryhmä", account: "4234" },
  { name: "Hallinnon käyttökulut", account: "4236" },
  { name: "Hallinnon vaihtokulut", account: "4237" },
  { name: "Kiltakokoukset", account: "4240" },
  { name: "Edustuslahjat", account: "4241" },
  { name: "Vuosijuhlaedustukset", account: "4242" },
  { name: "Toimihenkilötoiminta", account: "4243" },
  { name: "Kilta-avustukset", account: "4245" },
  { name: "TiKkujoulut", account: "4248" },
  { name: "Yhdenvertaisuustoimikunta", account: "4255" },
  { name: "Arkistotoimikunta", account: "4256" },
  { name: "Snackbar", account: "4260" },
  { name: "Tanssii Tikin Kanssa", account: "4261" },
  { name: "Reliikit", account: "4262" },
  { name: "Virkistäytyminen", account: "4263" },
  { name: "Mentorointi", account: "4264" },
  { name: "Kansainvälisyystoiminta", account: "4265" },
  { name: "Unkown", account: "4298" },
];

const seedCostPools = async (): Promise<void> => {
  // stupid hack because of stupidness https://github.com/payloadcms/payload/issues/5282
  const payload = await payloadInit.init({
    config: (await import("../payload.config")).default,
  });

  let created = 0;
  let skipped = 0;

  for (const costPool of COST_POOLS) {
    // Matching on the account keeps re-runs idempotent and never renames a pool the treasurer
    // has already edited by hand
    const existing = await payload.find({
      collection: "cost-pools",
      where: { account: { equals: costPool.account } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`skipping ${costPool.account} ${costPool.name}, exists`);
      skipped += 1;
      continue;
    }

    await payload.create({
      collection: "cost-pools",
      data: costPool,
      // We are not inside a Next request, so revalidateTag() would throw
      context: { disableRevalidate: true },
    });
    console.log(`created ${costPool.account} ${costPool.name}`);
    created += 1;
  }

  console.log(
    `done: ${created.toString()} created, ${skipped.toString()} already existed`,
  );
  process.exit(0);
};

await seedCostPools();
