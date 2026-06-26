-- =====================================================
-- Migration : 003_create_permissions.sql
-- Description : Create permissions table
-- =====================================================

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    module VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    modified_at TIMESTAMP,
    modified_by UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_permissions_code
ON permissions(code);

CREATE INDEX idx_permissions_module
ON permissions(module);

CREATE INDEX idx_permissions_active
ON permissions(is_active);