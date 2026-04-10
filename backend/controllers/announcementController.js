const db = require('../config/db');

const announcementController = {
  getAll: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM announcements WHERE status = $1 ORDER BY published_at DESC', ['published']);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching announcements' });
    }
  },

  getAdminList: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admin announcements' });
    }
  },

  create: async (req, res) => {
    const { title, content, image_url, category, expires_at } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO announcements (title, content, image_url, category, expires_at, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, image_url, category, expires_at, req.user.id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating announcement' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { title, content, image_url, category, status, expires_at } = req.body;
    try {
      const result = await db.query(
        'UPDATE announcements SET title = $1, content = $2, image_url = $3, category = $4, status = $5, expires_at = $6 WHERE id = $7 RETURNING *',
        [title, content, image_url, category, status, expires_at, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error updating announcement' });
    }
  },

  delete: async (req, res) => {
    try {
      await db.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
      res.json({ message: 'Announcement deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting announcement' });
    }
  }
};

module.exports = announcementController;
