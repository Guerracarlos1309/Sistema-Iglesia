const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly' });
});

const authRoutes = require('./routes/authRoutes');
const createCrudRouter = require('./routes/crudRouterFactory');
const { protect, restrictTo } = require('./middlewares/authMiddleware');

// Custom Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/church-info', require('./routes/churchInfoRoutes'));

// Secure Users Module (Only for Admin)
app.use('/api/users', protect, restrictTo('admin'), createCrudRouter('users'));

// Generic CRUD Routes (Standard Protection logic inside factory)
app.use('/api/locations', createCrudRouter('locations'));
app.use('/api/members', createCrudRouter('members'));
app.use('/api/groups', createCrudRouter('groups'));
app.use('/api/meetings', createCrudRouter('meetings'));
app.use('/api/attendance', createCrudRouter('attendance'));
app.use('/api/finances', createCrudRouter('finances'));
app.use('/api/notifications', createCrudRouter('notifications'));

// Lookup Routes (No Soft Delete needed for metadata)
const lookupOptions = { softDelete: false };
app.use('/api/lookups/member-statuses', createCrudRouter('member_statuses', lookupOptions));
app.use('/api/lookups/growth-steps', createCrudRouter('growth_steps', lookupOptions));
app.use('/api/lookups/group-types', createCrudRouter('group_types', lookupOptions));
app.use('/api/lookups/announcement-categories', createCrudRouter('announcement_categories', lookupOptions));
app.use('/api/lookups/transaction-categories', createCrudRouter('transaction_categories', lookupOptions));
app.use('/api/lookups/payment-methods', createCrudRouter('payment_methods', lookupOptions));
app.use('/api/lookups/genders', createCrudRouter('genders', lookupOptions));
app.use('/api/lookups/marital-statuses', createCrudRouter('marital_statuses', lookupOptions));
app.use('/api/lookups/relationship-types', createCrudRouter('relationship_types', lookupOptions));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
