const db = require('../config/db');

// A generic factory for common CRUD operations with Soft Delete support
const genericCrudController = (tableName, options = {}) => {
  const { softDelete = true } = options;

  return {
    getAll: async (req, res) => {
      try {
        const showDeleted = req.query.deleted === 'true';
        let query = `SELECT * FROM ${tableName}`;
        
        if (softDelete && !showDeleted) {
          query += ` WHERE deleted_at IS NULL`;
        } else if (softDelete && showDeleted) {
          query += ` WHERE deleted_at IS NOT NULL`;
        }
        
        query += ` ORDER BY id DESC`;
        
        const result = await db.query(query);
        res.json(result.rows);
      } catch (error) {
        console.error(`❌ CRUD Error on GET ALL [${tableName}]:`, {
          message: error.message,
          detail: error.detail,
          hint: error.hint,
          query: query
        });
        res.status(500).json({ 
          message: 'Error al obtener datos', 
          error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
      }
    },
    
    getById: async (req, res) => {
      try {
        const result = await db.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
      }
    },

    create: async (req, res) => {
      try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        if (keys.length === 0) return res.status(400).json({ message: 'No se enviaron datos' });

        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');

        const queryText = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await db.query(queryText, values);
        
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error(`Error creating in ${tableName}:`, error);
        if (error.code === '23505') {
          return res.status(400).json({ 
            message: 'Ya existe un registro con estos datos únicos (ej: correo electrónico)',
            field: error.detail 
          });
        }
        res.status(500).json({ message: 'Error al crear registro', error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        if (keys.length === 0) return res.status(400).json({ message: 'No se enviaron datos' });

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        values.push(req.params.id);

        const queryText = `UPDATE ${tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
        const result = await db.query(queryText, values);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }
        
        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Error updating in ${tableName}:`, error);
        if (error.code === '23505') {
          return res.status(400).json({ 
            message: 'Los datos actualizados entran en conflicto con un registro existente (ej: correo ya en uso)' 
          });
        }
        res.status(500).json({ message: 'Error al actualizar registro' });
      }
    },

    remove: async (req, res) => {
      try {
        const hardDeleteParam = req.query.hard === 'true';
        let result;

        if (softDelete && !hardDeleteParam) {
          // Soft delete (Archivado)
          result = await db.query(`UPDATE ${tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`, [req.params.id]);
        } else {
          // Hard delete (Eliminado permanente)
          result = await db.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);
        }

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ 
          message: (softDelete && !hardDeleteParam) ? 'Registro archivado correctamente' : 'Registro eliminado permanentemente' 
        });
      } catch (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        res.status(500).json({ message: 'Error al eliminar registro' });
      }
    },

    restore: async (req, res) => {
      if (!softDelete) return res.status(400).json({ message: 'Esta tabla no soporta restauración' });
      try {
        const result = await db.query(`UPDATE ${tableName} SET deleted_at = NULL WHERE id = $1 RETURNING *`, [req.params.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Error restoring in ${tableName}:`, error);
        res.status(500).json({ message: 'Error al restaurar registro' });
      }
    }
  };
};

module.exports = genericCrudController;
