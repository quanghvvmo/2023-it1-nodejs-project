const FormStatus = {
    OPEN: "OPEN",
    CLOSE: "CLOSED",
    NEW: "NEW",
    SUBMITTED: "SUBMITTED",
    APPROVAL: "APPROVAL",
}

const FormCategory = {
    LABOUR_CONTRACT: 1,
    PERFORMANCE_REVIEW: 2,
}

const Roles = {
    ADMIN: 1,
    DIRECTOR: 2,
    HR: 3,
    MANAGER: 4,
    EMPLOYEE: 5,
}

const Options = {
    CASCADE: "CASCADE"
}

module.exports = { FormStatus, FormCategory, Roles, Options };
