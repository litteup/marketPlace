import { ApiProperty } from '@nestjs/swagger';

export class SingleUploadResponseDto {
  @ApiProperty({
    description: 'URL of the uploaded file',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  url: string;
}

export class MultipleUploadResponseDto {
  @ApiProperty({
    description: 'URLs of the uploaded files',
    example: [
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample2.jpg',
    ],
  })
  urls: string[];
}

export class ErrorResponseDto {
  @ApiProperty({ example: 'File upload failed' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
