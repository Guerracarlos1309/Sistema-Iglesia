const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('🌱 Iniciando siembra de datos demo...');
  
  try {
    // 1. Sedes (Locations)
    console.log('📍 Insertando sedes...');
    const locationsResult = await db.query(`
      INSERT INTO locations (name, address, city, country, capacity, status)
      VALUES 
      ('Sede Central', 'Av. Principal 123', 'Ciudad de Fe', 'País Bendecido', 500, 'operativo'),
      ('Sede Norte', 'Calle Esperanza 45', 'Villa Esperanza', 'País Bendecido', 150, 'operativo')
      RETURNING id
    `);
    const mainLocationId = locationsResult.rows[0].id;

    // 2. Miembros (Members)
    console.log('👥 Insertando miembros...');
    // Asumiendo IDs de Lookups (1: Masculino, 2: Femenino | 1: Activo | 1: Nuevo Creyente)
    const membersResult = await db.query(`
      INSERT INTO members (first_name, last_name, email, phone, gender_id, marital_status_id, status_id, location_id)
      VALUES 
      ('Juan', 'Pérez', 'juan.perez@email.com', '555-0101', 1, 1, 1, $1),
      ('María', 'García', 'maria.g@email.com', '555-0102', 2, 2, 1, $1),
      ('Carlos', 'Sánchez', 'carlos.s@email.com', '555-0103', 1, 1, 1, $1),
      ('Ana', 'Martínez', 'ana.m@email.com', '555-0104', 2, 1, 1, $1),
      ('Pedro', 'López', 'pedro.l@email.com', '555-0105', 1, 2, 1, $1)
      RETURNING id
    `, [mainLocationId]);
    const leaderId = membersResult.rows[0].id;
    const memberId = membersResult.rows[1].id;

    // 3. Grupos (Groups)
    console.log('🕸️ Insertando grupos...');
    const groupsResult = await db.query(`
      INSERT INTO groups (name, description, group_type_id, leader_id, location_id, schedule_day, schedule_time)
      VALUES 
      ('Célula de Jóvenes', 'Grupo enfocado en jóvenes de 18-25 años', 4, $1, $2, 'Sábado', '18:00:00'),
      ('Estudio Bíblico Matutino', 'Estudio profundo de las escrituras', 3, $1, $2, 'Martes', '09:00:00')
      RETURNING id
    `, [leaderId, mainLocationId]);
    const groupId = groupsResult.rows[0].id;

    // 4. Reuniones (Meetings)
    console.log('📅 Insertando reuniones...');
    const meetingResult = await db.query(`
      INSERT INTO meetings (title, description, meeting_date, meeting_type, location_id)
      VALUES 
      ('Servicio Dominical', 'Servicio principal de alabanza y palabra', CURRENT_TIMESTAMP + INTERVAL '1 day', 'Culminación', $1),
      ('Vigilia de Oración', 'Noche de intercesión', CURRENT_TIMESTAMP + INTERVAL '3 days', 'Oración', $1)
      RETURNING id
    `, [mainLocationId]);
    const meetingId = meetingResult.rows[0].id;

    // 5. Asistencia (Attendance)
    console.log('📝 Registrando asistencia...');
    await db.query(`
      INSERT INTO attendance (meeting_id, member_id, status)
      VALUES ($1, $2, 'presente'), ($1, $3, 'presente')
    `, [meetingId, leaderId, memberId]);

    // 6. Finanzas (Finances)
    console.log('💰 Insertando finanzas...');
    await db.query(`
      INSERT INTO finances (category_id, amount, transaction_date, payment_method_id, description, location_id)
      VALUES 
      (1, 1500.00, CURRENT_DATE, 2, 'Diezmos generales mes actual', $1),
      (2, 450.50, CURRENT_DATE, 1, 'Ofrendas Servicio Domingo', $1),
      (4, 200.00, CURRENT_DATE, 1, 'Pago mantenimiento aire acondicionado', $1)
    `, [mainLocationId]);

    // 7. Anuncios (Announcements)
    console.log('📣 Insertando anuncios...');
    await db.query(`
      INSERT INTO announcements (title, content, category_id, status)
      VALUES 
      ('Gran Congreso de Liderazgo', 'Te invitamos a participar en nuestro próximo congreso anual.', 1, 'published'),
      ('Campaña de Ayuda Social', 'Recolectamos alimentos no perecederos este fin de semana.', 2, 'published')
    `);

    console.log('✅ Siembra de datos completada con éxito.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error durante la siembra de datos:', err);
    process.exit(1);
  }
}

seed();
