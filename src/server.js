const express = require("express");
const cors = require("cors");
const config = require("./config/index.js");
const getEnvironmentSetting = require("./_utils/enviromentSettings.js");
const sequelize = require("./models/dbconfig.js");
const routers = require("./routes/index.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const initSequelize = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.log("Failed init Sequelize connection:", err);
    }
}

const initServer = () => {
    app.use("/api/v1", routers);
    console.log("Init server successfully.");
}

const startServer = () => {
    app.listen(config.port, config.host, () => {
        console.log(`Server started at ${config.host}:${config.port}`);
    });
}

getEnvironmentSetting()
.then(() => initSequelize())
.then(() => initServer())
.then(() => startServer())
.catch((error) => {
    console.log('Failed setup environment:', error);
})

module.exports = app;



