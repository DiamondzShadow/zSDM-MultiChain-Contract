const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');

// Private key from environment variable (never hardcode!)
const privateKeyBase58 = process.env.SOLANA_PRIVATE_KEY;

if (!privateKeyBase58) {
  console.error("❌ Error: SOLANA_PRIVATE_KEY environment variable is required");
  console.error("   Set it with: export SOLANA_PRIVATE_KEY='your-base58-private-key'");
  process.exit(1);
}

try {
  // Decode the base58 private key
  const privateKeyBytes = bs58.default ? bs58.default.decode(privateKeyBase58) : bs58.decode(privateKeyBase58);
  
  // Create keypair from private key
  const keypair = Keypair.fromSecretKey(privateKeyBytes);
  
  console.log('Public Key:', keypair.publicKey.toString());
  
  // Verify this matches your expected public key
  const expectedPublicKey = process.env.SOLANA_PUBLIC_KEY;
  if (keypair.publicKey.toString() === expectedPublicKey) {
    console.log('✅ Public key matches expected address!');
  } else {
    console.log('❌ Public key mismatch');
    console.log('Expected:', expectedPublicKey);
    console.log('Got:', keypair.publicKey.toString());
  }
  
  // Save keypair to file
  const keypairArray = Array.from(keypair.secretKey);
  fs.writeFileSync('deploy_keypair.json', JSON.stringify(keypairArray));
  fs.writeFileSync('/home/ubuntu/.config/solana/id.json', JSON.stringify(keypairArray));
  
  console.log('✅ Keypair created and saved successfully!');
  
} catch (error) {
  console.error('Error creating keypair:', error.message);
  console.log('Trying alternative approach...');
  
  // Alternative: treat as hex if base58 fails
  try {
    const privateKeyHex = privateKeyBase58;
    const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
    const keypair = Keypair.fromSecretKey(privateKeyBytes);
    console.log('Alternative - Public Key:', keypair.publicKey.toString());
  } catch (e) {
    console.log('Alternative approach also failed:', e.message);
  }
}
