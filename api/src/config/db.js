const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI_HOST || process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/edumerge_db';
        const conn = await mongoose.connect(uri);
        logger.info(`MongoDB Connected: ${conn.connection.host}`, 'Database');

        mongoose.connection.on('error', (err) => {
            logger.error(`Connection Error: ${err.message}`, 'Database');
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB Disconnected', 'Database');
        });

    } catch (error) {
        logger.error(`Database Connection Failed! Error: ${error.message}`, 'Database');
        process.exit(1);
    }
};

module.exports = connectDB;
