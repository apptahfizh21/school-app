-- =====================================================
-- Seeder : 003_seed_role_permissions.sql
-- Description : Seed default role permissions
-- =====================================================

INSERT INTO role_permissions (role_id, permission_id)

SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE

(
    r.code = 'SUPER_ADMIN'
)

OR

(
    r.code = 'ADMIN'
    AND p.code IN (

        'users.view',
        'users.create',
        'users.update',

        'roles.view',

        'settings.view',
        'settings.update'
    )
)

OR

(
    r.code = 'KEPALA_SEKOLAH'
    AND p.code IN (

        'users.view',

        'roles.view',

        'settings.view'
    )
)

ON CONFLICT (role_id, permission_id)
DO NOTHING;