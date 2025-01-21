// middlewares/upload.js  
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save uploaded files  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name  
    }
});

// Create the multer instance  
const upload = multer({ storage });

module.exports = upload;  
