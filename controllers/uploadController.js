const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // 100MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file'); // Expecting field name 'file'

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|mp4|webm|ogg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and Videos Only!');
    }
}

const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            let message = 'File upload failed';

            if (typeof err === 'string') {
                message = err;
            } else if (err.message) {
                message = err.message;
            } else {
                message = JSON.stringify(err);
            }

            // Handle specific Multer errors for better user feedback
            if (err.code === 'LIMIT_FILE_SIZE') {
                message = 'File is too large (Max 100MB)';
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                message = 'Unexpected file field or too many files';
            }

            return res.status(400).json({ msg: message });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ msg: 'No file selected!' });
            } else {
                res.json({
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
};

module.exports = {
    uploadFile
};
