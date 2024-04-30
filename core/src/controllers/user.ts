import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';
import { minioClient, publicBaseUrl, screenshotBucket } from '../utils/minio';

type TSignupRequestBody = {
	name: string;
	email: string;
	password: string;
};

export async function SignupController(
	req: Request<{}, {}, TSignupRequestBody>,
	res: Response
) {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).send({
				message: 'Invalid request',
				success: false,
			});
		}

		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (existingUser) {
			return res.status(400).send({
				message: 'User already exists',
				success: false,
			});
		}

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password,
			},
		});

		res.status(200).send({
			message: 'User created successfully',
			success: true,
			user: user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
}

export async function LoginController(
	req: Request<{}, {}, TSignupRequestBody>,
	res: Response
) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({
				message: 'Invalid request',
				success: false,
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).send({
				message: 'User not found',
				success: false,
			});
		}

		if (user.password !== password) {
			return res.status(400).send({
				message: 'Invalid password',
				success: false,
			});
		}

		res.status(200).send({
			message: 'User logged in successfully',
			success: true,
			user: user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
}

export async function UploadScreenshotController(
	req: Request<{}, {}>,
	res: Response
) {
	try {
		const screenshotFile = req.file;

		if (!screenshotFile) {
			return res.status(400).send({
				message: 'no screenshot file attached',
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

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).send({
				message: 'User not found',
				success: false,
			});
		}

		if (user.password !== password) {
			return res.status(400).send({
				message: 'Invalid password',
				success: false,
			});
		}

		const fileBuffer = screenshotFile.buffer;
		const originalName = screenshotFile.originalname;
		const mimeType = screenshotFile.mimetype;
		let ext = 'png';
		const nameParts = originalName.split('.');
		if (nameParts.length > 1) {
			ext = nameParts[nameParts.length - 1];
		}

		const fileName = `${uuidv4()}.${ext}`;

		await minioClient.putObject(
			screenshotBucket,
			fileName,
			fileBuffer,
			fileBuffer.length,
			{
				'Content-Type': mimeType,
			}
		);

		const screenshot = await prisma.screenshots.create({
			data: {
				filename: fileName,
				publicUrl: `${publicBaseUrl}/${screenshotBucket}/${fileName}`,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		return res.status(200).send({
			message: 'Screenshot uploaded successfully',
			success: true,
			screenshot: screenshot,
		});
	} catch (err: any) {
		console.log(err);
		res.status(500).send({
			message: `Internal Server Error ${err?.message ?? err ?? ''}`,
			success: false,
		});
	}
}

export async function GetScreenshotsController(
	req: Request<{}, {}>,
	res: Response
) {
	try {
		const basicToken = req.headers.authorization?.split(' ')[1];
		if (!basicToken) {
			return res.status(401).send({
				message: 'Unauthorized: Basic token not found',
				success: false,
			});
		}

		const basicTokenDecoded = Buffer.from(basicToken, 'base64').toString(
			'utf-8'
		);
		const [email, password] = basicTokenDecoded.split(':');
		if (!email || !password) {
			return res.status(401).send({
				message: 'Unauthorized: Invalid bearer token format',
				success: false,
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).send({
				message: 'User not found',
				success: false,
			});
		}

		if (user.password !== password) {
			return res.status(400).send({
				message: 'Invalid password',
				success: false,
			});
		}

		const screenshots = await prisma.screenshots.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return res.status(200).send({
			message: 'Screenshots fetched successfully',
			success: true,
			screenshots,
		});
	} catch (err: any) {
		console.log(err);
		res.status(500).send({
			message: `Internal Server Error ${err?.message ?? err ?? ''}`,
			success: false,
		});
	}
}
