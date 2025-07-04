const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting WealthWise Backend...');

// Check if database exists, if not, seed it
const dbPath = './database.sqlite';
const shouldSeed = !fs.existsSync(dbPath);

// Force re-seeding in production to ensure demo user exists
const forceReseed = process.env.NODE_ENV === 'production' || process.env.FORCE_RESEED === 'true';

if (shouldSeed || forceReseed) {
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