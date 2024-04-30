import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

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
