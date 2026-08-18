import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{
    url: string;
    secureUrl: string;
    publicId: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Determine folder based on file type
    const isImage = file.mimetype.startsWith('image/');
    const folder = isImage ? 'tcac-2026/images' : 'tcac-2026/documents';

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: 'auto',
              transformation: isImage
                ? [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }]
                : undefined,
            },
            (error, result) => {
              if (error || !result) reject(error || new Error('Upload failed'));
              else resolve(result);
            },
          )
          .end(file.buffer);
      });

      return {
        url: result.secure_url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
      };
    } catch {
      throw new BadRequestException('Failed to upload file. Please try again.');
    }
  }
}
