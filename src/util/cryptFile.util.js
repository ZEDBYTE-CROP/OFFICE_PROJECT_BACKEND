require('dotenv').config();
const crypto = require('crypto');
const path = require('path');
const { status } = require('../util/status.util')
const fs = require('fs');

const encrypt = (buffer, key, algorithm) => {
    // Create an initialization vector
    const iv = crypto.randomBytes(16);    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, key, iv);    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
};

// const decrypt = (encrypted, key, algorithm) => {
//     // Get the iv: the first 16 bytes
//     const iv = encrypted.slice(0, 16);   // Get the rest
//     encrypted = encrypted.slice(16);   // Create a decipher
//     const decipher = crypto.createDecipheriv(algorithm, key, iv);   // Actually decrypt it
//     const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
//     return result;
// };

function cryptFile(file) {
    const algorithm = process.env.CRYPT_ALGO;
    const key = crypto.createHash('sha256').update(process.env.CRYPT_KEY).digest('base64').substr(0, 32);;
    

    // Read the uploaded file into a buffer
    fs.readFile(file.path, (err, data) => {
        if (err) {
            return res.status(status.storageError.code).json(responseHelper(status.storageError, err));
        }

        // Encrypt the buffer
        const encryptedData = encrypt(data, key, algorithm);

        // Write the encrypted data to a new file
        const encryptedFileName = file.filename + '.enc';
        fs.writeFile(path.join(__dirname, process.env.FILES_PATH, encryptedFileName), encryptedData, (err) => {
            if (err) {
                return res.status(status.storageError.code).json(responseHelper(status.storageError, err));
            }

            // Remove the original unencrypted file
            fs.unlinkSync(file.path);

        });
    });
}

module.exports = { cryptFile }