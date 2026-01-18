const { Keypair, PublicKey } = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const fs = require('fs');

const targetPublicKey = process.env.SOLANA_PUBLIC_KEY || "YOUR_PUBLIC_KEY_HERE";
const mnemonic = process.env.SOLANA_MNEMONIC;

if (!mnemonic) {
  console.error("❌ Error: SOLANA_MNEMONIC environment variable is required");
  console.error("   Set it with: export SOLANA_MNEMONIC='your twelve word mnemonic phrase here'");
  process.exit(1);
}

// Try different derivation paths to find the correct one
const paths = [
  "m/44'/501'/0'/0'",
  "m/44'/501'/0'",
  "m/44'/501'/0'/0'/0'",
  "m/44'/501'/1'/0'",
  "m/44'/501'/0'/1'"
];

const seed = bip39.mnemonicToSeedSync(mnemonic);

for (let i = 0; i < paths.length; i++) {
  try {
    const derivedSeed = derivePath(paths[i], seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    
    console.log(`Path ${paths[i]}: ${keypair.publicKey.toString()}`);
    
    if (keypair.publicKey.toString() === targetPublicKey) {
      console.log(`✅ Found correct derivation path: ${paths[i]}`);
      
      // Save the correct keypair
      const keypairArray = Array.from(keypair.secretKey);
      fs.writeFileSync('deploy_keypair.json', JSON.stringify(keypairArray));
      fs.writeFileSync('/home/ubuntu/.config/solana/id.json', JSON.stringify(keypairArray));
      
      console.log('✅ Correct keypair saved!');
      process.exit(0);
    }
  } catch (e) {
    console.log(`Path ${paths[i]}: Error -`, e.message);
  }
}

console.log('❌ Could not find matching derivation path');
