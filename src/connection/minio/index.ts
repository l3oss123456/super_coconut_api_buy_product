import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

const configService = new ConfigService();
const minioEndpoint = configService.get('MINIO_ENDPOINT');
const minioPort = +configService.get('MINIO_PORT');
const minioAccessKey = configService.get('MINIO_ACCESSKEY');
const minioSecretKey = configService.get('MINIO_SECRETKEY');
const minioBucket = configService.get('MINIO_BUCKET');

const minioClient = new Client({
  // endPoint: minioEndpoint,
  endPoint:
    process.env.ENPOINT_TYPE.toUpperCase() === 'PROD'
      ? 'docker55812-env-6472455-clone419867.th1.proen.cloud'
      : minioEndpoint,
  port: minioPort,
  useSSL: false,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
});

export default {
  client: minioClient,
  bucket: minioBucket,
};

const checkConnection = async () => {
  try {
    await minioClient.bucketExists(minioBucket);
    console.log({
      status: 'success',
      message: 'Minio connection is OK!',
    });
  } catch (error) {
    console.log({
      status: 'error',
      message: 'Failed to connect to Minio',
      error: error,
    });
  }
};

checkConnection();
