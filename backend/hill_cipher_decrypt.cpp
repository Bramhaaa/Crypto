#include <iostream>
#include <vector>
#include "utils.h"

const int MOD = 26;

// Function to find the determinant of a 2x2 matrix
int determinant(const std::vector<std::vector<int>>& matrix) {
    return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]);
}

// Function to find the inverse of a 2x2 matrix in mod 26
std::vector<std::vector<int>> inverseMatrix(const std::vector<std::vector<int>>& matrix) {
    int det = determinant(matrix) % MOD;
    if (det < 0) det += MOD;
    
    // Calculate the modular multiplicative inverse of the determinant
    int detInv = modInverse(det, MOD);
    
    // Create the adjugate matrix and multiply by the inverse of the determinant
    std::vector<std::vector<int>> inverse = {
        {(matrix[1][1] * detInv) % MOD, (-matrix[0][1] * detInv + MOD) % MOD},
        {(-matrix[1][0] * detInv + MOD) % MOD, (matrix[0][0] * detInv) % MOD}
    };
    
    return inverse;
}

// Decrypt a message encrypted with Hill Cipher
std::vector<int> decryptHill(const std::string& encryptedMessage, const std::vector<int>& flatKey) {
    // Convert the encrypted message to numbers
    auto encryptedNums = textToNumbers(encryptedMessage);
    
    // Get the key matrix
    auto keyMatrix = getKeyMatrix(flatKey);
    
    // Find the inverse of the key matrix
    auto invKeyMatrix = inverseMatrix(keyMatrix);
    
    std::vector<int> result;
    
    // Apply the inverse key matrix to decrypt the message
    for (size_t i = 0; i < encryptedNums.size(); i += 2) {
        if (i + 1 >= encryptedNums.size()) break; // Skip incomplete pair at the end
        
        int x = encryptedNums[i];
        int y = encryptedNums[i + 1];
        
        result.push_back((invKeyMatrix[0][0] * x + invKeyMatrix[0][1] * y) % MOD);
        result.push_back((invKeyMatrix[1][0] * x + invKeyMatrix[1][1] * y) % MOD);
    }
    
    return result;
}
