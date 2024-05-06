require('dotenv').config();
const fs = require('fs');
const path = require('path');

function deleteSingleFile(name) {
    fs.unlink(path.join(__dirname, process.env.FILES_PATH + name+'.enc'), (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('File deleted successfully');
    });
}
module.exports = { deleteSingleFile };
