import express from 'express';
import validator from 'express-validator';
import * as fakedb from './fakedb.js';
import * as hash from './utils/hash.js';
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const loginChain = [
    validator.body('username')
        .notEmpty(),

    validator.body('password')
        .notEmpty()
];

const registerChain = [
    validator.body('username')
        .notEmpty()
        .escape(),

    validator.body('password')
        .notEmpty()
];

app.post('/login', loginChain, async (req, res) => {
    const result = validator.validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    const { username, password } = req.body;

    const user = fakedb.findUserByUsername(username);

    if (!user) {
        res.status(404).send('User not Found');
    }

    const compare = await hash.comparePassword(password, user.password);

    return res.json({ login: compare });
});

app.post('/register', registerChain, async (req, res) => {
    const result = validator.validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    const { username, password } = req.body;

    const user = fakedb.findUserByUsername(username);

    if (user) {
        return res.status(409).send("Username has already been taken.");
    }

    const hashedPassword = await hash.hashPassword(password);

    fakedb.createUser(username, hashedPassword);

    return res.json({ message: "User created successfully", users: fakedb.db.users });
});