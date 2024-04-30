import { Router } from 'express';
import { LoginController, SignupController } from '../controllers/user';

export const userRouter = Router();

userRouter.post('/signup', SignupController);
userRouter.post('/login', LoginController);
