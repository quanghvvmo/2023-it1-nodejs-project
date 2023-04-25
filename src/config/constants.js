export const REGULAR_EXPRESSIONS = {
    EMAIL: /^\S+@\S+\.\S+$/, // matches email addresses
    USERNAME: /^\S+$/, // matches usernames with no spaces
    PASSWORD: /^\S+$/, // matches passwords with no spaces
    PHONE: /^[0-9+-]*$/, // matches phone numbers with optional + and - characters
    ONE_SPACE_ONLY: /\s+/ // matches one or more spaces
};

export const TOKEN_TYPE = {
    JWT: 'jwt',
    BEARER: 'Bearer'
}

export const FORM_TYPES = {
    OPEN: "open",
    CLOSE: "close"
}

export const FORM_CATEGORY_TYPES = {
    PROBATION_REVIEW: "probation review",
    ANNUAL_REVIEW: "annual review"
}

export const ROLE_TYPES = {
    ADMIN: "admin", 
    DIRECTOR: "director", 
    MANAGER: "manager", 
    HR: "hr", 
    EMPLOYEE: "employee"
}

export const USER_FORM_TYPES = {
    NEW: "new",
    PENDING_APPROVAL: "pending approval",
    OPEN: "open",
    APPROVED: "approved",
    CLOSE: "close",
}

export const HTTP_METHODS = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete"
}