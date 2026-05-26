const fs = require('fs');
let c = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

// Remove imports
c = c.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';\r?\n/, '');

// Remove animation classes
c = c.replace(/ animate-bounce/g, '');
c = c.replace(/ animate-float/g, '');
c = c.replace(/ animate-pulse/g, '');
c = c.replace(/ hover-lift/g, '');

// Remove inline animation styles
c = c.replace(/ style=\{\{ animationDuration: '3s' \}\}/g, '');

// Remove AnimatePresence
c = c.replace(/<AnimatePresence mode="wait">\s*/g, '');
c = c.replace(/\s*<\/AnimatePresence>/g, '');

// Replace motion.form with form and strip motion props
c = c.replace(/<motion\.form[\s\S]*?onSubmit/g, '<form onSubmit');
c = c.replace(/<\/motion\.form>/g, '</form>');

fs.writeFileSync('src/components/LoginScreen.tsx', c);
console.log("Effects removed successfully.");
