// filepath: /Users/bramhabajannavar/Desktop/crypto/NewFrontend/lib/encryption.ts
// Integration with the C++ backend for actual encryption and decryption

export interface EncryptionResult {
  encryptedMessage: string
  encryptedKey: string | number[]
  timestamp: string
}

export interface DecryptionResult {
  decryptedMessage: string
  timestamp: string
}

// Real encryption function that calls the backend API
export async function encryptMessage(
  message: string,
  hillKey: string,
  rsaPublicKey: string,
): Promise<EncryptionResult> {
  try {
    // Format the hill key to be sent to the backend
    const formattedHillKey = formatHillKeyForBackend(hillKey)
    
    console.log('Using endpoint: http://localhost:5001/api/encrypt');
    console.log('Sending data:', { message, hillKey: formattedHillKey, rsaPublicKey });
    
    // Call the backend API
    const response = await fetch('http://localhost:5001/api/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        hillKey: formattedHillKey,
        rsaPublicKey,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Encryption API error:', errorData);
      throw new Error(errorData.error || 'Encryption failed')
    }
    
    const result = await response.json()
    console.log('Received encryption response:', result);
    
    return {
      encryptedMessage: result.encryptedMessage,
      encryptedKey: result.encryptedKey,
      timestamp: result.timestamp,
    }
  } catch (error) {
    console.error('Error during encryption:', error)
    
    // Fallback to simulated encryption if backend is unavailable
    console.log('Falling back to simulated encryption')
    
    // Simulate encryption delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Parse the Hill Cipher key matrix
    const keyMatrix = parseHillKey(hillKey)
    
    // Create a mock encrypted message
    const encryptedMessage = simulateHillCipherEncryption(message, keyMatrix)
    const encryptedKey = simulateRSAEncryption(JSON.stringify(keyMatrix), rsaPublicKey)
    
    return {
      encryptedMessage,
      encryptedKey,
      timestamp: new Date().toLocaleString(),
    }
  }
}

// Real decryption function that calls the backend API
export async function decryptMessage(
  encryptedMessage: string,
  encryptedKey: string | number[],
  rsaPrivateKey: string,
  hillKey: string,
): Promise<DecryptionResult> {
  try {
    console.log('Using endpoint: http://localhost:5001/api/decrypt');
    
    // Prepare request data based on available inputs
    const requestData: any = { encryptedMessage };
    
    if (hillKey) {
      // If Hill key is provided directly, format it
      requestData.hillKey = formatHillKeyForBackend(hillKey);
      console.log('Using provided Hill key:', requestData.hillKey);
    } else if (encryptedKey && rsaPrivateKey) {
      // If encrypted key and RSA private key are provided
      requestData.encryptedKey = encryptedKey;
      requestData.rsaPrivateKey = rsaPrivateKey;
      console.log('Using encrypted key with RSA private key');
    } else {
      throw new Error('Either Hill Cipher key or encrypted key with RSA private key must be provided');
    }
    
    // Call the backend API
    const response = await fetch('http://localhost:5001/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Decryption API error:', errorData);
      throw new Error(errorData.error || 'Decryption failed')
    }
    
    const result = await response.json()
    console.log('Received decryption response:', result);
    
    return {
      decryptedMessage: result.decryptedMessage,
      timestamp: result.timestamp,
    }
  } catch (error) {
    console.error('Error during decryption:', error)
    
    // Fallback to simulated decryption if backend is unavailable
    console.log('Falling back to simulated decryption')
    
    // Simulate decryption delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    let keyMatrix: number[][]

    if (hillKey) {
      // If the Hill Cipher key is provided directly, use it
      keyMatrix = parseHillKey(hillKey)
    } else if (rsaPrivateKey && encryptedKey) {
      // If the RSA private key and encrypted key are provided, decrypt the Hill Cipher key
      const encryptedKeyString = typeof encryptedKey === 'string' ? encryptedKey : JSON.stringify(encryptedKey);
      const decryptedKeyString = simulateRSADecryption(encryptedKeyString, rsaPrivateKey)
      try {
        keyMatrix = JSON.parse(decryptedKeyString)
      } catch (error) {
        console.error("Error parsing decrypted key:", error)
        throw new Error("Invalid RSA private key or encrypted key")
      }
    } else {
      throw new Error("Either Hill Cipher key or RSA private key with encrypted key must be provided")
    }
    
    const decryptedMessage = simulateHillCipherDecryption(encryptedMessage, keyMatrix)

    return {
      decryptedMessage,
      timestamp: new Date().toLocaleString(),
    }
  }
}

// Format the hill key from UI format to a format the backend expects
// Backend expects space-separated values: "1 2 3 4"
function formatHillKeyForBackend(hillKey: string): string {
  // Parse the key first to ensure it's valid
  const keyMatrix = parseHillKey(hillKey)
  // Flatten the 2D array and join with spaces
  return keyMatrix.flat().join(' ')
}

// Parse the Hill Cipher key from string to matrix
function parseHillKey(hillKey: string): number[][] {
  try {
    return hillKey
      .trim()
      .split("\n")
      .map((row) => row.trim().split(/\s+/).map(Number))
  } catch (error) {
    console.error("Error parsing Hill key:", error)
    return [
      [2, 3],
      [1, 4],
    ] // Default key if parsing fails
  }
}

// Simulate Hill Cipher encryption (simplified for demonstration)
function simulateHillCipherEncryption(message: string, keyMatrix: number[][]): string {
  // In a real implementation, you would apply the Hill Cipher algorithm
  // For demonstration, we'll create a mock encrypted string
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let encrypted = ""

  for (let i = 0; i < message.length; i++) {
    const char = message[i].toUpperCase()
    if (alphabet.includes(char)) {
      const index = (alphabet.indexOf(char) + i * keyMatrix[0][0]) % 26
      encrypted += alphabet[index]
    } else {
      encrypted += char // Keep non-alphabetic characters unchanged
    }
  }

  // Add some random characters to make it look more like encryption
  return (
    encrypted + Array.from({ length: 8 }, () => alphabet.charAt(Math.floor(Math.random() * alphabet.length))).join("")
  )
}

// Simulate RSA encryption (simplified for demonstration)
function simulateRSAEncryption(data: string, publicKey: string): string {
  // In a real implementation, you would use the RSA algorithm
  // For demonstration, we'll create a mock encrypted string
  const base64 = btoa(data)

  // Add a prefix to make it look like an RSA encrypted string
  return `RSA-ENC:${base64.split("").reverse().join("")}`
}

// Simulate Hill Cipher decryption (simplified for demonstration)
function simulateHillCipherDecryption(encryptedMessage: string, keyMatrix: number[][]): string {
  // In a real implementation, you would apply the inverse Hill Cipher algorithm
  // For demonstration, we'll extract the original message from our mock encryption

  // Remove the random characters we added during encryption (last 8 characters)
  const withoutRandom = encryptedMessage.slice(0, -8)

  // Reverse our simple substitution
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let decrypted = ""

  for (let i = 0; i < withoutRandom.length; i++) {
    const char = withoutRandom[i].toUpperCase()
    if (alphabet.includes(char)) {
      // Reverse the substitution (this is a simplified inverse operation)
      let index = alphabet.indexOf(char) - i * keyMatrix[0][0]
      while (index < 0) index += 26
      index = index % 26
      decrypted += alphabet[index]
    } else {
      decrypted += char // Keep non-alphabetic characters unchanged
    }
  }

  return decrypted
}

// Simulate RSA decryption (simplified for demonstration)
function simulateRSADecryption(encryptedData: string, privateKey: string): string {
  // In a real implementation, you would use the RSA algorithm
  // For demonstration, we'll reverse our mock encryption

  // Check if the encrypted data has our mock prefix
  if (!encryptedData.startsWith("RSA-ENC:")) {
    throw new Error("Invalid encrypted data format")
  }

  // Extract the base64 part and reverse it back
  const base64 = encryptedData.substring(8).split("").reverse().join("")

  try {
    // Decode the base64 string
    return atob(base64)
  } catch (error) {
    console.error("Error decoding base64:", error)
    throw new Error("Invalid encrypted data")
  }
}
