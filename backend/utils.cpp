#include "utils.h"
#include <vector>
#include <string>
#include <stdexcept>
#include <numeric>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <sstream>

// Converts a flat key vector into a 2x2 matrix
std::vector<std::vector<int>> getKeyMatrix(const std::vector<int>& flatKey) {
    if (flatKey.size() != 4) {
        throw std::invalid_argument("Key must have exactly 4 elements for a 2x2 matrix.");
    }
    return {{flatKey[0], flatKey[1]}, {flatKey[2], flatKey[3]}};
}

// Converts a string into a vector of integers (A=0, B=1, ..., Z=25)
std::vector<int> textToNumbers(const std::string& text) {
    std::vector<int> nums;
    for (char c : text) {
        if (std::isalpha(c)) {
            nums.push_back(std::toupper(c) - 'A');
        }
    }
    return nums;
}

// Computes the modular inverse of a under modulo m using the Extended Euclidean Algorithm
int modInverse(int a, int m) {
    int m0 = m, t, q;
    int x0 = 0, x1 = 1;

    if (m == 1) return 0;

    while (a > 1) {
        q = a / m;
        t = m;
        m = a % m, a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) x1 += m0;

    return x1;
}

// Computes modular exponentiation (base^exp % mod)
int modPow(int base, int exp, int mod) {
    int result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        exp = exp >> 1;
        base = (base * base) % mod;
    }
    return result;
}

// Converts a vector of integers back to a string (0=A, 1=B, ..., 25=Z)
std::string numbersToText(const std::vector<int>& nums) {
    std::string text;
    for (int num : nums) {
        // Ensure the number is within the range 0-25
        num = ((num % 26) + 26) % 26;
        text += static_cast<char>(num + 'A');
    }
    return text;
}

// Returns the current timestamp as a string
std::string getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    
    std::stringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}
