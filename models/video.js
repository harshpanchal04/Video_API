// models/video.js
module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define('Video', {
      filename: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
    return Video;
  };
  