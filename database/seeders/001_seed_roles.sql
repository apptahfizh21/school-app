-- =====================================================
-- Seeder : 001_seed_roles.sql
-- Description : Seed default system roles
-- =====================================================

INSERT INTO roles (code, name, description)
VALUES
(
    'SUPER_ADMIN',
    'Super Admin',
    'Memiliki akses penuh ke seluruh fitur aplikasi.'
),
(
    'ADMIN',
    'Admin',
    'Mengelola administrasi dan operasional sekolah.'
),
(
    'OPERATOR',
    'Operator',
    'Menginput dan memperbarui data operasional.'
),
(
    'GURU',
    'Guru',
    'Mengelola data pembelajaran, absensi, dan nilai.'
),
(
    'KEPALA_SEKOLAH',
    'Kepala Sekolah',
    'Melihat dashboard, laporan, dan melakukan persetujuan.'
)
ON CONFLICT (code)
DO NOTHING;