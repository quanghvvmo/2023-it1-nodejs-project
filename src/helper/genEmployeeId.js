import { COMMON_CONSTANTS } from "../constants/index.js";

const genEmployeeId = (employeeId) => {
    const id = parseInt(employeeId.slice(2));
    const newId = id + 1;
    const paddedId = newId.toString().padStart(COMMON_CONSTANTS.EMPLOYEE_ID_NUM_LONG, "0");
    return `ID${paddedId}`;
};

export default genEmployeeId;
