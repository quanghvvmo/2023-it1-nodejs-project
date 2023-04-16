const getEnvironmentSetting = () => {
    return new Promise((resolve, reject) => {
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  
        console.log("Current environment:", process.env.NODE_ENV);
  
        switch (process.env.NODE_ENV) {
            case 'development':
                resolve();
            break;
            case 'production':
                resolve();
            break;
            default:
                reject(new Error('Environment not found'));
            break;
        }
  
        console.log('Setup environment successfully');
    });
};

module.exports = getEnvironmentSetting