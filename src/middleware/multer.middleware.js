const { status } = require('../util/status.util')
const { responseHelper } = require('../helper/response.helper');
const { cryptFile } = require('../util/cryptFile.util');
// storeFile function to encrypt and store file locally
const storeFile = (req, res, next) => {
    try {
        console.log(req.body.userId)
        cryptFile(req.file)
        req.body.filename = req.file.originalname
        return next()
    } catch (e) {
        return res.status(status.storageError.code).json(responseHelper(status.storageError, e));
    }
};

module.exports = {
    storeFile,
};