const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting WealthWise Backend...');

// Check if database exists, if not, seed it
const dbPath = './database.sqlite';
const shouldSeed = !fs.existsSync(dbPath);

if (shouldSeed) {
  console.log('📊 Seeding database with demo data...');
  exec('node seed-dummy-data.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Seeding failed:', error);
      // Continue anyway, might work without seeding
    } else {
      console.log('✅ Database seeded successfully');
    }
    
    // Start the server
    console.log('🌟 Starting server...');
    require('./server.js');
  });
} else {
  console.log('📦 Database exists, starting server...');
  require('./server.js');
}