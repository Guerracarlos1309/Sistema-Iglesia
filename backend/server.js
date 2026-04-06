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

// Custom Routes
app.use('/api/auth', authRoutes);

// Generic CRUD Routes
app.use('/api/users', createCrudRouter('users'));
app.use('/api/locations', createCrudRouter('locations'));
app.use('/api/members', createCrudRouter('members'));
app.use('/api/groups', createCrudRouter('groups'));
app.use('/api/meetings', createCrudRouter('meetings'));
app.use('/api/attendance', createCrudRouter('attendance'));
app.use('/api/periods', createCrudRouter('periods'));
app.use('/api/finances', createCrudRouter('finances'));

// We handle group_members separately if needed, or through direct queries

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
