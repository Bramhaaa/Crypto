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
git clone <repository-url>
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

1. Open your browser and navigate to http://localhost:3000
2. Click on "Encrypt" in the navigation menu
3. Enter the message you want to encrypt
4. Generate or input a Hill Cipher key matrix
5. Enter RSA public key parameters (or use the defaults)
6. Click "Encrypt Message"
7. View the encryption results and download or copy as needed

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

## Project Structure

```
.
├── backend/
│   ├── hill_cipher.cpp  # Hill Cipher implementation
│   ├── http_server.cpp  # HTTP server and API endpoints
│   ├── hybrid_main.cpp  # CLI demo of the hybrid encryption
│   ├── Makefile
│   ├── rsa.cpp          # RSA implementation
│   ├── utils.cpp
│   ├── utils.h
│   └── include/
│       ├── httplib.h    # HTTP library
│       └── json.hpp     # JSON library
│
└── frontend/
    ├── app/
    │   ├── encrypt/
    │   │   └── page.tsx  # Encryption page
    │   ├── results/
    │   │   └── page.tsx  # Results display page
    │   └── page.tsx      # Home page
    ├── components/       # UI components
    ├── lib/
    │   └── encryption.ts # Frontend encryption implementation
    └── package.json
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

## License

[MIT License](LICENSE)

## Contributors

- Bramha Bajannavar
