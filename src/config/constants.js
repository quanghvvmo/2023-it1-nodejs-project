const REGULAR_EXPRESSIONS = {
    EMAIL: /^\S+@\S+\.\S+$/, // matches email addresses
    USERNAME: /^\S+$/, // matches usernames with no spaces
    PASSWORD: /^\S+$/, // matches passwords with no spaces
    PHONE: /^[0-9+-]*$/, // matches phone numbers with optional + and - characters
    ONE_SPACE_ONLY: /\s+/, // matches one or more spaces
    NOT_DIGITS: /\D/g,
    IS_UUID: /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i
};

const TOKEN_TYPE = {
    JWT: 'jwt',
    BEARER: 'Bearer'
}

const FORM_TYPES = {
    OPEN: "open",
    CLOSE: "close"
}

const FORM_CATEGORY_TYPES = {
    PROBATION_REVIEW: "probation review",
    ANNUAL_REVIEW: "annual review"
}

const ROLE_TYPES = {
    ADMIN: "admin", 
    DIRECTOR: "director", 
    MANAGER: "manager", 
    HR: "hr", 
    EMPLOYEE: "employee"
}

const USER_FORM_TYPES = {
    NEW: "new",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    CLOSED: "closed",
}

const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

module.exports = { REGULAR_EXPRESSIONS, TOKEN_TYPE, FORM_TYPES, FORM_CATEGORY_TYPES, ROLE_TYPES, USER_FORM_TYPES, HTTP_METHODS }