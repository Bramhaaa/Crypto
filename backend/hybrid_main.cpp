#include <iostream>
#include "utils.h"

extern std::vector<int> encryptHill(const std::string&, const std::vector<int>&);
extern std::pair<int, int> generateRSAKey(int p, int q, int e);
extern std::vector<int> encryptRSA(const std::vector<int>&, int e, int n);

int main() {
    std::string message = "HELLO";
    std::vector<int> key = {3, 3, 2, 5}; // 2x2 key matrix

    auto hillEncrypted = encryptHill(message, key);
    std::cout << "Hill Encrypted: ";
    for (int c : hillEncrypted) std::cout << c << " ";
    std::cout << std::endl;

    int p = 3, q = 11, e = 3;
    auto [n, d] = generateRSAKey(p, q, e);
    auto rsaEncryptedKey = encryptRSA(key, e, n);

    std::cout << "RSA Encrypted Key: ";
    for (int val : rsaEncryptedKey) std::cout << val << " ";
    std::cout << std::endl;

    return 0;
}
