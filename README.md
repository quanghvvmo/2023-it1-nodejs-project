# HR MANAGEMENT PROJECT

## Intro

The application is designed to automate various HR processes such as managing employees' personal information, recording and tracking their performance evaluations, and managing the onboarding process for new hires. The system includes modules for managing users, roles, and permissions, as well as notifications and reporting features.

Note:

Swagger UI: http://localhost:8080/api-docs

"API Collection.postman_collection.json" in root folder for import in Postman

"hr_management.sql" for database seeder. Run it first before run application.

## Techs

Languages: Javascript
Framework: ExpressJs
Database: MySQL (Sequelize)

## To prepare project

Create .env file in root directory with the following format:

```
HTTP_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DIALECT=

DB_DATABASE_TEST=

TOKEN_SECRET=
TOKEN_EXPIRY=

DEFAULT_INDEX_PAGINATION=
DEFAULT_SIZE_PAGINATION=

SMTP_MAIL=
SMTP_PASS=
MAIL_SERVICE=
```

## To run project

```shell
> npm install
> npm start
```

## To test

Create separate database for test and change DB_DATABASE_TEST in .env then run seeder .sql file.

```shell
> npm test
```
