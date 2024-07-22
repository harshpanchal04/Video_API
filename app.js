// app.js
const express = require('express');
const bodyParser = require('body-parser');
const videoRoutes = require('./routes/videoRoutes');
const { sequelize } = require('./models');
const config = require('./config/config');

const app = express();
app.use(bodyParser.json());

app.use('/video', videoRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
