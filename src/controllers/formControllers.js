import httpStatus from "http-status";
import { createForm } from "../services/formServices";
import { createFormSchema } from "../validate/formValidate";
const createNewForm = async (req, res, next) => {
  try {
    const { error, value } = createFormSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const form = await createForm(value);
    res.status(httpStatus.CREATED).json(form);
  } catch (err) {
    next(err);
  }
};

export { createNewForm };
