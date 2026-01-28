import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
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

        const accessToken = this.generateAccessToken(user.id, user.username);
        const refreshToken = this.generateRefreshToken(user.id);
        User.storeRefreshToken(user.id, refreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: true
        });

        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    }

    register = async (req, res) => {
        const { username, password } = req.body;
        const user = User.findByUsername(username);
        if (user) {
            return res.status(409).send("Username has already been taken.");
        }

        const hashedPassword = await hash.hashPassword(password);
        User.create(username, hashedPassword);

        return res.json({ message: "User created successfully" });
    }

    generateAccessToken = (userId, username) => {
        const token = jwt.sign({ userId, username }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        return token;
    }

    generateRefreshToken = (userId) => {
        const token = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return token;
    }

    refreshToken = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error("Refresh Token not Found.");
            }

            const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            const user = User.find(payload.userId);
            if (!user) {
                throw new Error("User not Found.");
            }

            const accessToken = this.generateAccessToken(user.id, user.username);

            return res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: true
            });

        } catch (error) {
            return res.status(403).json({ error: error.message });
        }
    }
}

export default AuthController