import express from 'express';
import * as fakedb from './fakedb.js';
import * as hash from './utils/hash.js';
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = fakedb.findUserByUsername(username);

    if(!user) {
        res.status(404);
    }

    const compare = await hash.comparePassword(password, user.password);

    res.json({ login: compare });
});

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = fakedb.findUserByUsername(username);

    if(user) {
        res.status(403).send("Username has already been taken.");
    }

    const hashedPassword = await hash.hashPassword(password);

    fakedb.createUser(username, hashedPassword);

    res.json({ message: "User created successfully", users: fakedb.db.users });
});