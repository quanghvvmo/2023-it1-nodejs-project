const FORM_STATUS = {
  CLOSE: "close",
  OPEN: "open",
};

const USER_FORM_STATUS = {
  NEW: "new",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  CLOSED: "closed",
};
const FORM_MESSAGE = {
  EXIST: "form already exists",
  NOT_FOUND: "not found",
  UPDATE_FAILED: "update failed",
  FORM_CREATED: "Form created successfully",
  FORM_DELETED: "Form deleted successfully",
  FORM_UPDATED: "Form updated successfully",
  SINGLE_OPEN_FORM_LIMITATION: "Each user only has 1 type of form haven't closed",
  ROLLBACK_FAILED: "data was rollback successfully",
  INVALID_INDEX: "Invalid index",
};
export { FORM_STATUS, USER_FORM_STATUS, FORM_MESSAGE };
