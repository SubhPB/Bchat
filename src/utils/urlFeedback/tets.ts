
const bcrypt = require("bcryptjs");

// Function to generate a random secret key
function generateSecretKey(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Function to hash the secret key using bcrypt
async function hashSecretKey(secretKey: string): Promise<string> {
    const saltRounds = 10;
    const hashedKey = await bcrypt.hash(secretKey, saltRounds);
    return hashedKey;
}

// Usage example
(async () => {
    const secretKey = generateSecretKey(16); // Generate a 16-character secret key
    console.log('Generated Secret Key:', secretKey);
    
    const hashedKey = await hashSecretKey(secretKey);
    console.log('Hashed Secret Key:', hashedKey);
})();
