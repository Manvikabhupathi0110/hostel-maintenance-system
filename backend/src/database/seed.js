const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Seeding database...');

    // Create sample users
    const passwordHash = await bcrypt.hash('password123', 10);

    const usersQuery = `
      INSERT INTO users (name, email, phone, password_hash, role) VALUES
      ('Admin User', 'admin@hostel.com', '9999999999', $1, 'admin'),
      ('Warden John', 'warden@hostel.com', '9876543210', $1, 'warden'),
      ('Student Alice', 'alice@hostel.com', '9123456789', $1, 'student'),
      ('Student Bob', 'bob@hostel.com', '9234567890', $1, 'student'),
      ('Electrician Raj', 'raj@hostel.com', '9345678901', $1, 'electrician'),
      ('Electrician Kumar', 'kumar@hostel.com', '9456789012', $1, 'electrician')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, role;
    `;
    const usersResult = await pool.query(usersQuery, [passwordHash]);
    console.log('✅ Users seeded:', usersResult.rows.length);

    // Get electrician user IDs
    const electricianUsers = await pool.query(
      "SELECT id FROM users WHERE role = 'electrician'"
    );

    for (const user of electricianUsers.rows) {
      await pool.query(
        `INSERT INTO electricians (user_id, experience_years, specialization, bio)
         VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO NOTHING`,
        [user.id, Math.floor(Math.random() * 10) + 1, 'General Electrical', 'Experienced electrician']
      );
    }
    console.log('✅ Electrician profiles seeded');

    // Create sample hostels
    const wardenUser = await pool.query("SELECT id FROM users WHERE role = 'warden' LIMIT 1");
    const wardenId = wardenUser.rows[0]?.id;

    const hostelsQuery = `
      INSERT INTO hostels (name, hostel_type, total_rooms, warden_id, location) VALUES
      ('Boys Hostel A', 'boys', 50, $1, 'Block A, Campus North'),
      ('Boys Hostel B', 'boys', 60, $1, 'Block B, Campus North'),
      ('Girls Hostel A', 'girls', 45, $1, 'Block C, Campus South'),
      ('Girls Hostel B', 'girls', 55, $1, 'Block D, Campus South'),
      ('Girls Hostel C', 'girls', 40, $1, 'Block E, Campus South')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;
    const hostelsResult = await pool.query(hostelsQuery, [wardenId]);
    console.log('✅ Hostels seeded:', hostelsResult.rows.length);

    // Create sample rooms for each hostel
    const hostels = await pool.query('SELECT id FROM hostels LIMIT 5');
    for (const hostel of hostels.rows) {
      for (let floor = 1; floor <= 3; floor++) {
        for (let roomNum = 1; roomNum <= 5; roomNum++) {
          const roomNumber = `${floor}0${roomNum}`;
          await pool.query(
            `INSERT INTO rooms (hostel_id, room_number, floor, capacity, occupants)
             VALUES ($1, $2, $3, 2, 1) ON CONFLICT (hostel_id, room_number) DO NOTHING`,
            [hostel.id, roomNumber, floor]
          );
        }
      }
    }
    console.log('✅ Rooms seeded');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample credentials:');
    console.log('  Admin:       admin@hostel.com / password123');
    console.log('  Warden:      warden@hostel.com / password123');
    console.log('  Student:     alice@hostel.com / password123');
    console.log('  Electrician: raj@hostel.com / password123');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();