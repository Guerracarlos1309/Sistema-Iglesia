const db = require('./backend/config/db');

async function checkSchema() {
  try {
    const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    console.log('Columns in users table:');
    res.rows.forEach(row => console.log('- ' + row.column_name));
    process.exit(0);
  } catch (err) {
    console.error('Error checking schema:', err);
    process.exit(1);
  }
}

checkSchema();
