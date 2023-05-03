const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || "development";

const configs = {
    base: {
        env,

        // Application
        name: process.env.APP_NAME,
        host: process.env.HTTP_HOST,
        port: process.env.HTTP_PORT,

        //Image
        mediaDomain: process.env.MEDIA_DOMAIN,

        // Database
        dbHost: process.env.DB_HOST,
        dbPort: process.env.DB_PORT,
        dbDialect: process.env.DB_DIALECT || 'mysql',
        dbUsername: process.env.DB_USERNAME,
        dbPassword: process.env.DB_PASSWORD,
        dbDatabase: process.env.DB_DATABASE,

        // Security
        tokenSecret: process.env.TOKEN_SECRET,
        tokenExpiry: process.env.TOKEN_EXPIRY,

        // Paging
        defaultIndexPaging: process.env.DEFAULT_INDEX_PAGING,
        defaultSizePaging: process.env.DEFAULT_SIZE_PAGING,
    },
    development: {
    },
    localhost: {
    },
};

const config = {
    ...configs["base"],
    ...configs[env]
}

module.exports = config;
