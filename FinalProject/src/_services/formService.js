import Form from "../_database/models/form"
import UserForm from "../_database/models/userForm"
import FormDetail from "../_database/models/formDetail"
import User from "../_database/models/user"
import { sequelize } from "../config/database"
import { FormCategory, FormStatus } from "../common/constant"
import { Op } from "sequelize";
import { FORM_MESSAGE } from "../common/formMessage"
import { ERR_CODE } from "../common/errCode"
import { MAIL_CONTENT } from "../common/mailContent"
import status from "http-status";
import sendMail from "../_ultis/mailer";

class formService {

    getAllUserForm = async (pageIndex, pageSize) => {
        const userForms = await UserForm.findAll({
            where: { isDeleted: 0 },
            raw: true
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: userForms.slice(start, end),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    createForm = async (data) => {
        const form = await Form.create({
            ...data,
            typeId: FormCategory[data.categoryName],
        })
        return ({
            data: form,
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_CREATED,
            status: status.CREATED
        })
    }

    createUserForm = async (data) => {
        //Check user only have 1 form status not closing before create
        const check = await UserForm.findAll({
            where: {
                userId: {
                    [Op.in]: data.userIds
                },
                status: {
                    [Op.notLike]: FormStatus.CLOSE
                },
                isDeleted: 0
            }
        })
        if (check && check.length > 0) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.USER_CONFLICT,
                status: status.CONFLICT
            })
        } else {
            const transaction = await sequelize.transaction();
            try {
                let userForms = [];
                const form = await Form.create({
                    ...data,
                    typeId: FormCategory[data.categoryName]
                },
                    { transaction }
                );
                for (let i = 0; i < data.userIds.length; i++) {
                    userForms.push({
                        userId: data.userIds[i],
                        formId: form.id,
                        managerId: data.managerId,
                    })
                }
                await UserForm.bulkCreate(userForms, { transaction })
                await transaction.commit();

                //Get list users to take email for email sending
                const listUsers = await User.findAll({
                    where: {
                        id: {
                            [Op.in]: data.userIds
                        },
                        isDeleted: 0
                    },
                    raw: true
                });

                await Promise.all(
                    listUsers.map(async (user) => {
                        await sendMail(user.email, data.name, MAIL_CONTENT)
                    })
                )
                return ({
                    data: form,
                    errCode: ERR_CODE.OK,
                    errMsg: FORM_MESSAGE.FORM_CREATED,
                    status: status.CREATED
                })
            } catch (error) {
                await transaction.rollback();
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                    status: status.INTERNAL_SERVER_ERROR
                })
            }
        }
    }

    formForEmployee = async (userId, pageIndex, pageSize) => {
        const myForms = await UserForm.findAll({
            where: {
                userId: userId,
                isDeleted: 0,
            },
            include: [
                {
                    model: FormDetail,
                    as: "formdetail"
                }
            ],
            raw: true,
            nest: true,
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: myForms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: myForms.length,
            totalPage: Math.round(myForms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    formForManager = async (managerId, pageIndex, pageSize) => {
        const myForms = await UserForm.findAll({
            where: {
                managerId: managerId,
                isDeleted: 0,
                status: FormStatus.SUBMITTED,
            },
            include: [
                {
                    model: FormDetail,
                    as: "formdetail"
                }
            ],
            raw: true,
            nest: true,
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: myForms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: myForms.length,
            totalPage: Math.round(myForms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    updateUserForm = async (data, givenId, user) => {
        const updatedForm = await UserForm.update(data, { where: { id: givenId, userId: user.id, isDeleted: 0 } })
        if (!updatedForm) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.FORM_FOUND,
                status: status.NOT_FOUND
            })
        }
        return ({
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_UPDATED,
            status: status.OK
        })
    }

    submitUserForm = async (data, givenId, user) => {
        const transaction = await sequelize.transaction();
        try {
            const submitForm = await UserForm.findOne({
                where: { id: givenId, userId: user.id, status: FormStatus.NEW, isDeleted: 0 }
            })
            if (!submitForm) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            submitForm.userCmt = data.userCmt;
            submitForm.status = FormStatus.SUBMITTED;
            await submitForm.save({ transaction })
            //Create new form detail
            await FormDetail.create(
                {
                    formId: submitForm.id,
                    descTask: data.descTask
                },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_SUBMITTED,
                status: status.OK
            })
        } catch (error) {
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    approvalForm = async (data, givenId, user) => {
        const transaction = await sequelize.transaction();
        try {
            const approvalForm = await UserForm.findOne({
                where: { id: givenId, managerId: user.id, status: FormStatus.SUBMITTED, isDeleted: 0 }
            })
            if (!approvalForm) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            approvalForm.managerCmt = data.managerComment;
            approvalForm.status = FormStatus.APPROVAL;
            await approvalForm.save({ transaction })
            //Update detail of form
            await FormDetail.update(
                { result: data.result, point: data.point },
                { where: { formId: approvalForm.id } },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_APPROVALED,
                status: status.OK
            })
        } catch (error) {
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    closeUserForm = async (formId) => {
        const userForm = await UserForm.findOne({
            where: {
                id: formId,
                status: FormStatus.APPROVAL,
                isDeleted: 0
            },
            raw: false
        })
        if (!userForm) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                status: status.NOT_FOUND
            })
        }
        userForm.status = FormStatus.CLOSE;
        await userForm.save();
        return ({
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_CLOSE,
            status: status.OK
        })
    }

    reportLabour = async (pageIndex, pageSize) => {
        const currentTime = new Date();
        let users = [];
        const forms = await Form.findAll({
            where: {
                typeId: FormCategory.LABOUR_CONTRACT,
                status: {
                    [Op.notLike]: FormStatus.CLOSE
                },
                expDate: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {
                    model: UserForm,
                    where: {
                        status: {
                            [Op.notLike]: FormStatus.CLOSE
                        },
                    },
                    attributes: ["userId", "status"],
                    as: "userform",
                    include: [
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
            raw: true,
            nest: true
        })

        for (let i = 0; i < forms.length; i++) {
            users.push(forms[i].userform.user);
        }
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: users.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: users.length,
            totalPage: Math.round(users.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    reportPerfomance = async (pageIndex, pageSize) => {
        const currentTime = new Date();
        let users = [];
        const forms = await Form.findAll({
            where: {
                typeId: FormCategory.PERFORMANCE_REVIEW,
                status: FormStatus.OPEN,
                expDate: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {
                    model: UserForm,
                    where: {
                        status: {
                            [Op.notLike]: FormStatus.CLOSE
                        },
                    },
                    attributes: ["userId", "status"],
                    as: "userform",
                    include: [
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
            raw: true,
            nest: true
        })
        for (let i = 0; i < forms.length; i++) {
            users.push(forms[i].userform.user);
        }
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: users.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: users.length,
            totalPage: Math.round(users.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }
}

module.exports = new formService();