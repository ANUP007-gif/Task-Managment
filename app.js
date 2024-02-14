const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

dotenv.config({ path: `${__dirname}/.env` });
require('./dbConnection');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utility/appError');

const TaskRouter = require('./routes/taskRoutes');


const app = express();

app.use(compression()); 

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Raa online api is working.' });
});

app.use('/api/task', TaskRouter);


// V2 API Routes
app.use('/api', require("./routes/index"));

// Wild card route for unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.method} ${req.originalUrl} route on this server.`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server running on port ${port}...`);
});
