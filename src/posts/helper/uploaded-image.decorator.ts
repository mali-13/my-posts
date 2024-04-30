import { HttpStatus, ParseFilePipeBuilder, UploadedFile } from '@nestjs/common';

export const UploadedImage = () =>
  UploadedFile(
    'file',
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'jpeg|png|bmp', // accepted file formats
      })
      .addMaxSizeValidator({
        maxSize: 104857600, // 100 MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
  );
