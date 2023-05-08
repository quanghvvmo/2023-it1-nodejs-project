const getEnvironmentSetting = async () => {
    process.env.NODE_ENV = process.env.NODE_ENV || "development";



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

  
};

export default getEnvironmentSetting;
