export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  image: string;
  borderColor: 'pink' | 'yellow' | 'blue' | 'green';
  about: string;
  availableDates: string[];
  availableTimes: { time: string; slotsLeft: number }[];
}

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Kayaking',
    location: 'Udupi',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/kayaking-mangrove',
    borderColor: 'pink',
    about: 'Scenic routes, trained guides, and safety briefing. Minimum age 10. Helmet and Life jackets along with an expert will accompany in kayaking.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '07:00 am', slotsLeft: 6 },
      { time: '09:00 am', slotsLeft: 2 },
      { time: '11:00 am', slotsLeft: 5 },
      { time: '01:00 pm', slotsLeft: 0 }
    ]
  },
  {
    id: '2',
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. First with gear included.',
    price: 899,
    image: '/nandi-hills-sunrise',
    borderColor: 'yellow',
    about: 'Experience the breathtaking sunrise from Nandi Hills. Perfect for photography enthusiasts and nature lovers.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '05:00 am', slotsLeft: 10 },
      { time: '05:30 am', slotsLeft: 8 },
      { time: '06:00 am', slotsLeft: 3 }
    ]
  },
  {
    id: '3',
    title: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    image: '/coffee-trail',
    borderColor: 'blue',
    about: 'Walk through scenic coffee plantations, learn about coffee cultivation, and enjoy fresh brewed coffee.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '08:00 am', slotsLeft: 12 },
      { time: '10:00 am', slotsLeft: 7 },
      { time: '02:00 pm', slotsLeft: 4 }
    ]
  },
  {
    id: '4',
    title: 'Kayaking',
    location: 'Udupi, Karnataka',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/kayaking-sunset',
    borderColor: 'green',
    about: 'Evening kayaking experience with golden hour views. Perfect for beginners and experienced kayakers.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '04:00 pm', slotsLeft: 8 },
      { time: '05:00 pm', slotsLeft: 5 },
      { time: '06:00 pm', slotsLeft: 2 }
    ]
  },
  {
    id: '5',
    title: 'Boat Cruise',
    location: 'Sunderbans',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/boat-cruise',
    borderColor: 'yellow',
    about: 'Relaxing boat cruise through scenic waterways. Enjoy the tranquility and natural beauty.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '09:00 am', slotsLeft: 15 },
      { time: '12:00 pm', slotsLeft: 10 },
      { time: '03:00 pm', slotsLeft: 8 }
    ]
  },
  {
    id: '6',
    title: 'Bunjee Jumping',
    location: 'Manali',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image: '/bunjee-jumping',
    borderColor: 'pink',
    about: 'Adrenaline-pumping bungee jumping experience. All safety equipment and certified instructors provided.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '10:00 am', slotsLeft: 6 },
      { time: '12:00 pm', slotsLeft: 4 },
      { time: '02:00 pm', slotsLeft: 3 }
    ]
  },
  {
    id: '7',
    title: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    image: '/coffee-trail-mist',
    borderColor: 'green',
    about: 'Misty morning coffee plantation walk. Experience the magic of fog-covered coffee estates.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '06:00 am', slotsLeft: 10 },
      { time: '07:00 am', slotsLeft: 8 },
      { time: '08:00 am', slotsLeft: 5 }
    ]
  },
  {
    id: '8',
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    image: '/nandi-hills-sunrise',
    borderColor: 'pink',
    about: 'Early morning trek to witness spectacular sunrise views from Nandi Hills.',
    availableDates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    availableTimes: [
      { time: '04:30 am', slotsLeft: 12 },
      { time: '05:00 am', slotsLeft: 9 },
      { time: '05:30 am', slotsLeft: 6 }
    ]
  }
];
