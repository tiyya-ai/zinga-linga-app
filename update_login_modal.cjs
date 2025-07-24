const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'LoginModal.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the imports
if (!content.includes('realDatabase')) {
  content = content.replace(
    "import { authManager } from '../utils/auth';",
    "import { authManager } from '../utils/auth';\nimport { realDatabase } from '../utils/realDatabase';\nimport { RealUserRegistration } from './RealUserRegistration';"
  );
}

// Add UserPlus to the lucide imports
content = content.replace(
  'import { X, Mail, Lock, TreePine, Leaf, Sun, Shield, User as UserIcon, Crown, Sparkles, ArrowRight, Eye, EyeOff, AlertTriangle, CheckCircle, Clock } from \'lucide-react\';',
  'import { X, Mail, Lock, TreePine, Leaf, Sun, Shield, User as UserIcon, Crown, Sparkles, ArrowRight, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, UserPlus } from \'lucide-react\';'
);

// Add state for real registration
content = content.replace(
  'const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);',
  'const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);\n  const [showRealRegistration, setShowRealRegistration] = useState(false);'
);

// Add real user registration button
const realRegistrationButton = `
                {/* Real User Registration */}
                <button
                  onClick={() => setShowRealRegistration(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-mali font-bold py-4 px-6 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg">Create Real Account</div>
                      <div className="text-sm opacity-90">Join with your actual information</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>`;

// Insert the real registration button after the parent login button
content = content.replace(
  '                </button>',
  '                </button>' + realRegistrationButton
);

// Add the real registration modal at the end
const realRegistrationModal = `

      {/* Real User Registration Modal */}
      {showRealRegistration && (
        <RealUserRegistration
          onUserRegistered={(user) => {
            setShowRealRegistration(false);
            onLogin(user);
            onClose();
          }}
          onClose={() => setShowRealRegistration(false)}
        />
      )}`;

// Add before the closing div
content = content.replace(
  '    </div>\n  );\n};',
  '    </div>' + realRegistrationModal + '\n  );\n};'
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('LoginModal updated with real user registration!');