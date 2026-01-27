import validator, { validationResult } from 'express-validator';

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const loginChain = [
    validator.body('username')
        .notEmpty(),

    validator.body('password')
        .notEmpty(),

    validateResult
];

export const registerChain = [
    validator.body('username')
        .notEmpty()
        .escape(),

    validator.body('password')
        .notEmpty(),

    validateResult
];