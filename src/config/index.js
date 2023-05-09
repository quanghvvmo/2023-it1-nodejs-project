import { config as _config } from "dotenv";

// Load environment constables from .env file
_config();
const env = process.env.NODE_ENV || "development";

const configs = {
    base: {
        env,
        // Application
        name: process.env.APP_NAME || "SIMPLE_APP_NAME",
        host: process.env.HTTP_HOST || "localhost",
        port: process.env.HTTP_PORT || 8080,

        // Database
        dbHost: process.env.DB_HOST || "localhost",
        dbPort: process.env.DB_PORT || 3306,
        dbDialect: process.env.DB_DIALECT || "mysql",
        dbUsername: process.env.DB_USERNAME || "root",
        dbPassword: process.env.DB_PASSWORD,
        dbDatabase: process.env.DB_DATABASE,

        dbDatabaseTest: process.env.DB_DATABASE_TEST,

        // Security
        tokenSecret: process.env.TOKEN_SECRET,
        tokenExpiry: process.env.TOKEN_EXPIRY,

        // Pagination
        defaultIndexPagination: process.env.DEFAULT_INDEX_PAGINATION || 1,
        defaultSizePagination: process.env.DEFAULT_SIZE_PAGINATION || 10,

        // Mail Sender
        smtpMail: process.env.SMTP_MAIL,
        smtpPass: process.env.SMTP_PASS,
        mailService: process.env.MAIL_SERVICE,
    },
    development: {
        morganFormat:
            process.env.MORGAN_LOG_FORMAT ||
            ":method :url :status :response-time ms - :res[content-length]",
    },
    localhost: {
        morganFormat:
            process.env.MORGAN_LOG_FORMAT ||
            ":method :url :status :response-time ms - :res[content-length]",
    },
    test: {
        morganFormat:
            process.env.MORGAN_LOG_FORMAT ||
            ":method :url :status :response-time ms - :res[content-length]",
    },
};
const config = Object.assign(configs.base, configs[env]);

export default config;
