const Roles = {
    admin: 1,
    director: 2,
    hr: 3,
    manager: 4,
    employee: 5,
};

const FormCategories = {
    probationary: 1,
    annual: 2,
};

const FormStatus = {
    CLOSE: "close",
    OPEN: "open",
};

const UserFormStatus = {
    NEW: "new",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    CLOSED: "closed",
};

export { Roles, FormCategories, FormStatus, UserFormStatus };
