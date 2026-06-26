-- =====================================================
-- Migration : 007_create_settings.sql
-- Description : Create settings table
-- =====================================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    modified_at TIMESTAMP,
    modified_by UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- SET NULL digunakan agar pengaturan tetap ada
    -- meskipun user pembuat sudah dihapus
    CONSTRAINT fk_settings_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    -- SET NULL digunakan agar riwayat tetap aman
    CONSTRAINT fk_settings_modified_by
        FOREIGN KEY (modified_by)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_settings_key
ON settings(setting_key);

CREATE INDEX idx_settings_active
ON settings(is_active);