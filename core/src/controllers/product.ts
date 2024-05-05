import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { minioClient, productBucket, publicBaseUrl } from '../utils/minio';

type ProductCreateReq = {
	productData: string;
};

type productData = {
	// id: number;
	name: string;
	type: number;
	// fileName: `${ProductType.SHIRT}/1`,
	originalPrice: number;
	offerPrice: number;
	isNewProduct: boolean;
	// publicUrl: `${publicBaseUrl}/${productBucket}/${ProductType.SHIRT}/1`,
	// createdAt: new Date(),
};

export async function AddProductController(
	req: Request<{}, {}, ProductCreateReq>,
	res: Response
) {
	try {
		const productFile = req.file;
		const { name, type, originalPrice, offerPrice, isNewProduct } =
			JSON.parse(req.body?.productData) as productData;
		if (
			!name ||
			!type ||
			!originalPrice ||
			!offerPrice ||
			!isNewProduct
		) {
			return res.status(400).send({
				message: 'Missing required fields',
				success: false,
			});
		}

		if (!productFile) {
			return res.status(400).send({
				message: 'no product file attached',
				success: false,
			});
		}

		const basicToken = req.headers.authorization?.split(' ')[1];
		if (!basicToken) {
			return res.status(401).send({
				message: 'Unauthorized. Basic token not found',
				success: false,
			});
		}

		const basicTokenDecoded = Buffer.from(basicToken, 'base64').toString(
			'utf-8'
		);
		const [email, password] = basicTokenDecoded.split(':');
		if (!email || !password) {
			return res.status(401).send({
				message: 'Unauthorized. Invalid bearer token format',
				success: false,
			});
		}

		const adminEmail = 'admin@admin.com';
		const adminPassword = 'admin';

		if (email !== adminEmail || password !== adminPassword) {
			return res.status(401).send({
				message: 'Unauthorized. Invalid email or password',
				success: false,
			});
		}

		const fileBuffer = productFile.buffer;
		const mimeType = productFile.mimetype;

		const highestIdOfProduct = await prisma.products.findFirst({
			where: {
				type: type,
			},
			orderBy: {
				id: 'desc',
			},
		});

		const newId = (highestIdOfProduct?.id ?? 0) + 1;

		const fileName = `${type}/${newId}`;
		const publicUrl = `${publicBaseUrl}/${productBucket}/${type}/${newId}`;

		// const alreadyExists = await prisma.products.findFirst({
		// 	where: {
		// 		id: id,
		// 		type: type,
		// 	},
		// });

		// if (alreadyExists) {
		// 	return res.status(400).send({
		// 		message: 'Product already exists',
		// 		success: false,
		// 	});
		// }

		const newProduct = await prisma.products.create({
			data: {
				id: newId,
				name,
				type,
				originalPrice,
				offerPrice,
				isNewProduct,
				publicUrl,
				createdAt: new Date(),
				fileName,
			},
		});

		await minioClient.putObject(
			productBucket,
			fileName,
			fileBuffer,
			fileBuffer.length,
			{
				'Content-Type': mimeType,
			}
		);

		return res.status(200).send({
			message: 'Product created successfully',
			success: true,
			product: newProduct,
		});
	} catch (err: any) {
		console.log(err);
		res.status(500).send({
			message: `Internal Server Error ${err?.message ?? err ?? ''}`,
			success: false,
		});
	}
}

export async function GetProductsController(_: Request, res: Response) {
	try {
		const products = await prisma.products.findMany();
		return res.status(200).send({
			message: 'Products fetched successfully',
			success: true,
			products,
		});
	} catch (err: any) {
		console.log(err);
		res.status(500).send({
			message: `Internal Server Error ${err?.message ?? err ?? ''}`,
			success: false,
		});
	}
}
