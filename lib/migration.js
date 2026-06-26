import path from "path";
import { runSqlFiles } from "./runner.js";

export async function runMigrations() {
  return runSqlFiles({
    directory: path.join(process.cwd(), "database", "migrations"),
    historyTable: "schema_migrations",
  });
}
