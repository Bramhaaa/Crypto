// Integration test for HybridCrypt

async function testEncryptDecryptIntegration() {
  console.log('Starting HybridCrypt encryption/decryption test...');
  
  const message = "HELLOTHISISATESTMESSAGE"; // No spaces, uppercase only
  const hillKey = "2 3\n1 4";
  const rsaPublicKey = "3,33"; // Using simple RSA key for testing
  
  console.log(`Original message: "${message}"`);
  console.log(`Hill Cipher key:\n${hillKey}`);
  
  try {
    // Encrypt message
    console.log('\nAttempting to encrypt...');
    const encryptResponse = await fetch('http://localhost:5001/api/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        hillKey: hillKey.split('\n').join(' ').replace(/\s+/g, ' ').trim(),
        rsaPublicKey,
      }),
    });
    
    if (!encryptResponse.ok) {
      throw new Error(`Encryption failed with status ${encryptResponse.status}`);
    }
    
    const encryptResult = await encryptResponse.json();
    console.log('Encryption successful!');
    console.log('Encrypted message:', encryptResult.encryptedMessage);
    console.log('Encrypted key:', encryptResult.encryptedKey);
    
    // Decrypt message using the direct Hill key
    console.log('\nAttempting to decrypt with direct Hill key...');
    const decryptWithKeyResponse = await fetch('http://localhost:5001/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryptedMessage: encryptResult.encryptedMessage,
        hillKey: hillKey.split('\n').join(' ').replace(/\s+/g, ' ').trim(),
      }),
    });
    
    if (!decryptWithKeyResponse.ok) {
      throw new Error(`Decryption with key failed with status ${decryptWithKeyResponse.status}`);
    }
    
    const decryptWithKeyResult = await decryptWithKeyResponse.json();
    console.log('Decryption with Hill key successful!');
    console.log(`Decrypted message: "${decryptWithKeyResult.decryptedMessage}"`);
    
    // Decrypt message using the encrypted key and RSA private key
    console.log('\nAttempting to decrypt with encrypted key and RSA private key...');
    const rsaPrivateKey = "7,33"; // Using simple RSA private key for testing
    const decryptWithRSAResponse = await fetch('http://localhost:5001/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryptedMessage: encryptResult.encryptedMessage,
        encryptedKey: encryptResult.encryptedKey,
        rsaPrivateKey,
      }),
    });
    
    if (!decryptWithRSAResponse.ok) {
      throw new Error(`Decryption with RSA failed with status ${decryptWithRSAResponse.status}`);
    }
    
    const decryptWithRSAResult = await decryptWithRSAResponse.json();
    console.log('Decryption with RSA private key successful!');
    console.log(`Decrypted message: "${decryptWithRSAResult.decryptedMessage}"`);
    
    // Verify results
    console.log('\nVerification:');
    console.log(`Original: "${message}"`);
    console.log(`Decrypted (Hill key): "${decryptWithKeyResult.decryptedMessage}"`);
    console.log(`Decrypted (RSA): "${decryptWithRSAResult.decryptedMessage}"`);
    
    // Remove any trailing 'X' characters (used for padding)
    const cleanedHillDecrypted = decryptWithKeyResult.decryptedMessage.replace(/X+$/, '');
    const cleanedRSADecrypted = decryptWithRSAResult.decryptedMessage.replace(/X+$/, '');
    
    if (cleanedHillDecrypted === message && 
        cleanedRSADecrypted === message) {
      console.log('\n✅ TEST PASSED: Full encryption/decryption cycle works correctly!');
    } else {
      console.log('\n❌ TEST FAILED: Decrypted message doesn\'t match original');
      console.log(`Clean Hill decrypted: "${cleanedHillDecrypted}"`);
      console.log(`Clean RSA decrypted: "${cleanedRSADecrypted}"`);
    }
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
  }
}

// Run the test
testEncryptDecryptIntegration();