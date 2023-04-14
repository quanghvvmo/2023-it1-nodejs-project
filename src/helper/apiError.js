class APIError extends Error {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({ message, errors, stack, status }) {
        super(message);
        this.name = this.constructor.name;
        this.errors = errors;
        this.stack = stack;
        this.status = status;
    }
}

export default APIError;
