#include "httplib.h"
#include "utils.h"
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <json.hpp> // nlohmann json for parsing

// Include the encryption function declarations
extern std::vector<int> encryptHill(const std::string&, const std::vector<int>&);
extern std::pair<int, int> generateRSAKey(int p, int q, int e);
extern std::vector<int> encryptRSA(const std::vector<int>&, int e, int n);

// Use the json library
using json = nlohmann::json;

int main() {
    httplib::Server svr;

    // Add CORS headers for all responses
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type, Authorization"}
    });

    // Handle OPTIONS requests (CORS preflight)
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("", "text/plain");
    });

    // Example endpoint to test the server
    svr.Get("/api/test", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("Backend is working!", "text/plain");
    });

    // Real encryption endpoint
    svr.Post("/api/encrypt", [](const httplib::Request& req, httplib::Response& res) {
        try {
            std::cout << "Received encrypt request: " << req.body << std::endl;
            
            // Parse request body as JSON
            json requestData = json::parse(req.body);
            
            // Extract data from the request
            std::string message = requestData["message"];
            std::string hillKeyStr = requestData["hillKey"];
            std::string rsaPublicKey = requestData["rsaPublicKey"];
            
            std::cout << "Message: " << message << std::endl;
            std::cout << "HillKey: " << hillKeyStr << std::endl;
            
            // Parse the hill key matrix from string
            std::vector<int> hillKeyFlat;
            std::istringstream keyStream(hillKeyStr);
            int val;
            while (keyStream >> val) {
                hillKeyFlat.push_back(val);
                std::cout << "Parsed key value: " << val << std::endl;
            }
            
            // Ensure we have 4 values for a 2x2 matrix
            if (hillKeyFlat.size() != 4) {
                std::cout << "Invalid key size: " << hillKeyFlat.size() << std::endl;
                throw std::runtime_error("Hill key must be a 2x2 matrix (4 values)");
            }
            
            // Encrypt the message using Hill cipher
            std::cout << "Encrypting with Hill cipher..." << std::endl;
            auto hillEncrypted = encryptHill(message, hillKeyFlat);
            
            // For demonstration, use simple RSA parameters
            int p = 3, q = 11, e = 3;
            auto [n, d] = generateRSAKey(p, q, e);
            
            // Encrypt the Hill key using RSA
            std::cout << "Encrypting key with RSA..." << std::endl;
            auto rsaEncryptedKey = encryptRSA(hillKeyFlat, e, n);
            
            // Convert results to a format suitable for response
            std::string encryptedMessage = numbersToText(hillEncrypted);
            
            std::cout << "Encrypted message: " << encryptedMessage << std::endl;
            
            // Prepare a JSON response
            json response = {
                {"encryptedMessage", encryptedMessage},
                {"encryptedKey", rsaEncryptedKey},
                {"timestamp", getCurrentTimestamp()}
            };
            
            std::cout << "Sending response: " << response.dump() << std::endl;
            res.set_content(response.dump(), "application/json");
        }
        catch (const std::exception& e) {
            std::cout << "Error occurred: " << e.what() << std::endl;
            json errorResponse = {
                {"error", e.what()}
            };
            res.status = 400; // Bad Request
            res.set_content(errorResponse.dump(), "application/json");
        }
    });

    // Start the server on port 5001 (since 5000 is already in use)
    std::cout << "Server is running on http://localhost:5001" << std::endl;
    svr.listen("0.0.0.0", 5001);

    return 0;
}
