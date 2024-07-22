// controllers/videoController.js
const { Video } = require('../models');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

exports.uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send({ message: 'No file uploaded' });

    const video = await Video.create({
      filename: file.filename,
      size: file.size,
      duration: req.body.duration // Assuming duration is provided
    });

    res.status(201).send({ message: 'Video uploaded successfully', videoId: video.id });
  } catch (err) {
    res.status(500).send({ message: 'There was a problem uploading the video.' });
  }
};

exports.trimVideo = (req, res) => {
  const { videoId, startTime, endTime } = req.body;
  Video.findByPk(videoId).then(video => {
    if (!video) return res.status(404).send({ message: 'Video not found' });

    const inputPath = path.join(__dirname, '../uploads', video.filename);
    const outputPath = path.join(__dirname, '../uploads', `trimmed_${video.filename}`);

    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on('end', () => {
        res.status(200).send({ message: 'Video trimmed successfully', path: outputPath });
      })
      .on('error', err => {
        res.status(500).send({ message: 'Error trimming video', error: err.message });
      })
      .run();
  });
};

exports.mergeVideos = (req, res) => {
  const { videoIds } = req.body;
  const videoPaths = videoIds.map(id => path.join(__dirname, '../uploads', id.filename));
  const outputPath = path.join(__dirname, '../uploads', `merged_${Date.now()}.mp4`);

  ffmpeg()
    .input(videoPaths.join('|'))
    .on('end', () => {
      res.status(200).send({ message: 'Videos merged successfully', path: outputPath });
    })
    .on('error', err => {
      res.status(500).send({ message: 'Error merging videos', error: err.message });
    })
    .save(outputPath);
};

exports.downloadVideo = (req, res) => {
  const videoId = req.params.id;
  Video.findByPk(videoId).then(video => {
    if (!video) return res.status(404).send({ message: 'Video not found' });

    const videoPath = path.join(__dirname, '../uploads', video.filename);
    if (!fs.existsSync(videoPath)) return res.status(404).send({ message: 'Video file not found' });

    res.sendFile(videoPath);
  });
};
