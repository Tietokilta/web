import * as migration_20250327_193012_migration from "./20250327_193012_migration";
import * as migration_20240616_101649_Add_displayTitle_to_database from "./20240616_101649_Add_displayTitle_to_database";

export const migrations = [
  {
    up: migration_20240616_101649_Add_displayTitle_to_database.up,
    name: "20240616_101649_Add_displayTitle_to_database",
  },
  {
    up: migration_20250327_193012_migration.up,
    down: migration_20250327_193012_migration.down,
    name: "20250327_193012_migration",
  },
];
