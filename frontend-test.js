// Frontend API integration test for HybridCrypt

async function testFrontendIntegration() {
  console.log('Starting HybridCrypt frontend API integration test...');
  
  const message = "SECRETMESSAGE"; // No spaces, uppercase only
  const hillKey = "2 3\n1 4";
  const rsaPublicKey = "3,33"; // Using simple RSA key for testing
  const rsaPrivateKey = "7,33"; // Corresponding private key
  
  console.log(`Original message: "${message}"`);
  console.log(`Hill Cipher key:\n${hillKey}`);

  try {
    // Step 1: Encrypt using frontend API
    console.log('\n1. Calling frontend encryption API...');
    
    const encryptResponse = await fetch('http://localhost:3005/api/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        hillKey,
        rsaPublicKey,
      }),
    });
    
    if (!encryptResponse.ok) {
      throw new Error(`Frontend encryption API failed with status ${encryptResponse.status}`);
    }
    
    const encryptResult = await encryptResponse.json();
    console.log('Frontend encryption successful!');
    console.log('Encrypted message:', encryptResult.encryptedMessage);
    console.log('Encrypted key:', encryptResult.encryptedKey);
    
    // Step 2: Decrypt using frontend API with Hill key
    console.log('\n2. Calling frontend decryption API with Hill key...');
    
    const decryptWithKeyResponse = await fetch('http://localhost:3005/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryptedMessage: encryptResult.encryptedMessage,
        hillKey,
      }),
    });
    
    if (!decryptWithKeyResponse.ok) {
      throw new Error(`Frontend decryption API with key failed with status ${decryptWithKeyResponse.status}`);
    }
    
    const decryptWithKeyResult = await decryptWithKeyResponse.json();
    console.log('Frontend decryption with Hill key successful!');
    console.log(`Decrypted message: "${decryptWithKeyResult.decryptedMessage}"`);
    
    // Step 3: Decrypt using frontend API with RSA private key
    console.log('\n3. Calling frontend decryption API with RSA private key...');
    
    const decryptWithRSAResponse = await fetch('http://localhost:3005/api/decrypt', {
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
      throw new Error(`Frontend decryption API with RSA failed with status ${decryptWithRSAResponse.status}`);
    }
    
    const decryptWithRSAResult = await decryptWithRSAResponse.json();
    console.log('Frontend decryption with RSA private key successful!');
    console.log(`Decrypted message: "${decryptWithRSAResult.decryptedMessage}"`);
    
    // Verify results
    console.log('\nVerification:');
    console.log(`Original: "${message}"`);
    console.log(`Decrypted (Hill key): "${decryptWithKeyResult.decryptedMessage.replace(/X+$/, '')}"`);
    console.log(`Decrypted (RSA): "${decryptWithRSAResult.decryptedMessage.replace(/X+$/, '')}"`);
    
    const cleanedHillDecrypted = decryptWithKeyResult.decryptedMessage.replace(/X+$/, '');
    const cleanedRSADecrypted = decryptWithRSAResult.decryptedMessage.replace(/X+$/, '');
    
    if (cleanedHillDecrypted === message && cleanedRSADecrypted === message) {
      console.log('\n✅ TEST PASSED: Full frontend integration works correctly!');
    } else {
      console.log('\n❌ TEST FAILED: Decrypted message doesn\'t match original');
    }
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
  }
}

// Run the test
testFrontendIntegration();
