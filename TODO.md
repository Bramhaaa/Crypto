# TODO

## Next Steps

### High Priority

- [ ] Migrate from old frontend to NewFrontend completely
- [ ] Delete the old frontend code once migration is verified
- [ ] Add form validation for decryption inputs
- [ ] Improve error handling with more specific error messages

### Medium Priority

- [ ] Add unit tests for Hill cipher decryption
- [ ] Improve documentation with examples
- [ ] Enhance UI/UX with better loading states and feedback
- [ ] Add copy-to-clipboard functionality for decrypted messages

### Low Priority

- [ ] Implement additional encryption algorithms
- [ ] Add user authentication
- [ ] Create a CLI tool for encryption/decryption
- [ ] Support different key sizes for Hill Cipher

## Known Issues

- Encryption/decryption only works with uppercase letters (A-Z)
- Spaces and punctuation are stripped during encryption
- Hill Cipher implementation uses padding with 'X' characters
- Simple RSA parameters are used (not secure for production)
