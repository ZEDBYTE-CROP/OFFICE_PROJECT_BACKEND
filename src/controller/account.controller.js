const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { status } = require('../util/status.util')
const { responseHelper } = require('../helper/response.helper')
const { createTokens } = require('../middleware/jwt.middleware')
const { generateSalt, hashPassword, verifyPassword } = require("../util/password.util")

const loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: { email: email },
        })
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const verify = verifyPassword(password, user.salt, user.hashedPassword)
        if (!verify) {
            throw new Error("Invalid email or password");
        }
        const { accessToken, refreshToken } = createTokens(user.id)
        res.header('CL-X-TOKEN', accessToken);
        res.header('CL-X-REFRESH', refreshToken);
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, { name: user.name, email: user.email }));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const createAccount = async (req, res) => {
    try {
        const { email, password } = req.body
        const { salt, hashedPassword } = hashPassword(password, generateSalt())
        const result = await prisma.user.create({
            data: {
                email,
                salt,
                hashedPassword,
                files: {
                    create: [],
                },
            },
        })
        const { accessToken, refreshToken } = createTokens(result.id)
        res.header('CL-X-TOKEN', accessToken);
        res.header('CL-X-REFRESH', refreshToken);
        return res.status(status.insertDoc.code).json(responseHelper(status.insertDoc, { name: result.name, email: result.email }));
    } catch (error) {
        return res.status(status.insertErrorDoc.code).json(responseHelper(status.insertErrorDoc, error));
    }
}

const readAccount = async (req, res) => {
    try {
        const { userId } = req.body
        const result = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, files: { select: { id: true, createdAt: true, name: true} } }
        })
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, result));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

module.exports = {
    loginAccount,
    createAccount,
    readAccount,
}