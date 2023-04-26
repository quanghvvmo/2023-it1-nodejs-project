const authMessages = {
    NO_TOKEN: "No token provided!",
    FAIL_AUTHENTICATE: "Failed to authenticate token!",
    NOT_LOGGED_IN: "You must be logged in to perform this operation!",
    AUTHORIZE_FORBIDDEN: "You are not authorized to perform the operation!",
};

const userMessages = {
    USER_NOT_FOUND: "User not found in database",
    DUPLICATE_USERNAME: "Username already exists",
    PASSWORDS_NOT_MATCH: "Passwords do not match",
    LOGIN_SUCCEED: "Login succeed",
    USER_CREATED: "User created successfully",
    USER_DELETED: "User deleted successfully",
    USER_UPDATED: "User updated successfully",
};

const formMessages = {
    FORM_NOT_FOUND: "User not found in database",
    FORM_CREATED: "Form created successfully",
    FORM_DELETED: "Form deleted successfully",
    FORM_UPDATED: "Form updated successfully",
    SINGLE_OPEN_FORM_LIMITATION: "Each user only has 1 type of form haven't closed",
};

const userFormMessages = {
    USER_FORM_NOT_FOUND: "UserForm not found in database",
    USER_FORM_CREATED: "UserForm created successfully",
    USER_FORM_DELETED: "UserForm deleted successfully",
    USER_FORM_UPDATED: "UserForm updated successfully",
};

const userFormDetailMessages = {
    USER_FORM_DETAIL_NOT_FOUND: "UserFormDetail not found in database",
    USER_FORM_DETAIL_CREATED: "UserFormDetail created successfully",
    USER_FORM_DETAIL_DELETED: "UserFormDetail deleted successfully",
    USER_FORM_DETAIL_UPDATED: "UserFormDetail updated successfully",
};

export { authMessages, userMessages, formMessages, userFormMessages, userFormDetailMessages };
