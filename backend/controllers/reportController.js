const db = require('../config/db');

/**
 * Controller for Reporting Motor
 * Generates statistics and PDF data
 */
const reportController = {
  getStats: async (req, res) => {
    try {
      // Metrics for the admin dashboard
      // We assume status_id = 1 means 'Activo' based on database.sql
      const membersCount = await db.query('SELECT COUNT(*) FROM members WHERE status_id = 1 AND deleted_at IS NULL');
      const groupsCount = await db.query('SELECT COUNT(*) FROM groups WHERE active = $1 AND deleted_at IS NULL', [true]);
      const locationsCount = await db.query('SELECT COUNT(*) FROM locations WHERE deleted_at IS NULL');
      
      const finances = await db.query(`
        SELECT 
          SUM(CASE WHEN tc.type = 'ingreso' THEN f.amount ELSE 0 END) as ingresos,
          SUM(CASE WHEN tc.type = 'egreso' THEN f.amount ELSE 0 END) as egresos
        FROM finances f
        JOIN transaction_categories tc ON f.category_id = tc.id
        WHERE f.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
          AND f.deleted_at IS NULL
      `);

      res.json({
        members: parseInt(membersCount.rows[0].count),
        groups: parseInt(groupsCount.rows[0].count),
        locations: parseInt(locationsCount.rows[0].count),
        monthlyFinances: {
          ingresos: parseFloat(finances.rows[0].ingresos || 0),
          egresos: parseFloat(finances.rows[0].egresos || 0),
          balance: parseFloat(finances.rows[0].ingresos || 0) - parseFloat(finances.rows[0].egresos || 0)
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Error generating statistics' });
    }
  },

  getFinancialReport: async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const result = await db.query(`
        SELECT * FROM finances 
        WHERE transaction_date BETWEEN $1 AND $2 
        ORDER BY transaction_date DESC
      `, [startDate, endDate]);
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching financial report' });
    }
  }
};

module.exports = reportController;
