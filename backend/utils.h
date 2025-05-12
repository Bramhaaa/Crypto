#ifndef UTILS_H
#define UTILS_H

#include <vector>
#include <string>
#include <tuple>

std::vector<std::vector<int>> getKeyMatrix(const std::vector<int>& flatKey);
std::vector<int> textToNumbers(const std::string& text);
std::string numbersToText(const std::vector<int>& nums);
int modInverse(int a, int m);
int gcd(int a, int b);
int modPow(int base, int exp, int mod);
std::string getCurrentTimestamp();

#endif
