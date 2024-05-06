const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { status } = require('../util/status.util')
const { responseHelper } = require('../helper/response.helper')
const { deleteSingleFile } = require('../util/deleteFile.util');

const uploadFile = async (req, res) => {
    try {
        const { userId, filename } = req.body
        const result = await prisma.file.create({
            data: {
                name: filename,
                user: { connect: { id: userId } },
            },
        })
        return res.status(status.insertDoc.code).json(responseHelper(status.insertDoc, result));
    } catch (error) {
        return res.status(status.insertErrorDoc.code).json(responseHelper(status.insertErrorDoc, error));
    }
}

const deleteFile = async (req, res) => {
    try {
        const { id } = req.body
        const readFile = await prisma.file.findUnique({
            where: {
                id: id,
            },
        })
        deleteSingleFile(readFile.name)
        const result = await prisma.file.delete({
            where: {
                id: id,
            },
        })
        return res.status(status.deleteDoc.code).json(responseHelper(status.deleteDoc, result));
    } catch (error) {
        return res.status(status.deleteErrorDoc.code).json(responseHelper(status.deleteErrorDoc, error));
    }
}

module.exports = {
    uploadFile,
    deleteFile
}