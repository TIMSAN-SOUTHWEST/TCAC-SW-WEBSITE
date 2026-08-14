import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // For production with cloud storage (like Vercel Blob, S3, etc.)
    // you'd integrate here. For now, save locally.
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, file.buffer);

    const baseUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:4000';

    return {
      url: `${baseUrl}/uploads/${uniqueName}`,
      pathname: uniqueName,
      size: file.size,
    };
  }
}
