// some common constants
const ROLES = {
    ADMIN: 1,
    DIRECTOR: 2,
    HR: 3,
    MANAGER: 4,
    EMPLOYEE: 5,
};

const FORM_CATEGORIES = {
    PROBATIONARY: 1,
    ANNUAL: 2,
};

const FORM_STATUS = {
    CLOSE: "closed",
    OPEN: "open",
};

const USER_FORM_STATUS = {
    NEW: "new",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    CLOSED: "closed",
};

const HTTP_METHODS = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
};

const COMMON_CONSTANTS = {
    TRANSACTION_ERROR: "Transaction got error !",
    INVALID_PAGE: "Invalid paging index",
    EMP_ID_NUM_LONG: 6,
    START_EMP_ID: "ID000000",
    URL_NOT_FOUND: "URL not found !",
};

export { ROLES, FORM_CATEGORIES, FORM_STATUS, USER_FORM_STATUS, HTTP_METHODS, COMMON_CONSTANTS };
