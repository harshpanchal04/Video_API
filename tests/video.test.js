const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

describe('Video API', () => {
  const token = 'your-static-jwt-token';
  let videoId;

  beforeAll((done) => {
    request(app)
      .post('/video/upload')
      .set('Authorization', token)
      .attach('file', fs.readFileSync(path.join(__dirname, 'test_video.mp4')), 'test_video.mp4')
      .field('duration', 120) // Example duration
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Video uploaded successfully');
        expect(res.body).toHaveProperty('videoId');
        videoId = res.body.videoId;
        done();
      });
  });

  it('should trim a video', (done) => {
    request(app)
      .post('/video/trim')
      .set('Authorization', token)
      .send({ videoId, startTime: 0, endTime: 2 })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Video trimmed successfully');
        expect(res.body).toHaveProperty('videoId');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('downloadLink');
        done();
      });
  },50000);

  it('should merge videos', (done) => {
    request(app)
      .post('/video/merge')
      .set('Authorization', token)
      .send({ videoIds: [videoId, videoId] }) // Use the same video ID twice
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Videos merged successfully');
        expect(res.body).toHaveProperty('videoId');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('downloadLink');
        done();
      });
  },70000);

  it('should download a video', (done) => {
    request(app)
      .get(`/video/download/${videoId}`)
      .set('Authorization', token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toMatch(/video/);
        done();
      });
  },10000);
});
