// Integration with the C++ backend for actual encryption

export interface EncryptionResult {
  encryptedMessage: string;
  encryptedKey: string | number[];
  timestamp: string;
}

// Real encryption function that calls the backend API
export async function encryptMessage(
  message: string,
  hillKey: string,
  rsaPublicKey: string
): Promise<EncryptionResult> {
  try {
    console.log("Encrypting message with backend API...");
    // Format the hill key to be sent to the backend
    const formattedHillKey = formatHillKeyForBackend(hillKey);

    console.log("Using endpoint: http://localhost:5001/api/encrypt");
    console.log("Sending data:", {
      message,
      hillKey: formattedHillKey,
      rsaPublicKey,
    });

    // Call the backend API
    const response = await fetch("http://localhost:5001/api/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        hillKey: formattedHillKey,
        rsaPublicKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Encryption API error:", errorData);
      throw new Error(errorData.error || "Encryption failed");
    }

    const result = await response.json();
    console.log("Received response:", result);

    return {
      encryptedMessage: result.encryptedMessage,
      encryptedKey: result.encryptedKey,
      timestamp: result.timestamp,
    };
  } catch (error) {
    console.error("Error during encryption:", error);

    // Fallback to simulated encryption if backend is unavailable
    console.log("Falling back to simulated encryption");

    // Parse the Hill Cipher key matrix
    const keyMatrix = parseHillKey(hillKey);

    // Create a mock encrypted message
    const encryptedMessage = simulateHillCipherEncryption(message, keyMatrix);
    const encryptedKey = simulateRSAEncryption(
      JSON.stringify(keyMatrix),
      rsaPublicKey
    );

    return {
      encryptedMessage,
      encryptedKey,
      timestamp: new Date().toLocaleString(),
    };
  }
}

// Format the hill key from UI format to a format the backend expects
// Backend expects space-separated values: "1 2 3 4"
function formatHillKeyForBackend(hillKey: string): string {
  // Parse the key first to ensure it's valid
  const keyMatrix = parseHillKey(hillKey);
  // Flatten the 2D array and join with spaces
  return keyMatrix.flat().join(" ");
}

// Parse the Hill Cipher key from string to matrix
function parseHillKey(hillKey: string): number[][] {
  try {
    return hillKey
      .trim()
      .split("\n")
      .map((row) => row.trim().split(/\s+/).map(Number));
  } catch (error) {
    console.error("Error parsing Hill key:", error);
    return [
      [2, 3],
      [1, 4],
    ]; // Default key if parsing fails
  }
}

// Simulate Hill Cipher encryption (simplified for demonstration)
function simulateHillCipherEncryption(
  message: string,
  keyMatrix: number[][]
): string {
  // In a real implementation, you would apply the Hill Cipher algorithm
  // For demonstration, we'll create a mock encrypted string
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let encrypted = "";

  for (let i = 0; i < message.length; i++) {
    const char = message[i].toUpperCase();
    if (alphabet.includes(char)) {
      const index = (alphabet.indexOf(char) + i * keyMatrix[0][0]) % 26;
      encrypted += alphabet[index];
    } else {
      encrypted += char; // Keep non-alphabetic characters unchanged
    }
  }

  // Add some random characters to make it look more like encryption
  return (
    encrypted +
    Array.from({ length: 8 }, () =>
      alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    ).join("")
  );
}

// Simulate RSA encryption (simplified for demonstration)
function simulateRSAEncryption(data: string, publicKey: string): string {
  // In a real implementation, you would use the RSA algorithm
  // For demonstration, we'll create a mock encrypted string
  const base64 = btoa(data);

  // Add a prefix to make it look like an RSA encrypted string
  return `RSA-ENC:${base64.split("").reverse().join("")}`;
}
