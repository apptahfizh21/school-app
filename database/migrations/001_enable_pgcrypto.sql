-- =====================================================
-- Migration : 001_extensions.sql
-- Description : Enable PostgreSQL Extensions
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

import fs from "fs";
import path from "path";
import pool from "./db.js";

function getMigrationFiles() {
  const migrationPath = path.join(process.cwd(), "database", "migrations");

  return fs
    .readdirSync(migrationPath)
    .filter(file => file.endsWith(".sql"))
    .sort();
}