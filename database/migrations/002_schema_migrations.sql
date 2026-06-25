-- =====================================================
-- Migration : 002_schema_migrations.sql
-- Description : Create schema_migrations table
-- =====================================================

CREATE TABLE IF NOT EXISTS schema_migrations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    migration_name VARCHAR(255) NOT NULL UNIQUE,

    executed_at TIMESTAMP NOT NULL DEFAULT NOW()

);