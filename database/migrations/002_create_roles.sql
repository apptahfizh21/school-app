-- =====================================================
-- Migration : 002_create_roles.sql
-- Description : Create roles table
-- =====================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    modified_at TIMESTAMP,
    modified_by UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_roles_code
ON roles(code);

CREATE INDEX idx_roles_active
ON roles(is_active);