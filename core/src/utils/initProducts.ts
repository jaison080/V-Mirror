import { Products } from '@prisma/client';
import { ProductType } from './product';
import { minioClient, productBucket, publicBaseUrl } from './minio';
import { prisma } from './prisma';

const initialProducts: Products[] = [
	{
		id: 1,
		name: "Symbol Men's Polo T-Shirt",
		type: ProductType.SHIRT,
		fileName: `${ProductType.SHIRT}/1`,
		originalPrice: 500,
		offerPrice: 400,
		isNewProduct: true,
		publicUrl: `${publicBaseUrl}/${productBucket}/${ProductType.SHIRT}/1`,
		createdAt: new Date(),
	},
	{
		id: 2,
		name: 'Lymio Light Blue Shirt',
		type: ProductType.SHIRT,
		fileName: `${ProductType.SHIRT}/2`,
		originalPrice: 799,
		offerPrice: 499,
		isNewProduct: false,
		publicUrl: `${publicBaseUrl}/${productBucket}/${ProductType.SHIRT}/2`,
		createdAt: new Date(),
	},
	{
		id: 3,
		name: 'BULLMER Black Trendy T-Shirt',
		type: ProductType.SHIRT,
		fileName: `${ProductType.SHIRT}/3`,
		originalPrice: 699,
		offerPrice: 400,
		isNewProduct: false,
		publicUrl: `${publicBaseUrl}/${productBucket}/${ProductType.SHIRT}/3`,
		createdAt: new Date(),
	},

	{
		id: 1,
		name: 'White Drawstring Pant',
		type: ProductType.PANT,
		fileName: `${ProductType.PANT}/1`,
		originalPrice: 599,
		offerPrice: 400,
		isNewProduct: false,
		publicUrl: `${publicBaseUrl}/${productBucket}/${ProductType.PANT}/1`,
		createdAt: new Date(),
	},
	{
		id: 2,
		name: 'Arctix Insulated Cargo Pants',
		type: ProductType.PANT,
		fileName: `${ProductType.PANT}/2`,
		originalPrice: 499,
		offerPrice: 300,
		isNewProduct: true,
		publicUrl: `${publicBaseUrl}/${productBucket}/${ProductType.PANT}/2`,
		createdAt: new Date(),
	},
];

const getlocalFilePath = (product: Products) => {
	switch (product.type) {
		case ProductType.SHIRT:
			return `./assets/shirts/${product.id}.png`;
		case ProductType.PANT:
			return `./assets/pants/${product.id}.png`;
		case ProductType.SPEC:
			return `./assets/specs/${product.id}.png`;
		default:
			throw new Error('Invalid Product Type');
	}
};

export async function initProducts() {
	for (const product of initialProducts) {
		const alreadyExists = await prisma.products.findFirst({
			where: {
				id: product.id,
				type: product.type,
			},
		});
		if (alreadyExists) {
			continue;
		}

		await prisma.products.create({
			data: product,
		});

		const localFilePath = getlocalFilePath(product);
		await minioClient.fPutObject(
			productBucket,
			product.fileName,
			localFilePath,
			{
				'Content-Type': 'image/png',
			}
		);

        
	}
}
