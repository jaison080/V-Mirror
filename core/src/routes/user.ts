import { Router } from 'express';
import {
    GetScreenshotsController,
	LoginController,
	SignupController,
	UploadScreenshotController,
} from '../controllers/user';
import multer, { memoryStorage } from 'multer';

export const userRouter = Router();

userRouter.post('/signup', SignupController);
userRouter.post('/login', LoginController);

userRouter.post(
	'/screenshot',
	multer({
		storage: memoryStorage(),
		limits: {
			fileSize: 5 * 1024 * 1024 * 10,
		},
	}).single('screenshot'),
	UploadScreenshotController
);

userRouter.get('/screenshot', GetScreenshotsController)