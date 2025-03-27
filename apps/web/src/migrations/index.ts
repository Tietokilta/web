import * as migration_20250327_193012_migration from "./20250327_193012_migration";

export const migrations = [
  {
    up: migration_20250327_193012_migration.up,
    down: migration_20250327_193012_migration.down,
    name: "20250327_193012_migration",
  },
];
