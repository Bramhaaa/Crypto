#include <iostream>
#include <vector>
#include "utils.h"

std::pair<int, int> generateRSAKey(int p, int q, int e) {
    int n = p * q;
    int phi = (p - 1) * (q - 1);
    int d = modInverse(e, phi);
    return {n, d};
}

std::vector<int> encryptRSA(const std::vector<int>& data, int e, int n) {
    std::vector<int> enc;
    for (int val : data)
        enc.push_back(modPow(val, e, n));
    return enc;
}

std::vector<int> decryptRSA(const std::vector<int>& data, int d, int n) {
    std::vector<int> dec;
    for (int val : data)
        dec.push_back(modPow(val, d, n));
    return dec;
}
