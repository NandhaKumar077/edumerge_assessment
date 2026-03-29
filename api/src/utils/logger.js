/**
 * EduMerge Central Logger Utility
 * Standardizes Info, Warning, and Error logging across the API.
 */
const chalk = {
    info: (msg) => console.log(`\x1b[32m[INFO]\x1b[0m ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${msg}`)
};

const logger = {
    info: (message, context = '') => {
        chalk.info(`${context ? `[${context}] ` : ''}${message}`);
    },
    warn: (message, context = '') => {
        chalk.warn(`${context ? `[${context}] ` : ''}${message}`);
    },
    error: (message, context = '', errorObj = null) => {
        chalk.error(`${context ? `[${context}] ` : ''}${message}${errorObj ? ` | Details: ${errorObj.message || errorObj}` : ''}`);
    }
};

module.exports = logger;
