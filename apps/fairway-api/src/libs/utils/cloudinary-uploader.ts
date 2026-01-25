import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = (stream: Readable, folder: string, filename: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: folder,
				public_id: filename,
				resource_type: 'image',
				transformation: [
					{ width: 1920, height: 1080, crop: 'limit' },
					{ quality: 'auto:good' },
					{ fetch_format: 'auto' },
				],
			},
			(error, result) => {
				if (error) {
					console.log('Cloudinary error:', error);
					return reject(error);
				}
				resolve(result.secure_url); // Returns HTTPS URL
			},
		);
		stream.pipe(uploadStream);
	});
};
