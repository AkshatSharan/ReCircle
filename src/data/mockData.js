export const currentUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  greenScore: 1250,
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  joinedDate: '2024-01-15'
};

export const mockItems = [
  {
    id: '1',
    title: 'Vintage Wooden Coffee Table',
    description: 'Beautiful solid wood coffee table in excellent condition. Perfect for someone who loves vintage furniture!',
    category: 'Furniture',
    condition: 'excellent',
    images: ['https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500'],
    owner: {
      id: '2',
      name: 'Sarah Miller',
      email: 'sarah@example.com',
      greenScore: 980,
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedDate: '2024-02-01'
    },
    location: 'Downtown Seattle',
    createdAt: '2024-03-10'
  },
  {
    id: '2',
    title: "Kids' Art Supplies Bundle",
    description: 'Gently used art supplies including crayons, markers, colored pencils, and sketch pads. Great for creative kids!',
    category: 'Toys & Games',
    condition: 'good',
    images: ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=500'],
    owner: {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      greenScore: 1520,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedDate: '2023-12-20'
    },
    location: 'Bellevue',
    createdAt: '2024-03-12'
  },
  {
    id: '3',
    title: 'Designer Handbag Collection',
    description: 'Three beautiful handbags in various styles. All authentic and well-maintained. Perfect for someone who loves fashion!',
    category: 'Fashion',
    condition: 'excellent',
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500'],
    owner: {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      greenScore: 2100,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedDate: '2023-11-10'
    },
    location: 'Capitol Hill',
    createdAt: '2024-03-13'
  }
];

export const leaderboard = [
  {
    user: {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      greenScore: 2100,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedDate: '2023-11-10'
    },
    rank: 1,
    score: 2100,
    badge: '🌟'
  },
  {
    user: {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      greenScore: 1520,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedDate: '2023-12-20'
    },
    rank: 2,
    score: 1520,
    badge: '🥈'
  },
  {
    user: currentUser,
    rank: 3,
    score: 1250,
    badge: '🥉'
  },
  {
    user: {
      id: '2',
      name: 'Sarah Miller',
      email: 'sarah@example.com',
      greenScore: 980,
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinedDate: '2024-02-01'
    },
    rank: 4,
    score: 980
  }
];

export const donationCenters = [
  {
    id: '1',
    name: 'Goodwill Seattle',
    address: '1400 S Lane St, Seattle, WA 98144',
    lat: 47.5928,
    lng: -122.3059,
    type: 'donation',
    phone: '(206) 329-1000',
    hours: 'Mon-Sat 9AM-8PM, Sun 10AM-6PM'
  },
  {
    id: '2',
    name: 'Seattle Recycling Center',
    address: '8100 2nd Ave S, Seattle, WA 98108',
    lat: 47.5203,
    lng: -122.3244,
    type: 'recycling',
    phone: '(206) 684-3000',
    hours: 'Mon-Fri 8AM-5PM, Sat 9AM-4PM'
  },
  {
    id: '3',
    name: 'Best Buy Electronics Recycling',
    address: '302 NE 45th St, Seattle, WA 98105',
    lat: 47.6617,
    lng: -122.3206,
    type: 'electronics',
    phone: '(206) 632-2378',
    hours: 'Mon-Sun 10AM-9PM'
  }
];

export const achievements = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first item swap',
    icon: '👟',
    points: 50,
    unlocked: true,
    unlockedAt: '2024-03-01'
  },
  {
    id: '2',
    title: 'Recycling Champion',
    description: 'Scan and recycle 10 items',
    icon: '♻️',
    points: 100,
    unlocked: true,
    unlockedAt: '2024-03-05'
  },
  {
    id: '3',
    title: 'Community Helper',
    description: 'Help 5 people through the chat assistant',
    icon: '🤝',
    points: 75,
    unlocked: false
  },
  {
    id: '4',
    title: 'Green Warrior',
    description: 'Reach 1000 Green Score points',
    icon: '🌱',
    points: 200,
    unlocked: true,
    unlockedAt: '2024-03-08'
  }
];
