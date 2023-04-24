import Form from "../_database/models/form"
import Userform from "../_database/models/userForm"
import FormDetail from "../_database/models/formDetail"
import User from "../_database/models/user"
import { sequelize } from "../config/database"
import { FormCategory, FormStatus } from "../common/constant"
import { Op } from "sequelize";

class formService {

    createForm = async (data) => {
        const form = await Form.create({
            ...data,
            typeid: FormCategory[data.category],
        })
        return ({
            data: form,
            errCode: 0,
            errMsg: "Success"
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
                errCode: -1,
                errMsg: "Unable to create form with this User right now!"
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
                    errCode: 0,
                    errMsg: "Success"
                })
            } catch (error) {
                await transaction.rollback();
                return ({
                    errCode: 1,
                    errMsg: "Transaction Error!"
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
            errCode: 0,
            errMsg: "Sucess"
        })
    }

    updateUserForm = async (data, givenId, user) => {
        const updatedForm = await Userform.update(data, { where: { id: givenId, userid: user.id, } })
        if (!updatedForm) {
            return ({
                errCode: -1,
                errMsg: "Not found form of user"
            })
        }
        return ({
            data: updatedForm,
            errCode: 0,
            errMsg: "Success"
        })
    }

    submitUserForm = async (data, givenId, user) => {
        const transaction = await sequelize.transaction();
        try {
            const submitForm = await Userform.update(
                { userComment: data.userComment, status: FormStatus.SUBMITTED },
                { where: { id: givenId, userid: user.id, status: FormStatus.NEW }, },
                { transaction }
            );
            if (!submitForm) {
                return ({
                    errCode: -1,
                    errMsg: "Not found form of user"
                })
            }
            await FormDetail.create(
                {
                    formid: submitForm.id,
                    descTask: data.descTask
                },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: 0,
                errMsg: "Sucess"
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return ({
                errCode: 1,
                errMsg: "Transaction Error!"
            })
        }
    }

    approvalForm = async (data, givenId) => {
        const transaction = await sequelize.transaction();
        try {
            const approvalForm = await Userform.update(
                { managerComment: data.managerComment, status: FormStatus.APPROVAL },
                { where: { id: givenId, status: FormStatus.SUBMITTED } },
                { transaction }
            )
            if (!approvalForm) {
                return ({
                    errCode: -1,
                    errMsg: "Form not found"
                })
            }
            await FormDetail.update(
                { result: data.result, point: data.point },
                { where: { formid: givenId } },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: 0,
                errMsg: "Sucess"
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return ({
                errCode: 1,
                errMsg: "Transaction Error!"
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
            errCode: 0,
            errMsg: "Sucess"
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
            errCode: 0,
            errMsg: "Sucess"
        })
    }
}

module.exports = new formService();