import Form from '../_database/models/form'
import Userform from '../_database/models/userForm'
import FormDetail from '../_database/models/formDetail'
import { sequelize } from '../config/database'
import { FormCategory, FormStatus } from '../common/constant'
import { Op } from 'sequelize';

class formService {

    createForm = async (data) => {
        const form = await Form.create({
            ...data,
            typeid: FormCategory[data.category],
        })
        return ({
            data: form,
            errCode: 0,
            errMsg: 'Success'
        })
    }

    createUserForm = async (data) => {
        //Check user only have 1 form status not closing before create
        const check = await Userform.findAll({
            where: {
                userid: {
                    [Op.in]: data.userid
                },
                status: {
                    [Op.notLike]: FormStatus.Close
                }
            }
        })
        if (check && check.length > 0) {
            return ({
                errCode: -1,
                errMsg: "Can't creating form with this User right now!"
            })
        } else {
            const transaction = await sequelize.transaction();
            try {
                const form = await Form.create({
                    ...data,
                    typeid: FormCategory[data.category]
                },
                    { transaction }
                );
                await Promise.all(
                    data.userid.map(async (u) => {
                        await Userform.create(
                            {
                                userid: u,
                                formid: form.id,
                                managerid: data.managerid,
                            },
                            { transaction }
                        )
                    })
                );
                await transaction.commit();
                return ({
                    data: form,
                    errCode: 0,
                    errMsg: 'Success'
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
                { userComment: data.userComment, status: FormStatus.Submitted },
                { where: { id: givenId, userid: user.id, status: FormStatus.New }, },
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
                { managerComment: data.managerComment, status: FormStatus.Approval },
                { where: { id: givenId, status: FormStatus.Submitted } },
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
}

module.exports = new formService();