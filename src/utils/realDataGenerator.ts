import { User, Module, Purchase } from '../types';

// Real-looking names and data for generating authentic users
const firstNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett',
  'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
  'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew',
  'Sarah', 'Jessica', 'Ashley', 'Amanda', 'Stephanie', 'Jennifer', 'Nicole', 'Samantha', 'Katherine', 'Amy',
  'Angela', 'Melissa', 'Brenda', 'Emma', 'Olivia', 'Rachel', 'Julie', 'Heather', 'Michelle', 'Kimberly',
  'Michael', 'Christopher', 'Matthew', 'Joshua', 'David', 'Andrew', 'Daniel', 'James', 'Justin', 'Joseph',
  'Robert', 'Ryan', 'Brandon', 'Jason', 'Jonathan', 'Nicholas', 'Anthony', 'William', 'Kevin', 'Zachary'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson'
];

const emailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 
  'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'cox.net', 'charter.net'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston',
  'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis',
  'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
  'Kansas City', 'Mesa', 'Virginia Beach', 'Atlanta', 'Colorado Springs', 'Omaha', 'Raleigh',
  'Miami', 'Oakland', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita', 'Arlington', 'Tampa'
];

export class RealDataGenerator {
  private usedEmails = new Set<string>();

  // Generate a realistic user
  generateUser(isAdmin = false): User {
    const firstName = this.getRandomItem(firstNames);
    const lastName = this.getRandomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    
    let email: string;
    do {
      const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}`;
      const domain = this.getRandomItem(emailDomains);
      email = `${emailPrefix}@${domain}`;
    } while (this.usedEmails.has(email));
    
    this.usedEmails.add(email);

    const createdAt = this.getRandomDateInPast(365); // Up to 1 year ago
    const lastLogin = this.getRandomDateBetween(createdAt, new Date());

    return {
      id: this.generateId('user'),
      email,
      name,
      role: isAdmin ? 'admin' : 'user',
      purchasedModules: [],
      createdAt: createdAt.toISOString(),
      lastLogin: lastLogin.toISOString(),
      totalSpent: 0
    };
  }

  // Generate realistic purchase data
  generatePurchase(userId: string, moduleIds: string[], modules: Module[]): Purchase {
    const amount = moduleIds.reduce((sum, moduleId) => {
      const module = modules.find(m => m.id === moduleId);
      return sum + (module?.price || 0);
    }, 0);

    const createdAt = this.getRandomDateInPast(180); // Up to 6 months ago
    const status = Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed');
    
    const paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'];
    const paymentMethod = this.getRandomItem(paymentMethods);

    const purchase: Purchase = {
      id: this.generateId('purchase'),
      userId,
      moduleIds,
      amount,
      status: status as 'completed' | 'pending' | 'failed',
      paymentMethod,
      createdAt: createdAt.toISOString()
    };

    if (status === 'completed') {
      purchase.completedAt = createdAt.toISOString();
    }

    return purchase;
  }

  // Generate realistic modules with African theme
  generateAfricanModule(character: 'kiki' | 'trae'): Module {
    const kikiModules = [
      {
        title: "Kiki's African Animal Safari",
        description: "Join Kiki as she explores the African savanna and meets amazing animals like lions, elephants, and giraffes!"
      },
      {
        title: "Kiki's Swahili Adventure",
        description: "Learn basic Swahili words and phrases with Kiki while exploring East African culture!"
      },
      {
        title: "Kiki's African Music Journey",
        description: "Discover traditional African instruments and rhythms with Kiki's musical adventures!"
      },
      {
        title: "Kiki's Baobab Tree Stories",
        description: "Listen to ancient African folktales under the magical baobab tree with Kiki!"
      },
      {
        title: "Kiki's African Art Workshop",
        description: "Create beautiful African-inspired art and crafts with Kiki as your guide!"
      }
    ];

    const traeModules = [
      {
        title: "Trae's African Alphabet Quest",
        description: "Help Trae learn the alphabet using African animals and landmarks in this educational adventure!"
      },
      {
        title: "Trae's Counting with African Animals",
        description: "Practice counting and basic math with Trae and his African animal friends!"
      },
      {
        title: "Trae's African Geography Explorer",
        description: "Explore the diverse landscapes of Africa with Trae, from deserts to rainforests!"
      },
      {
        title: "Trae's African Culture Discovery",
        description: "Learn about different African cultures, traditions, and celebrations with Trae!"
      },
      {
        title: "Trae's Problem-Solving Safari",
        description: "Solve puzzles and challenges while on safari with Trae across the African continent!"
      }
    ];

    const moduleData = character === 'kiki' ? this.getRandomItem(kikiModules) : this.getRandomItem(traeModules);
    
    const ageRanges = ['2-4 years', '3-5 years', '4-6 years', '3-6 years', '4-7 years', '5-8 years'];
    const prices = [19.99, 24.99, 29.99, 34.99];
    
    const createdAt = this.getRandomDateInPast(365);
    const rating = 4.0 + Math.random() * 1.0; // 4.0 to 5.0
    const totalRatings = Math.floor(Math.random() * 300) + 50; // 50 to 350 ratings

    return {
      id: this.generateId('module'),
      title: moduleData.title,
      description: moduleData.description,
      character,
      price: this.getRandomItem(prices),
      ageRange: this.getRandomItem(ageRanges),
      isActive: Math.random() > 0.1, // 90% active
      rating: Math.round(rating * 10) / 10,
      totalRatings,
      createdAt: createdAt.toISOString(),
      fullContent: this.generateModuleContent()
    };
  }

  // Generate realistic module content
  private generateModuleContent() {
    const contentTypes = ['video', 'game', 'audio'] as const;
    const videoTitles = [
      'Welcome Adventure', 'Character Introduction', 'Learning Journey', 'Fun Activities',
      'Story Time', 'Sing Along', 'Dance Party', 'Exploration Time'
    ];
    const gameTitles = [
      'Memory Match', 'Puzzle Challenge', 'Color Quest', 'Shape Sorter',
      'Counting Game', 'Letter Hunt', 'Animal Sounds', 'Pattern Play'
    ];
    const audioTitles = [
      'Theme Song', 'Lullaby Time', 'Learning Songs', 'Story Narration',
      'Sound Effects', 'Music Box', 'Rhyme Time', 'Peaceful Sounds'
    ];

    const content = [];
    const numItems = Math.floor(Math.random() * 8) + 5; // 5 to 12 items

    for (let i = 0; i < numItems; i++) {
      const type = this.getRandomItem(contentTypes);
      let title: string;
      let duration: number;

      switch (type) {
        case 'video':
          title = this.getRandomItem(videoTitles);
          duration = Math.floor(Math.random() * 300) + 120; // 2-7 minutes
          break;
        case 'game':
          title = this.getRandomItem(gameTitles);
          duration = Math.floor(Math.random() * 600) + 180; // 3-13 minutes
          break;
        case 'audio':
          title = this.getRandomItem(audioTitles);
          duration = Math.floor(Math.random() * 240) + 60; // 1-5 minutes
          break;
      }

      content.push({
        id: this.generateId('content'),
        type,
        title,
        duration
      });
    }

    return content;
  }

  // Generate a batch of realistic users
  generateRealisticUsers(count: number): User[] {
    const users: User[] = [];
    
    // Always include admin
    users.push({
      id: 'admin-001',
      email: 'admin@zingalinga.com',
      name: 'System Administrator',
      role: 'admin',
      purchasedModules: [],
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date().toISOString(),
      totalSpent: 0
    });

    // Generate regular users
    for (let i = 0; i < count - 1; i++) {
      users.push(this.generateUser());
    }

    return users;
  }

  // Generate realistic purchases for users
  generateRealisticPurchases(users: User[], modules: Module[]): { users: User[], purchases: Purchase[] } {
    const purchases: Purchase[] = [];
    const updatedUsers = [...users];

    users.forEach((user, userIndex) => {
      if (user.role === 'admin') return;

      // 70% chance user has made at least one purchase
      if (Math.random() < 0.7) {
        const numPurchases = Math.random() < 0.3 ? 2 : 1; // 30% chance of 2 purchases
        
        for (let i = 0; i < numPurchases; i++) {
          const numModules = Math.random() < 0.4 ? 2 : 1; // 40% chance of buying 2 modules
          const selectedModules = this.getRandomItems(modules, numModules);
          const moduleIds = selectedModules.map(m => m.id);
          
          const purchase = this.generatePurchase(user.id, moduleIds, modules);
          purchases.push(purchase);

          // Update user data if purchase is completed
          if (purchase.status === 'completed') {
            updatedUsers[userIndex].purchasedModules = [
              ...updatedUsers[userIndex].purchasedModules,
              ...moduleIds.filter(id => !updatedUsers[userIndex].purchasedModules.includes(id))
            ];
            updatedUsers[userIndex].totalSpent = (updatedUsers[userIndex].totalSpent || 0) + purchase.amount;
          }
        }
      }
    });

    return { users: updatedUsers, purchases };
  }

  // Utility methods
  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  private getRandomDateInPast(maxDaysAgo: number): Date {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  }

  private getRandomDateBetween(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate a complete realistic dataset
  generateCompleteDataset(userCount = 50, moduleCount = 12) {
    // Generate users
    const users = this.generateRealisticUsers(userCount);

    // Generate modules
    const modules: Module[] = [];
    for (let i = 0; i < moduleCount; i++) {
      const character = i % 2 === 0 ? 'kiki' : 'trae';
      modules.push(this.generateAfricanModule(character));
    }

    // Generate purchases
    const { users: updatedUsers, purchases } = this.generateRealisticPurchases(users, modules);

    return {
      users: updatedUsers,
      modules,
      purchases,
      contentFiles: [], // Will be populated as needed
      analytics: {
        totalUsers: updatedUsers.length,
        totalRevenue: purchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
        totalPurchases: purchases.length,
        activeModules: modules.filter(m => m.isActive).length,
        revenueByMonth: [],
        popularModules: [],
        userGrowth: []
      }
    };
  }
}

export const realDataGenerator = new RealDataGenerator();