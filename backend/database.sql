-- ==============================================================================
-- Sistema Iglesia - Script de Base de Datos (PostgreSQL)
-- ==============================================================================

-- 1. Tabla de Usuarios (Roles: admin, pastor, lider, tesorero, secretario, etc.)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'lider',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Sedes/Iglesias (Locations)
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    pastor_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Miembros
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
    baptism_date DATE,
    status VARCHAR(50) DEFAULT 'activo', -- activo, inactivo, visitante
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Grupos (Ministerios, Células, Departamentos)
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    group_type VARCHAR(50), -- ministerio, celula, clase, etc.
    leader_id INT REFERENCES members(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Miembros en Grupos (Relación N:M)
CREATE TABLE IF NOT EXISTS group_members (
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'miembro', -- lider, subjefe, miembro
    PRIMARY KEY (group_id, member_id)
);

-- 6. Tabla de Reuniones/Eventos
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP NOT NULL,
    meeting_type VARCHAR(50), -- servicio, celula, evento
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Asistencia
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    meeting_id INT REFERENCES meetings(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    is_present BOOLEAN DEFAULT true,
    notes TEXT,
    UNIQUE(meeting_id, member_id)
);

-- 8. Tabla de Periodos (Para control financiero y de gestión)
CREATE TABLE IF NOT EXISTS periods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Ej: "Septiembre 2023"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'abierto', -- abierto, cerrado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla de Finanzas (Ingresos, Diezmos, Ofrendas, Egresos)
CREATE TABLE IF NOT EXISTS finances (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL, -- ingreso, egreso
    category VARCHAR(50) NOT NULL, -- diezmo, ofrenda, donacion, pago, etc.
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    member_id INT REFERENCES members(id) ON DELETE SET NULL,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    period_id INT REFERENCES periods(id) ON DELETE SET NULL,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES (Para Pruebas / Configuración)
-- ==============================================================================
-- Contraseña admin por defecto: "admin123" hacheada con bcrypt (Asumiendo 10 rounds)
-- Generado usando bcrypt: $2b$10$O0O/Gz7R8r5D/3/wXy5QvuzJ5k4D6q5D/3/wXy5QvuzJ5k4D6q5D  <-- (Esto es solo un ejemplo, se debe crear reales desde la app)
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Administrador', 'admin@sistemaiglesia.com', '$2b$10$tMhIfE.hY8O4j2y69gU79uFj3s003OOM0M0M0M0M0M0M0M0M0M0M0', 'admin') ON CONFLICT (email) DO NOTHING;

INSERT INTO locations (name, address, city, country) 
VALUES ('Sede Central', 'Av. Principal', 'Ciudad', 'País') ON CONFLICT DO NOTHING;
