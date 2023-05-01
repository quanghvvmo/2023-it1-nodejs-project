const getEnvironmentSetting = async () => {
    process.env.NODE_ENV = process.env.NODE_ENV || "development";

    console.log("Init - Start on environment: " + process.env.NODE_ENV);

    switch (process.env.NODE_ENV) {
        case "development":
            break;
        case "test":
            break;
        case "production":
            break;
        default:
            break;
    }

    console.log("Init - Start on environment successfully.");
};

export default getEnvironmentSetting;
