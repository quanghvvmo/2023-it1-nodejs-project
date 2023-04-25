import Form from "../_database/models/form"
import Userform from "../_database/models/userForm"
import FormDetail from "../_database/models/formDetail"
import User from "../_database/models/user"
import { sequelize } from "../config/database"
import { FormCategory, FormStatus } from "../common/constant"
import { Op } from "sequelize";
import { FORM_MESSAGE } from "../common/formMessage"
import { ERR_CODE } from "../common/errCode"
import status from "http-status";

class formService {

    createForm = async (data) => {
        const form = await Form.create({
            ...data,
            typeid: FormCategory[data.category],
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
        const check = await Userform.findAll({
            where: {
                userid: {
                    [Op.in]: data.userids
                },
                status: {
                    [Op.notLike]: FormStatus.CLOSE
                }
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
                    typeid: FormCategory[data.category]
                },
                    { transaction }
                );
                for (let i = 0; i < data.userids.length; i++) {
                    userForms.push({
                        userid: data.userids[i],
                        formid: form.id,
                        managerid: data.managerid,
                    })
                }
                await Userform.bulkCreate(userForms, { transaction })
                await transaction.commit();
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

    myForm = async (userid) => {
        const myForm = await Userform.findAll({
            where: {
                userid: userid,
                isDeleted: 0,
            }
        })
        return ({
            data: myForm,
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    updateUserForm = async (data, givenId, user) => {
        const updatedForm = await Userform.update(data, { where: { id: givenId, userid: user.id, } })
        if (!updatedForm) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.FORM_FOUND,
                status: status.NOT_FOUND
            })
        }
        return ({
            data: updatedForm,
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_UPDATED,
            status: status.OK
        })
    }

    submitUserForm = async (data, givenId, user) => {
        const transaction = await sequelize.transaction();
        try {
            const submitForm = await Userform.findOne({
                where: { id: givenId, userid: user[0].id, status: FormStatus.NEW }
            })
            if (!submitForm) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            submitForm.userComment = data.userComment;
            submitForm.status = FormStatus.SUBMITTED;
            await submitForm.save({ transaction })

            await FormDetail.create(
                {
                    formid: submitForm.id,
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
            const approvalForm = await Userform.findOne({
                where: { id: givenId, managerid: user[0].id, status: FormStatus.SUBMITTED }
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
            if (!approvalForm) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            await FormDetail.update(
                { result: data.result, point: data.point },
                { where: { formid: approvalForm.id } },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_APPROVALED,
                status: status.OK
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    reportLabour = async (pageIndex, pageSize) => {
        const currentTime = new Date();
        let users = [];
        const offset = (parseInt(pageIndex) - 1) * pageSize;
        const forms = await Form.findAndCountAll({
            where: {
                typeid: FormCategory.LABOUR_CONTRACT,
                status: {
                    [Op.notLike]: FormStatus.CLOSE
                },
                expDate: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {
                    model: Userform,
                    where: {
                        status: {
                            [Op.notLike]: FormStatus.CLOSE
                        },
                    },
                    attributes: ["userid", "status"],
                    as: "userform",
                    include: [
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
            limit: pageSize,
            offset: offset,
            raw: true,
            nest: true
        })
        for (let i = 0; i < forms.count; i++) {
            users.push(forms.rows[i].userform.user);
        }
        return ({
            data: users,
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
        const offset = (parseInt(pageIndex) - 1) * pageSize;
        const forms = await Form.findAndCountAll({
            where: {
                typeid: FormCategory.PERFORMANCE_REVIEW,
                status: {
                    [Op.notLike]: FormStatus.CLOSE
                },
                expDate: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {
                    model: Userform,
                    where: {
                        status: {
                            [Op.notLike]: FormStatus.CLOSE
                        },
                    },
                    attributes: ["userid", "status"],
                    as: "userform",
                    include: [
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
            limit: pageSize,
            offset: offset,
            raw: true,
            nest: true
        })
        for (let i = 0; i < forms.count; i++) {
            users.push(forms.rows[i].userform.user);
        }
        return ({
            data: users,
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