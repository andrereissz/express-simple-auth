import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import * as hash from '../utils/hash.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

class AuthController {

    login = async (req, res) => {

        const { username, password } = req.body;

        const user = User.findByUsername(username);

        if (!user) {
            return res.status(404).send('User not Found');
        }

        const compare = await hash.comparePassword(password, user.password);

        if (!compare) {
            return res.status(401).send('Invalid Credentials');
        }

        const accessToken = jwt.sign({ userId: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        User.storeRefreshToken(user.id, refreshToken);

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: true
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: true
        });

        return res.status(200).json({ access_token: accessToken, refresh_token: refreshToken, users: User.db.users });
    }

    register = async (req, res) => {

        const { username, password } = req.body;

        const user = User.findByUsername(username);

        if (user) {
            return res.status(409).send("Username has already been taken.");
        }

        const hashedPassword = await hash.hashPassword(password);

        User.create(username, hashedPassword);

        return res.json({ message: "User created successfully", users: User.db.users });
    }
}

export default AuthController