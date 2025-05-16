// Skript pro generování náhodného NEXTAUTH_SECRET
// Spusťte pomocí: node generate-secret.js

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

const secret = generateRandomString(32);
console.log('Vygenerovaný NEXTAUTH_SECRET:');
console.log(secret);
console.log('\nTento řetězec použijte jako hodnotu proměnné NEXTAUTH_SECRET při nasazení na Vercel.');
