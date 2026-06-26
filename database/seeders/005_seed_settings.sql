-- =====================================================
-- Seeder : 005_seed_settings.sql
-- Description : Seed default application settings
-- =====================================================

INSERT INTO settings (
    setting_key,
    setting_value,
    description
)
VALUES
(
    'school.name',
    '',
    'Nama sekolah'
),
(
    'school.npsn',
    '',
    'Nomor Pokok Sekolah Nasional (NPSN)'
),
(
    'school.address',
    '',
    'Alamat sekolah'
),
(
    'school.phone',
    '',
    'Nomor telepon sekolah'
),
(
    'school.email',
    '',
    'Email resmi sekolah'
),
(
    'school.website',
    '',
    'Website resmi sekolah'
),
(
    'academic.current_year',
    '',
    'Tahun ajaran yang sedang aktif'
),
(
    'academic.current_semester',
    '1',
    'Semester yang sedang aktif'
),
(
    'system.timezone',
    'Asia/Jakarta',
    'Zona waktu aplikasi'
),
(
    'system.locale',
    'id-ID',
    'Locale aplikasi'
),
(
    'security.password_min_length',
    '12',
    'Panjang minimal password'
),
(
    'app.name',
    'School App',
    'Nama aplikasi'
),
(
    'app.version',
    '1.0.0',
    'Versi aplikasi'
)
ON CONFLICT (setting_key)
DO NOTHING;