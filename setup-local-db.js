
import { exec } from 'child_process';
import fs from 'fs';

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('Creating .env file with local database connection...');
  fs.writeFileSync('.env', 'DATABASE_URL=postgresql://postgres:1234@localhost:3307/Ashe\n');
  console.log('.env file created');
} else {
  console.log('.env file already exists');
}

console.log('\nRunning database migrations...');
exec('npx drizzle-kit push', (error, stdout, stderr) => {
  if (error) {
    console.error('Error running migrations:', error);
    return;
  }
  
  console.log(stdout);
  if (stderr) console.error(stderr);
  
  console.log('\nDatabase setup complete!');
  console.log('\nTo run the application, use: npm run dev');
});
