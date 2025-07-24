const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add imports for real database and components
if (!content.includes('realDatabase')) {
  content = content.replace(
    "import { initializeRealData } from './utils/initializeRealData';",
    "import { initializeRealData } from './utils/initializeRealData';\nimport { realDatabase, migrateToRealData } from './utils/realDatabase';\nimport { RealUserDashboard } from './components/RealUserDashboard';"
  );
}

// Update the useEffect to use real data
const oldUseEffect = `  // Check for existing session on app load and initialize real data
  useEffect(() => {
    // Initialize with realistic data
    initializeRealData();
    
    const session = authManager.getCurrentSession();
    if (session && authManager.isSessionValid(session)) {
      setUser(session.user);
      setCurrentSession(session);
    }
    setIsLoading(false);
  }, []);`;

const newUseEffect = `  // Check for existing session on app load and initialize real data
  useEffect(() => {
    // Migrate to real data structure
    migrateToRealData();
    
    const session = authManager.getCurrentSession();
    if (session && authManager.isSessionValid(session)) {
      setUser(session.user);
      setCurrentSession(session);
    }
    setIsLoading(false);
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);

// Update the user dashboard section to use RealUserDashboard for real users
const oldUserDashboard = `    } else {
      return (
        <UserDashboard 
          user={user} 
          onLogout={handleLogout}
          onPurchase={handlePurchase}
        />
      );
    }`;

const newUserDashboard = `    } else {
      // Check if this is a real user (has a real database ID format)
      const isRealUser = user.id.includes('_') || user.email !== 'parent@demo.com';
      
      if (isRealUser) {
        return (
          <RealUserDashboard 
            user={user} 
            onLogout={handleLogout}
          />
        );
      } else {
        return (
          <UserDashboard 
            user={user} 
            onLogout={handleLogout}
            onPurchase={handlePurchase}
          />
        );
      }
    }`;

content = content.replace(oldUserDashboard, newUserDashboard);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('App updated to use real database and real user dashboard!');