import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { loginChain, registerChain } from '../middlewares/auth.validator.js';
import AuthController from '../controllers/auth.controller.js';
import UserController from '../controllers/user.controller.js';

const router = express.Router();
const authController = new AuthController();
const userController = new UserController();

router.post('/login', loginChain, authController.login);
router.post('/register', registerChain, authController.register);
router.get('/test', auth, userController.index);

export default router;