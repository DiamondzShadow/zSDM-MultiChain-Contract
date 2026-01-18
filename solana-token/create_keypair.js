const { Keypair } = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const fs = require('fs');

const mnemonic = process.env.SOLANA_MNEMONIC;

if (!mnemonic) {
  console.error("❌ Error: SOLANA_MNEMONIC environment variable is required");
  console.error("   Set it with: export SOLANA_MNEMONIC='your twelve word mnemonic phrase here'");
  process.exit(1);
}

const seed = bip39.mnemonicToSeedSync(mnemonic);
const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
const keypair = Keypair.fromSeed(derivedSeed);

console.log('Public Key:', keypair.publicKey.toString());

// Save keypair to file
const keypairArray = Array.from(keypair.secretKey);
fs.writeFileSync('deploy_keypair.json', JSON.stringify(keypairArray));
fs.writeFileSync('/home/ubuntu/.config/solana/id.json', JSON.stringify(keypairArray));

console.log('Keypair saved to deploy_keypair.json and ~/.config/solana/id.json');
