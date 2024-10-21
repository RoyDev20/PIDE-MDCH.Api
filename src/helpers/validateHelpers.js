import { validationResult } from "express-validator";
import { validation } from "../helpers/response";
const validateResult = async (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        const errors = err.array().map(e => ` El parametro ${e.param}, ${e.msg}`);
        return res.status(422).send(validation(errors));
        // return res.status(422).send(validation(err.array()));
    }
}
export { validateResult }
