const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');

const usersRoute = require('./routes/usersRouter');
const seedDatabase = require('./scripts/seed');

require('dotenv/config');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/testDB', usersRoute);

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    logger.info('Connected to MongoDB');
    seedDatabase();
  })
  .catch((error) => logger.error('Error connecting to MongoDB', error));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => logger.info(`Server is runnig on port ${PORT}`));
