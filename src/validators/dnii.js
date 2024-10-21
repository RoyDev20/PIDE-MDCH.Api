import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelpers";

const queryReniec = [
    check('user_key').exists().not().isEmpty(),
    check('document_number').exists().not().isEmpty(),
    check('s_key').exists().not().isEmpty(),
    check('environment').exists().not().isEmpty(),
    (req, res, next) =>{
        validateResult(req, res, next)
    }
]

export { queryReniec};