import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import {
	AddProductController,
	GetProductsController,
} from '../controllers/product';

export const productRouter = Router();

productRouter.get('/', GetProductsController);
productRouter.post(
	'/',
	multer({
		storage: memoryStorage(),
		limits: {
			fileSize: 5 * 1024 * 1024 * 10,
		},
	}).single('product'),
	AddProductController
);
