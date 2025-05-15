# HybridCrypt - Hybrid Encryption System

HybridCrypt is a demonstration application that implements a hybrid encryption technique using the Hill Cipher for symmetric encryption and RSA for asymmetric encryption. This project consists of a C++ backend that handles the actual cryptographic operations and a Next.js frontend that provides a user-friendly interface.

## Project Overview

In this hybrid cryptosystem:

1. **Hill Cipher** is used as the symmetric encryption algorithm to encrypt the user's message
2. **RSA** is used as the asymmetric encryption algorithm to encrypt the Hill Cipher key
3. The encrypted message and encrypted key are then stored/transmitted together

This approach combines the efficiency of symmetric encryption for message content with the security of asymmetric encryption for key exchange.

## System Architecture

The project is divided into two main components:

### Backend (C++)

- Implements the actual encryption algorithms (Hill Cipher and RSA)
- Provides a REST API using the cpp-httplib library
- Handles JSON requests and responses using the nlohmann/json library

### Frontend (Next.js/React)

- User interface for entering messages and encryption parameters
- Communicates with the backend via fetch API calls
- Provides fallback client-side encryption if the backend is unavailable
- Displays encryption results and allows downloading/sharing

## Prerequisites

- C++ compiler with C++17 support (g++ recommended)
- Node.js (v18 or later)
- npm or pnpm package manager

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/Bramhaaa/Crypto
cd crypto
```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create the include directory and download required libraries (if not already present):

   ```bash
   mkdir -p include
   cd include
   curl -O https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
   curl -O https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp
   cd ..
   ```

3. Compile the backend:
   ```bash
   make
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install  # or npm install
   ```

## Running the Application

### Start the Backend Server

```bash
cd backend
./http_server
```

By default, the server listens on port 5001. You should see:

```
Server is running on http://localhost:5001
```

### Start the Frontend Development Server

```bash
cd frontend
pnpm dev  # or npm run dev
```

The frontend will be accessible at http://localhost:3000

## Usage

### Encryption

1. Open your browser and navigate to http://localhost:3000
2. Click on "Encrypt" in the navigation menu
3. Enter the message you want to encrypt
4. Generate or input a Hill Cipher key matrix
5. Enter RSA public key parameters (or use the defaults)
6. Click "Encrypt Message"
7. View the encryption results and download or copy as needed

### Decryption

1. Navigate to http://localhost:3000/decrypt
2. Enter the encrypted message
3. Choose one of these options:
   - Upload a JSON file containing encrypted data from a previous encryption
   - Enter the RSA private key and encrypted Hill Cipher key
   - Enter the original Hill Cipher key directly if you have it
4. Click "Decrypt Message" to recover the original message

## API Endpoints

### GET /api/test

- Tests if the backend server is running
- Returns: "Backend is working!"

### POST /api/encrypt

- Encrypts a message using the hybrid encryption system
- Request body:
  ```json
  {
    "message": "YOUR_MESSAGE",
    "hillKey": "2 3 1 4",
    "rsaPublicKey": "..."
  }
  ```
- Response:
  ```json
  {
    "encryptedMessage": "ENCRYPTED_TEXT",
    "encryptedKey": [1, 2, 3, 4],
    "timestamp": "2025-05-12 12:34:56"
  }
  ```

### POST /api/decrypt

- Decrypts a message using either the original Hill Cipher key or the encrypted key with RSA private key
- Request body (with Hill key):
  ```json
  {
    "encryptedMessage": "ENCRYPTED_TEXT",
    "hillKey": "2 3 1 4"
  }
  ```
- Request body (with RSA):
  ```json
  {
    "encryptedMessage": "ENCRYPTED_TEXT",
    "encryptedKey": [1, 2, 3, 4],
    "rsaPrivateKey": "..."
  }
  ```
- Response:
  ```json
  {
    "decryptedMessage": "DECRYPTED_TEXT",
    "timestamp": "2025-05-12 12:34:56"
  }
  ```

## Project Structure

```
.
├── backend/
│   ├── hill_cipher.cpp          # Hill Cipher encryption implementation
│   ├── hill_cipher_decrypt.cpp  # Hill Cipher decryption implementation
│   ├── http_server.cpp          # HTTP server and API endpoints
│   ├── hybrid_main.cpp          # CLI demo of the hybrid encryption
│   ├── Makefile
│   ├── rsa.cpp                  # RSA implementation
│   ├── utils.cpp
│   ├── utils.h
│   └── include/
│       ├── httplib.h            # HTTP library
│       └── json.hpp             # JSON library
│
├── frontend/                    # Original frontend (deprecated)
│   ├── app/
│   │   ├── encrypt/
│   │   │   └── page.tsx         # Encryption page
│   │   ├── results/
│   │   │   └── page.tsx         # Results display page
│   │   └── page.tsx             # Home page
│   ├── components/              # UI components
│   ├── lib/
│   │   └── encryption.ts        # Frontend encryption implementation
│   └── package.json
│
├── NewFrontend/                 # New frontend with encryption and decryption
│   ├── app/
│   │   ├── encrypt/
│   │   │   └── page.tsx         # Encryption page
│   │   ├── decrypt/
│   │   │   └── page.tsx         # Decryption page
│   │   ├── results/
│   │   │   └── page.tsx         # Results display page
│   │   └── page.tsx             # Home page
│   ├── components/              # UI components
│   ├── lib/
│   │   └── encryption.ts        # Frontend encryption/decryption implementation
│   └── package.json
│
└── test-integration.js          # Integration test script
```

## Cryptographic Details

### Hill Cipher

- Uses a 2x2 matrix as the key
- Encrypts pairs of letters at a time
- Operates in the mod 26 space (A-Z alphabet)

### RSA

- Uses standard RSA algorithm for key encryption
- Parameters p, q, e, and n determine the security level
- Currently using simplified parameters for demonstration

## Fallback Mechanism

If the backend server is unreachable, the frontend will automatically use a JavaScript-based simulation of the encryption algorithms. This ensures users can still use the application, albeit with a warning that they're using the fallback mechanism.

## Security Considerations

This project is designed as an educational demonstration and should not be used for securing sensitive data in production. The implementation:

- Uses simplified parameters for demonstration
- Does not implement full security measures needed for a production system
- Focuses on demonstrating the algorithms rather than ensuring maximal security
