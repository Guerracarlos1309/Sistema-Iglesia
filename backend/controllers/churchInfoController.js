const db = require('../config/db');

/**
 * Get church global information
 */
exports.getChurchInfo = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM church_info WHERE id = 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Información de la iglesia no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching church info:', error);
    res.status(500).json({ message: 'Error interno al obtener información de la iglesia' });
  }
};

/**
 * Update church global information
 */
exports.updateChurchInfo = async (req, res) => {
  const { name, slogan, phone, email, address, logo_url } = req.body;

  try {
    const result = await db.query(
      `UPDATE church_info 
       SET name = $1, slogan = $2, phone = $3, email = $4, address = $5, logo_url = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = 1 
       RETURNING *`,
      [name, slogan, phone, email, address, logo_url]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se pudo actualizar la información' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating church info:', error);
    res.status(500).json({ message: 'Error interno al actualizar la información de la iglesia' });
  }
};
