const express = require("express");
const { verifyTokens } = require("../middleware/jwt.middleware");
const { uploadFile, deleteFile } = require('../controller/file.controller');
const { deleteFileValidator } = require('../helper/validate.helper');
const { validate } = require('../middleware/validate.middleware');
const { storeFile } = require('../middleware/multer.middleware')
const { storage } = require('../util/localstore.util')
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage });

router.post("/uploadFile", upload.single('file'), verifyTokens, storeFile, uploadFile);
router.post("/deleteFile", verifyTokens, deleteFileValidator(), validate, deleteFile);

module.exports = router;
