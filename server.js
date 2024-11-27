const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

let dbUrl;

if (process.env.DATABASE_USERNAME) {
  dbUrl = process.env.DATABASE_URL.replace('<USERNAME>', process.env.DATABASE_USERNAME).replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
}

dbUrl = process.env.DATABASE_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connected!');
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  });

// START SERVER
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// CATCHING ERRORS USING USING LISTENER

process.on('unhandledRejection', err => {
  console.log('UNHANDLE REJECTION 🔥! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
