const multer = require("multer");

const MIME_TYPES = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(".")[0].split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({ storage }).single("image");