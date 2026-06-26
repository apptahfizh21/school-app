-- =====================================================
-- Migration : 006_create_user_roles.sql
-- Description : Create user_roles table
-- =====================================================

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    role_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    -- CASCADE digunakan karena tabel ini hanya menyimpan relasi
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- CASCADE digunakan karena tabel ini hanya menyimpan relasi
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- SET NULL digunakan agar riwayat siapa yang memberikan role tetap aman
    CONSTRAINT fk_user_roles_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT uq_user_roles_user_role
        UNIQUE (user_id, role_id)
);

CREATE INDEX idx_user_roles_user
ON user_roles(user_id);

CREATE INDEX idx_user_roles_role
ON user_roles(role_id);