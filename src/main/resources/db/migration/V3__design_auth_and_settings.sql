-- Drop existing tables to start clean
DROP TABLE IF EXISTS USERS CASCADE;

-- Create Roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    color VARCHAR(10) DEFAULT '#6366f1'
);

-- Create Permissions table
CREATE TABLE permissions (
    id VARCHAR(50) PRIMARY KEY, -- slug like 'users.view'
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    category VARCHAR(50) NOT NULL
);

-- Create Users table (Redesigned)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive, Pending
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction: User <-> Role (Many-to-Many)
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Junction: Role <-> Permission (Many-to-Many)
CREATE TABLE role_permissions (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(50) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Settings table (per user)
CREATE TABLE user_settings (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    general_settings JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    security_settings JSONB DEFAULT '{}',
    appearance_settings JSONB DEFAULT '{}',
    oauth_settings JSONB DEFAULT '{}'
);

-- Seed Initial Data
INSERT INTO roles (name, description, color) VALUES 
('Super Admin', 'Full system access', '#ef4444'),
('Admin', 'Administrative access', '#6366f1'),
('Viewer', 'Read-only access', '#10b981');

INSERT INTO permissions (id, name, description, category) VALUES 
('users.view', 'View Users', 'Can view user list', 'users'),
('users.create', 'Create Users', 'Can create users', 'users'),
('users.edit', 'Edit Users', 'Can modify users', 'users'),
('users.delete', 'Delete Users', 'Can remove users', 'users'),
('roles.view', 'View Roles', 'Can view roles', 'roles'),
('roles.create', 'Create Roles', 'Can create roles', 'roles'),
('roles.edit', 'Edit Roles', 'Can modify roles', 'roles'),
('roles.delete', 'Delete Roles', 'Can remove roles', 'roles');

-- Link Super Admin to all (id 1)
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Link Admin to some permissions (id 2)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 'users.view'), (2, 'users.create'), (2, 'users.edit'),
(2, 'roles.view');

-- Link Viewer to basic read permissions (id 3)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 'users.view'), (3, 'roles.view');
