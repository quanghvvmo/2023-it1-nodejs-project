exports.generateEmployeeCode = () => {
    const PREFIX = "ID";
    const LENGTH = 5;
    const MIN_NUMBER = 10000;
    const MAX_NUMBER = 99999;

    const randomNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1) + MIN_NUMBER);

    const timestamp = new Date().getTime().toString();
    const code = (PREFIX + timestamp + randomNumber).slice(-LENGTH);
    return code;
}


