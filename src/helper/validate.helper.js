const { body, query, param } = require('express-validator');

const loginValidator = () => [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 4 }).trim(),
];

const createAccountValidator = () => [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 4 }).trim(),
];

const readAccountValidator = () => [
    query('userId').isUUID()
];


const deleteFileValidator = () => [
    body('id').isUUID(),
];

module.exports = {
    loginValidator, createAccountValidator, readAccountValidator, deleteFileValidator
}