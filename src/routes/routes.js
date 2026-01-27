import express from 'express';
import { loginChain, registerChain } from '../middlewares/auth.validator.js';
import AuthController from '../controllers/auth.controller.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login', loginChain, authController.login);
router.post('/register', registerChain, authController.register);

export default router;