#include <iostream>
#include <vector>
#include "utils.h"

const int MOD = 26;

std::vector<int> encryptHill(const std::string& message, const std::vector<int>& flatKey) {
    auto keyMatrix = getKeyMatrix(flatKey);
    auto msgNums = textToNumbers(message);
    std::vector<int> result;

    for (size_t i = 0; i < msgNums.size(); i += 2) {
        int x = msgNums[i];
        int y = (i + 1 < msgNums.size()) ? msgNums[i + 1] : 'X' - 'A';
        result.push_back((keyMatrix[0][0]*x + keyMatrix[0][1]*y) % MOD);
        result.push_back((keyMatrix[1][0]*x + keyMatrix[1][1]*y) % MOD);
    }

    return result;
}
