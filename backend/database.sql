-- ==============================================================================
-- Sistema Iglesia - Script de Base de Datos Normalizado y Expandido (PostgreSQL)
-- ==============================================================================

-- 1. TABLAS MAESTRAS (Lookups)
CREATE TABLE IF NOT EXISTS member_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS growth_steps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS group_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS announcement_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL -- ingreso, egreso
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS genders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS marital_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS relationship_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. CONTROL DE ACCESO
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    role VARCHAR(50) DEFAULT 'user', -- 'admin' o 'user'
    active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INFRAESTRUCTURA
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(100),
    pastor_id INT REFERENCES users(id) ON DELETE SET NULL,
    capacity INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operativo',
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MIEMBROS
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    birth_date DATE,
    gender_id INT REFERENCES genders(id),
    marital_status_id INT REFERENCES marital_statuses(id),
    conversion_date DATE,
    baptism_date DATE,
    status_id INT REFERENCES member_statuses(id) DEFAULT 1,
    growth_step_id INT REFERENCES growth_steps(id) DEFAULT 1,
    photo_url VARCHAR(255),
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    linked_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. RELACIONES FAMILIARES
CREATE TABLE IF NOT EXISTS member_relationships (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    related_id INT REFERENCES members(id) ON DELETE CASCADE,
    relationship_type_id INT REFERENCES relationship_types(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, related_id, relationship_type_id)
);

-- 6. GRUPOS
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    group_type_id INT REFERENCES group_types(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address VARCHAR(255),
    schedule_day VARCHAR(20),
    schedule_time TIME,
    leader_id INT REFERENCES members(id) ON DELETE SET NULL,
    co_leader_id INT REFERENCES members(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT true,
    capacity_limit INT,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'miembro',
    PRIMARY KEY (group_id, member_id)
);

-- 7. COMUNICACIÓN
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    category_id INT REFERENCES announcement_categories(id),
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_by INT REFERENCES users(id),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. EVENTOS Y ASISTENCIA
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    meeting_type VARCHAR(50),
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    group_id INT REFERENCES groups(id) ON DELETE SET NULL,
    budget_allocated DECIMAL(10, 2) DEFAULT 0.00,
    responsible_id INT REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'programada',
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    meeting_id INT REFERENCES meetings(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'presente', -- presente, ausente, excusado
    arrival_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meeting_id, member_id)
);

-- 9. FINANZAS
CREATE TABLE IF NOT EXISTS finances (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES transaction_categories(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT,
    transaction_date DATE NOT NULL,
    payment_method_id INT REFERENCES payment_methods(id),
    is_verified BOOLEAN DEFAULT false,
    verified_by INT REFERENCES users(id),
    member_id INT REFERENCES members(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    created_by INT REFERENCES users(id),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICACIONES
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), 
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 11. ÍNDICES DE RENDIMIENTO
-- ==============================================================================
CREATE INDEX idx_members_names ON members(last_name, first_name);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_finances_date ON finances(transaction_date);
CREATE INDEX idx_attendance_meeting ON attendance(meeting_id);
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_members_deleted ON members(deleted_at);

-- ==============================================================================
-- 12. INSERCIÓN DE VALORES MAESTROS
-- ==============================================================================

INSERT INTO genders (name) VALUES ('Masculino'), ('Femenino'), ('Otro') ON CONFLICT DO NOTHING;
INSERT INTO marital_statuses (name) VALUES ('Soltero/a'), ('Casado/a'), ('Divorciado/a'), ('Viudo/a'), ('Unión Libre') ON CONFLICT DO NOTHING;
INSERT INTO relationship_types (name) VALUES ('Padre'), ('Madre'), ('Hijo/a'), ('Cónyuge'), ('Hermano/a'), ('Abuelo/a'), ('Nieto/a'), ('Tío/a'), ('Primo/a'), ('Tutor Legal') ON CONFLICT DO NOTHING;

INSERT INTO member_statuses (name) VALUES ('Activo'), ('Inactivo'), ('En Observación'), ('Trasladado'), ('Fallecido') ON CONFLICT DO NOTHING;
INSERT INTO growth_steps (name) VALUES ('Nuevo Creyente'), ('Bautizado'), ('Escuela de Líderes I'), ('Escuela de Líderes II'), ('Líder en Entrenamiento'), ('Líder de Célula') ON CONFLICT DO NOTHING;
INSERT INTO group_types (name) VALUES ('Célula de Hogar'), ('Ministerio'), ('Estudio Bíblico'), ('Jóvenes'), ('Niños') ON CONFLICT DO NOTHING;
INSERT INTO announcement_categories (name) VALUES ('Evento'), ('Aviso'), ('Urgente'), ('Noticia') ON CONFLICT DO NOTHING;
INSERT INTO transaction_categories (name, type) VALUES 
('Diezmo', 'ingreso'), ('Ofrenda', 'ingreso'), ('Donación Especial', 'ingreso'),
('Mantenimiento', 'egreso'), ('Servicios Públicos', 'egreso'), ('Eventos', 'egreso'), ('Ayuda Social', 'egreso') ON CONFLICT DO NOTHING;
INSERT INTO payment_methods (name) VALUES ('Efectivo'), ('Transferencia Bancaria'), ('TPV / Tarjeta'), ('Cheque') ON CONFLICT DO NOTHING;

-- Usuario admin por defecto
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Administrador Master', 'admin@sistemaiglesia.com', '$2b$10$Ilc3RD5P4VCM8mshE95dceezbtQDcL4EecORVV/NC3J0KNQdQnCFu', 'admin') ON CONFLICT (email) DO NOTHING;

-- 13. CONFIGURACIÓN GLOBAL
CREATE TABLE IF NOT EXISTS church_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) DEFAULT 'Iglesia Central',
    slogan VARCHAR(255) DEFAULT 'Un lugar para conectar',
    phone VARCHAR(20) DEFAULT '+1 234 567 890',
    email VARCHAR(100) DEFAULT 'contacto@iglesia.com',
    address TEXT DEFAULT 'Calle de la Fe #123, Ciudad',
    logo_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO church_info (id, name, slogan, phone, email, address)
VALUES (1, 'Iglesia Central', 'Un lugar para conectar', '+1 234 567 890', 'contacto@iglesia.com', 'Calle de la Fe #123, Ciudad')
ON CONFLICT (id) DO NOTHING;
