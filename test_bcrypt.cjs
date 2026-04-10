const bcrypt = require('bcrypt');

async function testBcrypt() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Hash:', hash);
    const match = await bcrypt.compare('admin123', hash);
    console.log('Match:', match);
    process.exit(0);
  } catch (err) {
    console.error('Bcrypt error:', err);
    process.exit(1);
  }
}

testBcrypt();
