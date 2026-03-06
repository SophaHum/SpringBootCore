-- Re-seed missing Admin and Viewer role permissions
-- (V3 migration inserts were skipped due to migration history conflict)
INSERT INTO role_permissions (role_id, permission_id)
VALUES (2, 'users.view'),
    (2, 'users.create'),
    (2, 'users.edit'),
    (2, 'roles.view') ON CONFLICT DO NOTHING;
INSERT INTO role_permissions (role_id, permission_id)
VALUES (3, 'users.view'),
    (3, 'roles.view') ON CONFLICT DO NOTHING;
-- Seed a default Super Admin user
-- Password: admin123
INSERT INTO users (
        username,
        email,
        password,
        full_name,
        status,
        created_at,
        updated_at
    )
VALUES (
        'admin',
        'admin@example.com',
        '$2b$12$21fMUZh9HPiFe2zrNESVwOCCed6KgH.43PpqtFfQe4qcYs9p/NgoC',
        'Super Admin',
        'Active',
        NOW(),
        NOW()
    ) ON CONFLICT (email) DO NOTHING;
-- Assign Super Admin role (id=1) to the admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id,
    1
FROM users u
WHERE u.email = 'admin@example.com' ON CONFLICT DO NOTHING;
-- Assign Viewer role to any existing users that have no role assigned
INSERT INTO user_roles (user_id, role_id)
SELECT u.id,
    (
        SELECT id
        FROM roles
        WHERE name = 'Viewer'
    )
FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE ur.user_id IS NULL ON CONFLICT DO NOTHING;