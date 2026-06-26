-- =====================================================
-- Seeder : 002_seed_permissions.sql
-- Description : Seed default permissions
-- =====================================================

INSERT INTO permissions (code, name, module, description)
VALUES

-- =====================================================
-- Users
-- =====================================================

(
    'users.view',
    'Lihat Pengguna',
    'users',
    'Mengizinkan melihat daftar pengguna.'
),
(
    'users.create',
    'Tambah Pengguna',
    'users',
    'Mengizinkan menambahkan pengguna baru.'
),
(
    'users.update',
    'Ubah Pengguna',
    'users',
    'Mengizinkan mengubah data pengguna.'
),
(
    'users.delete',
    'Hapus Pengguna',
    'users',
    'Mengizinkan menghapus pengguna.'
),

-- =====================================================
-- Roles
-- =====================================================

(
    'roles.view',
    'Lihat Role',
    'roles',
    'Mengizinkan melihat daftar role.'
),
(
    'roles.create',
    'Tambah Role',
    'roles',
    'Mengizinkan membuat role baru.'
),
(
    'roles.update',
    'Ubah Role',
    'roles',
    'Mengizinkan mengubah role.'
),
(
    'roles.delete',
    'Hapus Role',
    'roles',
    'Mengizinkan menghapus role.'
),

-- =====================================================
-- Permissions
-- =====================================================

(
    'permissions.view',
    'Lihat Permission',
    'permissions',
    'Mengizinkan melihat daftar permission.'
),
(
    'permissions.create',
    'Tambah Permission',
    'permissions',
    'Mengizinkan membuat permission.'
),
(
    'permissions.update',
    'Ubah Permission',
    'permissions',
    'Mengizinkan mengubah permission.'
),
(
    'permissions.delete',
    'Hapus Permission',
    'permissions',
    'Mengizinkan menghapus permission.'
),

-- =====================================================
-- Settings
-- =====================================================

(
    'settings.view',
    'Lihat Pengaturan',
    'settings',
    'Mengizinkan melihat pengaturan aplikasi.'
),
(
    'settings.update',
    'Ubah Pengaturan',
    'settings',
    'Mengizinkan mengubah pengaturan aplikasi.'
)

ON CONFLICT (code)
DO NOTHING;