// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
});


const upload = multer({ storage });
console.log(storage.filename);

router.post('/upload', authMiddleware, upload.single('file'), videoController.uploadVideo);
router.post('/trim', authMiddleware, videoController.trimVideo);
router.post('/merge', authMiddleware, videoController.mergeVideos);
router.get('/download/:id', authMiddleware, videoController.downloadVideo);

module.exports = router;