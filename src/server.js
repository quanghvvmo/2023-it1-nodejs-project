import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import config from "./config/index.js";
import getEnvironmentSetting from "./_utils/environment.js";
import sequelize from "./models/index.js";
import routers from "./routes/index.js";
import { converter, notFound } from "./middlewares/errorHandler.middleware.js";
import swaggerDocument from "./config/swagger.js";

const app = express();
// Configuring cors
app.use(cors());
// Configuring body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan(config.morgan_format));

const initService = () => {
    console.log("Init - Register services.");
    app.use("/api/v1", routers);

    // Init api documents
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`Init - Register services successfully.`);
};

const initSequelize = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log("Init - Establish connection successfully.");
        })
        .catch((err) => {
            console.log("Init - Establish connection fail:", err);
        });
};

const handleError = () => {
    // if error is not an instanceOf APIError, convert it.
    // app.use(converter);

    // catch 404 and forward to error handler
    app.use(notFound);
};

const startServer = async () => {
    app.listen(config.port, config.host);
    console.log(`Listening on host ${config.host} on port ${config.port} `);
};

getEnvironmentSetting()
    // .then(registerMiddleware.bind(this, app))
    .then(initSequelize.bind(this))
    .then(initService.bind(this))
    .then(handleError.bind(this))
    .then(startServer.bind(this))
    .catch((error) => {
        console.error("Startup Error: ", error);
    });

export default app;
