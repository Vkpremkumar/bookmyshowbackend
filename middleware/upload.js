const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads") // specify the destination folder
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname)) // filename will include timestamps to avoid collisions
    }
});

// initialize upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2  // limit size 2MB
    }
});


module.exports = upload;