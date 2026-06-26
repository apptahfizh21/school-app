import path from "path";
import { runSqlFiles } from "./runner.js";

export async function runSeeders() {
  return runSqlFiles({
    directory: path.join(process.cwd(), "database", "seeders"),
    historyTable: "schema_seeders",
  });
}
