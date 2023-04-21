const FormStatus = {
    Open: 'OPEN',
    Close: 'CLOSED',
    New: 'NEW',
    Submitted: 'SUBMITTED',
    Approval: 'APPROVAL',
}
const FormCategory = {
    LABOUR_CONTRACT: 1,
    PERFORMANCE_REVIEW: 2,
}

const Roles = {
    Admin: 1,
    Director: 2,
    Hr: 3,
    Manager: 4,
    Employee: 5,
}

module.exports = { FormStatus, FormCategory, Roles };
