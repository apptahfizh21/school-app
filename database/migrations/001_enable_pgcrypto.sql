-- =====================================================
-- Migration : 001_enable_pgcrypto.sql
-- Description : Enable PostgreSQL pgcrypto extension
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";