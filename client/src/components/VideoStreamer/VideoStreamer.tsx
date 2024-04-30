import { useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ProductContext } from '../../contexts/ProductContext';
import { ProductContextType } from '../../v-mirror.interfaces';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL =
	process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';

export const socket = io(BASE_URL, { autoConnect: false });

export default function VideoStreamer() {
	const navigate = useNavigate();
	const {
		selectedPant,
		selectedShirt,
		selectedSpec,
		shirts,
		pants,
	}: ProductContextType = useContext(ProductContext);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [jpegImageFrame, setJpegImageFrame] = useState('');
	const [stream, setStream] = useState<MediaStream | null>(null);

	const videoElemRef = useRef<HTMLVideoElement>(null);

	function streamVideoToServer() {
		if (!videoElemRef.current) {
			return;
		}

		const video = videoElemRef.current;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext('2d');
		if (!context) {
			return;
		}

		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		const data = canvas.toDataURL(imageType);

		// console.log(data);

		const base64Image = data.split(',')[1];
		// console.log(base64Image);
		const shirtno = shirts.indexOf(selectedShirt) + 1;
		const pantno = pants.indexOf(selectedPant) + 1;

		if (socket.connected) {
			// socket.emit('videoFrameRaw', "TESTRAW");
			socket.emit('videoFrameRaw', base64Image, shirtno, pantno);
		}
	}

	async function startStreaming() {
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('videoFrameProcessed', onVideoFrameProcessed);

		socket.connect();

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			});

			const video = document.querySelector('video');
			if (video) {
				video.srcObject = stream;
			}

			setInterval(() => {
				streamVideoToServer();
			}, 100);

			setStream(stream);
		} catch (err) {
			console.log(err);
		}
	}

	function onConnect() {
		setIsConnected(true);
		console.log('Connected');
	}

	function onDisconnect() {
		console.log('Disconnected');
		setIsConnected(false);
	}

	function onVideoFrameProcessed(data: any) {
		// console.log('videoFrameRaw', data);

		// console.log('videoFrameProcessed', data);

		setJpegImageFrame(data);
	}

	function stopStreaming() {
		socket.disconnect();
		socket.off('connect', onConnect);
		socket.off('videoFrameProcessed', onVideoFrameProcessed);

		stream?.getTracks().forEach((track) => {
			track.stop();
		});
	}

	useEffect(() => {
		startStreaming();
		return () => {
			socket.off('connect', onConnect);
			socket.disconnect();
			socket.off('videoFrameProcessed', onVideoFrameProcessed);
		};
	}, []);

	return (
		<div
			style={{
				padding: '1rem',
			}}
		>
			{/* <button onClick={startStreaming}>Start</button>
      <button onClick={stopStreaming}>Stop</button> */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<button
					className='try_on_button'
					onClick={() => {
						stopStreaming();
						navigate('/');
					}}
				>
					View Items
				</button>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					gap: '8rem',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '1rem',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingTop: '1rem',
							height: '200px',
						}}
					>
						<div>
							<img
								src={selectedShirt.image}
								style={{
									height: '200px',
								}}
								alt='Shirt'
							/>
						</div>
						<div>
							<img
								src={selectedPant.image}
								style={{
									height: '200px',
								}}
								alt='Pant'
							/>
						</div>
						{/* <div>
              <img
                src={selectedSpec.image}
                style={{
                  height: "200px",
                }}
                alt="Spec"
              />
            </div> */}
					</div>
					<div>
						<video
							ref={videoElemRef}
							autoPlay
							muted
							style={{
								height: '400px',
								borderRadius: '20px',
								border: '3px solid #742e1f',
							}}
						></video>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '2rem',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							fontFamily: "'Courier New', monospace",
							fontSize: '30px',
							fontWeight: '900',
						}}
					>
						Your Try-On
					</div>
					<div>
						<img
							alt=''
							style={{
								borderRadius: '20px',
								minHeight: '400px',
								minWidth: '600px',
								border: '3px solid #742e1f',
							}}
							src={`data:${imageType};base64,${jpegImageFrame}`}
						/>
					</div>

					<div>
						<button className='try_on_button' onClick={() => {
              uploadScreenshot(jpegImageFrame);
            }}>
							Take Screenshot
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

async function uploadScreenshot(base64Image: string) {
	try {
		const byteString = atob(base64Image);
		const ia = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i++)
			ia[i] = byteString.charCodeAt(i);

		const fileBlob = new Blob([ia], { type: imageType });
		const formData = new FormData();

		formData.append('screenshot', fileBlob, 'screenshot.jpg');

    // TODO: take from localStorage
    const userName = '1@gmail.com';
    const password = 'password'

    const basicToken = btoa(`${userName}:${password}`);
		const response = await axios.post(
			`${BASE_URL}/user/screenshot`,
			formData,
			{
				headers: {
          'Authorization': `Basic ${basicToken}`,
					'Content-Type': 'multipart/form-data',
				},
			}
		);

		console.log(response);
		if (response.status === 200) {
			alert('Screenshot saved successfully');
		}

	} catch (err) {
		console.log(err);
		alert('Failed to upload screenshot');
	}
}

const imageType = 'image/jpeg';
