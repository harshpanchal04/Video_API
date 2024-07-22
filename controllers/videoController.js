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
    res.status(500).send({ message: 'There was a problem uploading the video.', error: err.message });
  }
};

exports.trimVideo = async (req, res) => {
  try {
    const { videoId, startTime, endTime } = req.body;
    const video = await Video.findByPk(videoId);
    if (!video) return res.status(404).send({ message: 'Video not found' });

    const inputPath = path.join(__dirname, '../uploads', video.filename);
    const trimmedFilename = `trimmed_${video.filename}`;
    const outputPath = path.join(__dirname, '../uploads', trimmedFilename);

    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on('end', async () => {
        const trimmedVideo = await Video.create({
          filename: trimmedFilename,
          size: video.size, // Assuming the size remains the same
          duration: endTime - startTime
        });
        res.status(200).send({ message: 'Video trimmed successfully', videoId: trimmedVideo.id, path: outputPath, downloadLink: `<a href="/video/download/${trimmedVideo.id}">Download Trimmed Video</a>` });
      })
      .on('error', err => {
        console.error('Error trimming video:', err.message);
        res.status(500).send({ message: 'Error trimming video', error: err.message });
      })
      .run();
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send({ message: 'Database error', error: err.message });
  }
};

exports.mergeVideos = async (req, res) => {
  try {
    const { videoIds } = req.body; 
    const videos = await Video.findAll({ where: { id: videoIds } });
    console.log(videos);
    if (!videos || videos.length === 0) return res.status(404).send({ message: 'No videos found' });

    const videoPaths = videos.map(video => path.join(__dirname, '../uploads', video.filename));
    const mergedFilename = `merged_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../uploads', mergedFilename);

    let ffmpegCommand = ffmpeg();
    videoPaths.forEach(videoPath => {
      ffmpegCommand = ffmpegCommand.input(videoPath);
    });

    ffmpegCommand
      .on('end', async () => {
        const mergedVideo = await Video.create({
          filename: mergedFilename,
          size: videos.reduce((total, video) => total + video.size, 0), // Sum of sizes of all videos
          duration: videos.reduce((total, video) => total + video.duration, 0) // Sum of durations of all videos
        });
        res.status(200).send({ message: 'Videos merged successfully', videoId: mergedVideo.id, path: outputPath, downloadLink: `<a href="/video/download/${mergedVideo.id}">Download Merged Video</a>` });
      })
      .on('error', err => {
        console.error('Error merging videos:', err.message);
        res.status(500).send({ message: 'Error merging videos', error: err.message });
      })
      .mergeToFile(outputPath, './temp');
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send({ message: 'Database error', error: err.message });
  }
};

exports.downloadVideo = (req, res) => {
  const videoId = req.params.id;
  Video.findByPk(videoId).then(video => {
    if (!video) return res.status(404).send({ message: 'Video not found' });

    const videoPath = path.join(__dirname, '../uploads', video.filename);
    if (!fs.existsSync(videoPath)) return res.status(404).send({ message: 'Video file not found' });

    res.download(videoPath, video.filename);
  }).catch(err => {
    console.error('Database error:', err.message);
    res.status(500).send({ message: 'Database error', error: err.message });
  });
};

