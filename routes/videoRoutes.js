// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('file'), videoController.uploadVideo);
router.post('/trim', authMiddleware, videoController.trimVideo);
router.post('/merge', authMiddleware, videoController.mergeVideos);
router.get('/download/:id', authMiddleware, videoController.downloadVideo);

module.exports = router;
