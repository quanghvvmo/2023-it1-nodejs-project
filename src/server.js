// Import necessary modules
import express from "express";
import config from "./config/index.js";
import db from "./database/index.js";
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("../src/config/swagger.js");
const cors = require("cors");
const yaml = require("yamljs");

const swaggerDocument = yaml.load("./src/config/swagger.yaml");

// Create an express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import routes from "./routes";

const initService = () => {
  console.log("Init - Register services.");
  app.use("/api", routes);
  console.log(`Init - Register services successfully.`);
  return;
};

const initSequelize = () => {
  console.log("Init - Establish connection.");
  return db
    .connect()
    .then(() => {
      console.log("Init - Establish connection successfully.");
      return true;
    })
    .catch((err) => {
      console.log("Init - Establish connection fail:", err);
      return false;
    });
};
const startServer = async () => {
  app.listen(config.port, config.host);
  app.use(cors());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  //db.seedData();
  initSequelize();
  initService();
  console.log(
    `Listening on host ${config.host} on port ${config.port} http://${config.host}:${config.port}`
  );
};

startServer();
export default app;
