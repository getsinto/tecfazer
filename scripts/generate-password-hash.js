#!/usr/bin/env node

/**
 * Password Hash Generator for Tec Fazer
 * 
 * Usage:
 *   node scripts/generate-password-hash.js "YourPassword123"
 * 
 * Or run interactively:
 *   node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Password provided as argument
    const password = args[0];
    console.log('\n🔐 Generating password hash...\n');
    const hash = await generateHash(password);
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n✅ Copy the hash above to use in your database\n');
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter password to hash: ', async (password) => {
      if (!password) {
        console.log('❌ Password cannot be empty');
        rl.close();
        return;
      }

      console.log('\n🔐 Generating password hash...\n');
      const hash = await generateHash(password);
      console.log('Password:', password);
      console.log('Hash:', hash);
      console.log('\n✅ Copy the hash above to use in your database\n');
      
      rl.close();
    });
  }
}

main().catch(console.error);
