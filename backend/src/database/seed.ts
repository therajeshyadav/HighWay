import { randomUUID } from 'crypto';
import pool from '../config/database.js';

const experiences = [
  {
    id: '1',
    title: 'Kayaking',
    location: 'Udupi',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/kayaking-mangrove',
    border_color: 'pink',
    about: 'Scenic routes, trained guides, and safety briefing. Minimum age 10. Helmet and Life jackets along with an expert will accompany in kayaking.'
  },
  {
    id: '2',
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. First with gear included.',
    price: 899,
    image: '/nandi-hills-sunrise',
    border_color: 'yellow',
    about: 'Experience the breathtaking sunrise from Nandi Hills. Perfect for photography enthusiasts and nature lovers.'
  },
  {
    id: '3',
    title: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    image: '/coffee-trail',
    border_color: 'blue',
    about: 'Walk through scenic coffee plantations, learn about coffee cultivation, and enjoy fresh brewed coffee.'
  },
  {
    id: '4',
    title: 'Kayaking',
    location: 'Udupi, Karnataka',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/kayaking-sunset',
    border_color: 'green',
    about: 'Evening kayaking experience with golden hour views. Perfect for beginners and experienced kayakers.'
  },
  {
    id: '5',
    title: 'Boat Cruise',
    location: 'Sunderbans',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/boat-cruise',
    border_color: 'yellow',
    about: 'Relaxing boat cruise through scenic waterways. Enjoy the tranquility and natural beauty.'
  },
  {
    id: '6',
    title: 'Bunjee Jumping',
    location: 'Manali',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/bunjee-jumping',
    border_color: 'pink',
    about: 'Adrenaline-pumping bungee jumping experience. All safety equipment and certified instructors provided.'
  },
  {
    id: '7',
    title: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    image: '/coffee-trail-mist',
    border_color: 'green',
    about: 'Misty morning coffee plantation walk. Experience the magic of fog-covered coffee estates.'
  },
  {
    id: '8',
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    image: '/nandi-hills-sunrise',
    border_color: 'pink',
    about: 'Early morning trek to witness spectacular sunrise views from Nandi Hills.'
  }
];

const timeSlots = [
  { time: '07:00 am', totalSlots: 6 },
  { time: '09:00 am', totalSlots: 8 },
  { time: '11:00 am', totalSlots: 5 },
  { time: '01:00 pm', totalSlots: 10 },
  { time: '05:00 am', totalSlots: 10 },
  { time: '05:30 am', totalSlots: 8 },
  { time: '06:00 am', totalSlots: 12 },
  { time: '08:00 am', totalSlots: 12 },
  { time: '10:00 am', totalSlots: 7 },
  { time: '02:00 pm', totalSlots: 4 },
  { time: '04:00 pm', totalSlots: 8 },
  { time: '05:00 pm', totalSlots: 5 },
  { time: '06:00 pm', totalSlots: 2 },
  { time: '12:00 pm', totalSlots: 10 },
  { time: '03:00 pm', totalSlots: 8 },
  { time: '04:30 am', totalSlots: 12 }
];

const dates = ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'];

const promoCodes = [
  {
    id: randomUUID(),
    code: 'SAVE10',
    discount_type: 'percentage',
    discount_value: 10,
    min_amount: 500,
    max_discount: 200,
    is_active: true
  },
  {
    id: randomUUID(),
    code: 'FLAT100',
    discount_type: 'fixed',
    discount_value: 100,
    min_amount: 800,
    is_active: true
  },
  {
    id: randomUUID(),
    code: 'WELCOME20',
    discount_type: 'percentage',
    discount_value: 20,
    min_amount: 1000,
    max_discount: 300,
    is_active: true
  }
];

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Seeding experiences...');
    
    // Clear existing data
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM experience_slots');
    await client.query('DELETE FROM promo_codes');
    await client.query('DELETE FROM experiences');
    
    // Insert experiences
    for (const exp of experiences) {
      await client.query(
        `INSERT INTO experiences (id, title, location, description, price, image, border_color, about)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [exp.id, exp.title, exp.location, exp.description, exp.price, exp.image, exp.border_color, exp.about]
      );
    }
    
    console.log('Seeding experience slots...');
    
    // Insert experience slots
    for (const exp of experiences) {
      for (const date of dates) {
        // Get random time slots for each experience
        const shuffledTimes = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2));
        
        for (const slot of shuffledTimes) {
          const slotId = randomUUID();
          const bookedSlots = Math.floor(Math.random() * (slot.totalSlots / 2)); // Random booked slots
          
          await client.query(
            `INSERT INTO experience_slots (id, experience_id, date, time, total_slots, booked_slots)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [slotId, exp.id, date, slot.time, slot.totalSlots, bookedSlots]
          );
        }
      }
    }
    
    console.log('Seeding promo codes...');
    
    // Insert promo codes
    for (const promo of promoCodes) {
      await client.query(
        `INSERT INTO promo_codes (id, code, discount_type, discount_value, min_amount, max_discount, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [promo.id, promo.code, promo.discount_type, promo.discount_value, promo.min_amount, promo.max_discount, promo.is_active]
      );
    }
    
    await client.query('COMMIT');
    console.log('Database seeded successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });