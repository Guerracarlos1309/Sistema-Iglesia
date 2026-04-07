-- ==============================================================================
-- Sistema Iglesia - Script de Base de Datos Expandido (PostgreSQL)
-- ==============================================================================

-- 1. Tabla de Usuarios (Access Control: admin vs user)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin' o 'user'
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- info, alert, success
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- NULL si es para todos
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Sedes/Iglesias (Locations) -- Se incluyen coordenadas
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    maps_url VARCHAR(255),
    pastor_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Procesos de Crecimiento (Catálogo opcional, o como Enum en status. Lo haremos texto para flexibilidad)
-- Etapas comunes: 'Nuevo Creyente', 'Asistente Regular', 'Bautizado', 'Líder'

-- 5. Tabla de Miembros (Personas)
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(50),
    conversion_date DATE,
    baptism_date DATE,
    growth_step VARCHAR(50) DEFAULT 'Nuevo Creyente',
    status VARCHAR(50) DEFAULT 'activo', -- activo, inactivo
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Historial de Estado de Miembros (Para reportes de fechas precisas)
CREATE TABLE IF NOT EXISTS member_status_history (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INT REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- 7. Tabla de Grupos (Ministerios, Células) -- Mapa digital
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    group_type VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    leader_id INT REFERENCES members(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Miembros de Grupos
CREATE TABLE IF NOT EXISTS group_members (
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'miembro',
    PRIMARY KEY (group_id, member_id)
);

-- 9. Reportes Semanales de Grupos
CREATE TABLE IF NOT EXISTS group_reports (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    attendees_count INT DEFAULT 0,
    conversions_count INT DEFAULT 0,
    revenue_amount DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabla de Reuniones/Eventos
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP NOT NULL,
    meeting_type VARCHAR(50), -- culto, evento, etc.
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE SET NULL,
    attendees_count INT DEFAULT 0,
    conversions_count INT DEFAULT 0,
    baptisms_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabla de Asistencia Individual
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    meeting_id INT REFERENCES meetings(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    is_present BOOLEAN DEFAULT true,
    notes TEXT,
    UNIQUE(meeting_id, member_id)
);

-- 12. Periodos Financieros
CREATE TABLE IF NOT EXISTS periods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'abierto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Finanzas (Ingresos/Egresos)
CREATE TABLE IF NOT EXISTS finances (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL, -- ingreso, egreso
    category VARCHAR(50) NOT NULL, -- ofrenda_grupo, diezmo, ofrenda_culto
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    member_id INT REFERENCES members(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    period_id INT REFERENCES periods(id) ON DELETE SET NULL,
    group_id INT REFERENCES groups(id) ON DELETE SET NULL,
    meeting_id INT REFERENCES meetings(id) ON DELETE SET NULL,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES (Para Pruebas / Configuración)
-- ==============================================================================

-- Usuario admin
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Administrador', 'admin@sistemaiglesia.com', '$2b$10$O0O/Gz7R8r5D/3/wXy5QvuzJ5k4D6q5D/3/wXy5QvuzJ5k4D6q5D', 'admin') ON CONFLICT (email) DO NOTHING;

-- Usuario visualizador
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Lider User', 'user@sistemaiglesia.com', '$2b$10$O0O/Gz7R8r5D/3/wXy5QvuzJ5k4D6q5D/3/wXy5QvuzJ5k4D6q5D', 'user') ON CONFLICT (email) DO NOTHING;

-- Sede prueba (Ejemplo: Coordenadas de Caracas, Venezuela)
INSERT INTO locations (name, address, city, country, latitude, longitude, maps_url) 
VALUES ('Sede Central Caracas', 'Av. Bolívar', 'Caracas', 'Venezuela', 10.4806, -66.9036, 'https://maps.google.com/maps?q=10.4806,-66.9036&z=15&output=embed') ON CONFLICT DO NOTHING;

-- Miembro de prueba
INSERT INTO members (first_name, last_name, email, growth_step, status, location_id)
VALUES ('Juan', 'Pérez', 'juan@ejemplo.com', 'Asistente Regular', 'activo', 1);

-- Historial de estado inicial
INSERT INTO member_status_history (member_id, old_status, new_status)
VALUES (1, NULL, 'activo');
