const regularExpressions = {
    EMAIL: /^\S+@\S+\.\S+$/,
    USERNAME: /^\S+$/,
    PASSWORD: /^\S+$/,
    PHONE: /^[0-9+-]*$/,
    ONE_SPACE_ONLY: /\s+/
}

module.exports = regularExpressions;