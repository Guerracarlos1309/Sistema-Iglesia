const db = require('../config/db');

// A generic factory for common CRUD operations
const genericCrudController = (tableName) => {
  return {
    getAll: async (req, res) => {
      try {
        const result = await db.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
        res.json(result.rows);
      } catch (error) {
        console.error(`Error fetching ${tableName}:`, error);
        res.status(500).json({ message: 'Server error fetching data' });
      }
    },
    
    getById: async (req, res) => {
      try {
        const result = await db.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Record not found' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    },

    create: async (req, res) => {
      try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        if (keys.length === 0) return res.status(400).json({ message: 'No data provided' });

        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');

        const queryText = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await db.query(queryText, values);
        
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error(`Error creating in ${tableName}:`, error);
        res.status(500).json({ message: 'Error creating record', error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        if (keys.length === 0) return res.status(400).json({ message: 'No data provided' });

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        values.push(req.params.id); // Add id as the last parameter

        const queryText = `UPDATE ${tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
        const result = await db.query(queryText, values);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Record not found' });
        }
        
        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Error updating in ${tableName}:`, error);
        res.status(500).json({ message: 'Error updating record', error: error.message });
      }
    },

    remove: async (req, res) => {
      try {
        const result = await db.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
      } catch (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        res.status(500).json({ message: 'Error deleting record' });
      }
    }
  };
};

module.exports = genericCrudController;
