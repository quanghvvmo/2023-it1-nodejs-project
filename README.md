# REST API for HR Management using Node.js, Express, Sequelize and MySQL + JWT Authentication and Authorization

## Getting Started

1. Clone this repository

   ```bash
   git clone https://github.com/indraarianggi/nodejs-sequelize-mysql-api.git
   cd nodejs-sequelize-mysql-api

2. Install the npm packages

   ```bash
   npm install
   ```

   Also install `nodemon` globally, if you don't have it yet.

   ```bash
   npm install -g nodemon
   ```

3. Congfigure environment settings

   Create a file with the following name and location `.env` and copy the contents from `.env.example` into it. Replace the values with your specific configuration. Don't worry, this file is in the `.gitignore` so it won't get pushed to github.

    ```bash
    APP_NAME = HR_MANAGER
    HTTP_HOST = 127.0.0.1
    HTTP_PORT = 8080
    DB_DATABASE = hr_management
    DB_USERNAME = root
    DB_PASSWORD = 12345678
    DB_HOST = localhost
    DB_PORT = 3306
    DB_DIALECT = mysql

    TOKEN_SECRET = FINALKEY
    TOKEN_EXPIRY = 3d

    DEFAULT_INDEX_PAGINATION = 1
    DEFAULT_SIZE_PAGINATION = 5

    MEDIA_DOMAIN = ./src/images/
   ```

4. Running the app locally

   Run this command, which is located in npm script in `package.json` file.

   ```bash
   npm run start
   ```