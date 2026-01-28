import jwt from 'jsonwebtoken';
import AuthController from '../controllers/auth.controller.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const authController = new AuthController();

export const auth = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new Error("Access Token not Found");
        }

        const result = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        if (result) {
            authController.refreshToken(req, res);
        }

        return next();

    } catch (error) {
        return res.status(403).json({ error: error.message });
    }

}