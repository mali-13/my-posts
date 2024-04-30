import { registerAs } from '@nestjs/config';

export default registerAs('gcsConfig', () => ({
  projectId: process.env.PROJECT_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  mediaBucket: process.env.STORAGE_MEDIA_BUCKET,
}));
