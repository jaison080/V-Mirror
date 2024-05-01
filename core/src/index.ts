import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as socketIoClient } from 'socket.io-client';
import { sessionMap } from './utils/sessionMap';
import cors from 'cors';
import { userRouter } from './routes/user';
import { minioClient, region, screenshotBucket } from './utils/minio';

dotenv.config();

const app: Express = express();
const server = createServer(app);
const socketIoServer = new Server(server, {
	cors: {
		origin: '*',
		methods: '*',
	},
	connectTimeout: 3000,
});

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://streamer:5000';
export const streamerSocket = socketIoClient(URL, { autoConnect: true });

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

streamerSocket.on('connect', () => {
	console.log(`[socket]: SERVER Connected to STREAMER`);
});

streamerSocket.on('disconnect', () => {
	console.log(`[socket]: SERVER Disconnected from STREAMER`);
});

streamerSocket.on(
	'videoFrameProcessed',
	(base64Image: string, sessionId: string) => {
		const socket = sessionMap.get(sessionId);
		if (socket) {
			// console.log(`[socket]: SERVER sending video frame to client ${sessionId}`);
			socket.emit('videoFrameProcessed', base64Image);
		} else {
			// console.log(`[socket]: SERVER could not find client ${sessionId}`);
		}
	}
);

streamerSocket.on('PONG', (sessionId: string) => {
	const socket = sessionMap.get(sessionId);
	if (socket) {
		console.log(`[socket]: Recieved PONG from ${sessionId} at Core Server`);
		socket.emit('PONG');
	} else {
		// console.log(`[socket]: SERVER could not find client ${sessionId}`);
	}
});

socketIoServer.on('connection', (socket) => {
	const sessionId = socket.id;
	console.log(`[socket]: ${sessionId} connected`);
	sessionMap.set(sessionId, socket);

	socket.on('disconnect', () => {
		console.log(`[socket]: ${sessionId} disconnected`);
		sessionMap.delete(sessionId);
	});

	socket.on(
		'videoFrameRaw',
		(
			base64Image: string,
			shirtno: number,
			pantno: number,
			specNo: number,
			isShirtSelected: boolean = true,
			isPantSelected: boolean = true,
			isSpecSelected: boolean = true,
		) => {
			streamerSocket.emit(
				'videoFrameRaw',
				base64Image,
				shirtno,
				pantno,
				specNo,
				isShirtSelected,
				isPantSelected,
				isSpecSelected,
				sessionId
			);
		}
	);

	socket.on('PING', () => {
		console.log(`[socket]: ${sessionId} PING Reciever at Core Server`);
		streamerSocket.emit('PING', sessionId);
	});
});

app.get('/', (req: Request, res: Response) => {
	res.send('V-Mirror Server is running!');
});

app.use('/user', userRouter);

server.listen(port, async () => {
	const exists = await minioClient.bucketExists(screenshotBucket);
	if (exists) {
		console.log('Bucket ' + screenshotBucket + ' exists.');
	} else {
		await minioClient.makeBucket(screenshotBucket, region);
		await minioClient.setBucketPolicy(
			screenshotBucket,
			JSON.stringify(publicReadPolicy)
		);
		console.log(`Bucket ${screenshotBucket} created successfully.`);
	}
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

const publicReadPolicy = {
	Version: '2012-10-17',
	Statement: [
		{
			Effect: 'Allow',
			Principal: '*',
			Action: 's3:GetObject',
			Resource: `arn:aws:s3:::${screenshotBucket}/*`,
		},
	],
};
