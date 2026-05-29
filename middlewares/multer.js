const multer = require('multer')
const path = require('path')
const fs = require('fs').promises

const storage = multer.diskStorage({
  destination: async (req, res, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'books', 'original')
    try {
      await fs.mkdir(dir, { recursive: true })
      cb(null, dir)
    } catch (err) {
      cb(err)
    }
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname)
    const filename = `${Date.now()}${extension}`
    cb(null, filename)
  },
})

exports.imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/octet-stream',
    ];

    const allowedExtensions = ['.png', '.jpg', '.jpeg'];

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(ext)
    ) {
      return cb(null, true);
    } else {
      return cb(new Error('Only PNG, JPEG, and JPG files are allowed'));
    }
  },
})