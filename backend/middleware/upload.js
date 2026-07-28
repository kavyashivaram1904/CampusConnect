// =======================================================
// IMPORTS
// =======================================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =======================================================
// CREATE uploads FOLDER IF NOT EXISTS
// =======================================================

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// =======================================================
// STORAGE
// =======================================================

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

// =======================================================
// EXPORT
// =======================================================

module.exports = multer({ storage });