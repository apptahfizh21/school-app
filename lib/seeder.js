import path from "path";
import { runSqlFiles } from "./runner.js";
import { seedSuperAdmin } from "./super-admin-seeder.js";

export async function runSeeders() {
  // Jalankan seluruh SQL Seeder
  const result = await runSqlFiles({
    directory: path.join(process.cwd(), "database", "seeders"),
    historyTable: "schema_seeders",
  });

  // Jalankan JavaScript Seeder
  result.superAdmin = await seedSuperAdmin();

  return result;
}
