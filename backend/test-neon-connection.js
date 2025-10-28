// Test Neon database connection
// Run with: node test-neon-connection.js

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testNeonConnection() {
  console.log('🔗 Testing Neon database connection...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env file');
    console.log('Please add your Neon connection string to backend/.env');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('neon.tech') 
      ? { rejectUnauthorized: false } 
      : false,
  });

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Connected to Neon database successfully!');

    // Test database info
    console.log('\n2. Getting database info...');
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log(`✅ Database: ${result.rows[0].current_database}`);
    console.log(`✅ User: ${result.rows[0].current_user}`);
    console.log(`✅ PostgreSQL Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);

    // Test if tables exist
    console.log('\n3. Checking for existing tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('✅ Found existing tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('ℹ️  No tables found - ready for migration');
    }

    client.release();
    console.log('\n🎉 Neon database is ready!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run db:migrate');
    console.log('2. Run: npm run db:seed');
    console.log('3. Run: npm run dev');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Neon connection string in .env file');
    console.log('2. Make sure your Neon project is active');
    console.log('3. Verify the connection string includes ?sslmode=require');
    console.log('4. Check if your IP is allowed (Neon allows all by default)');
  } finally {
    await pool.end();
  }
}

testNeonConnection();