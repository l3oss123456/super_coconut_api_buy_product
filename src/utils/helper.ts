import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deepParseJson } from 'deep-parse-json';
import * as R from 'ramda';
import * as sharp from 'sharp';
import * as stream from 'stream';
import { v4 as uuidv4 } from 'uuid';
import Minio from '../connection/minio';

type FileType = '' | 'img' | 'doc';

const ToConvertMongooseSortOrder = ({
  sort_field = [],
  sort_order = [],
}: {
  sort_field: string[];
  sort_order: number[];
  database_type?: string;
}) => {
  sort_field = typeof sort_field == `string` ? [sort_field] : sort_field;
  sort_order = typeof sort_order == `string` ? [sort_order] : sort_order;

  // let order_sequence = [['created_at', 'DESC']];
  let order_sequence = {};

  if (R.isNil(sort_field) && R.isNil(sort_order)) {
    return order_sequence;
  }
  if (R.isEmpty(sort_field) || R.isEmpty(sort_order)) {
    return order_sequence;
  } else {
    if (typeof sort_field === 'string' && typeof sort_order === 'string') {
      order_sequence = {
        ...order_sequence,
        [sort_field]: Number(sort_order),
      };
    }
    if (
      (typeof sort_field === 'string' && typeof sort_order !== 'string') ||
      (typeof sort_field !== 'string' && typeof sort_order === 'string') ||
      (R.isNil(sort_field) && !R.isNil(sort_order)) ||
      (!R.isNil(sort_field) && R.isNil(sort_order))
    ) {
      return [];
    } else {
      if (sort_field.length === sort_order.length) {
        sort_order.forEach((order, index) => {
          order_sequence = {
            ...order_sequence,
            [sort_field[index]]: Number(order),
          };
        });

        return { ...order_sequence };
      } else {
        return {};
      }
    }
  }
};
const ToConvertDataTypeFormData = (dto: any, form_data: object) => {
  const _dto = new dto();
  form_data = deepParseJson(form_data);
  Object.keys(form_data).forEach((key) => {
    const data_type = Reflect.getMetadata('design:type', dto.prototype, key);

    if (R.isEmpty(form_data[key])) {
      form_data = R.omit([`${key}`], form_data);
    } else {
      if (R.isNil(form_data[key])) {
        _dto[key] = null;
      } else if (data_type === Number) {
        _dto[key] = Number(form_data[key]);
      } else if (data_type === Array) {
        if (typeof form_data[key] === 'string') {
          const str = JSON.stringify(form_data[key]);
          const obj = JSON.parse(str);
          const regex = /{[^}]+}/g;
          const array = obj.match(regex);
          const object = [];
          if (!R.isNil(array)) {
            for (let i = 0; i < array.length; i++) {
              const permObj = JSON.parse(array[i]);
              object.push(permObj);
            }
            _dto[key] = object;
          } else {
            _dto[key] = obj.split(',');
          }
        } else {
          _dto[key] = form_data[key];
        }
      } else {
        if (data_type === Number) {
          _dto[key] = Number(form_data[key]);
        } else {
          _dto[key] = form_data[key];
        }
      }
    }

    // if (R.isNil(form_data[key]) || R.isEmpty(form_data[key])) {
    //   form_data = R.omit([`${key}`], form_data);
    // } else {
    //   if (form_data[key] === `-`) {
    //     form_data[key] = '';
    //   }

    //   if (data_type === Number) {
    //     _dto[key] = Number(form_data[key]);
    //   } else if (data_type === Array) {
    //     if (typeof form_data[key] === 'string') {
    //       const str = JSON.stringify(form_data[key]);
    //       const obj = JSON.parse(str);
    //       const regex = /{[^}]+}/g;
    //       const array = obj.match(regex);
    //       const object = [];
    //       if (!R.isNil(array)) {
    //         for (let i = 0; i < array.length; i++) {
    //           const permObj = JSON.parse(array[i]);
    //           object.push(permObj);
    //         }
    //         _dto[key] = object;
    //       } else {
    //         _dto[key] = obj.split(',');
    //       }
    //     } else {
    //       _dto[key] = form_data[key];
    //     }
    //   } else {
    //     if (data_type === Number) {
    //       _dto[key] = Number(form_data[key]);
    //     } else {
    //       _dto[key] = form_data[key];
    //     }
    //   }
    // }
  });

  return _dto;
};
function ToCronJobScheduleFromHourAndMinute({ time = null }: { time: string }) {
  let cronSchedule = null;
  if (!R.isNil(time)) {
    // const [hours, minutes] = time.split(':');
    const [hours, minutes] = time
      .split(':')
      .map((part) => parseInt(part, 10).toString());

    if (process.env.SERVER_TYPE === 'laos') {
      cronSchedule = `${minutes} ${hours} * * 1,4`;
    } else if (process.env.SERVER_TYPE === 'hanoi') {
      cronSchedule = `${minutes} ${hours} * * *`;
    } else if (process.env.SERVER_TYPE === 'eng') {
      cronSchedule = `${minutes} ${hours} * * *`;
    }
  }
  return cronSchedule;
}
const MinioGetFile = async ({ path = '' }: { path: string }) => {
  const configService = new ConfigService();
  const minioEndpoint = configService.get('MINIO_ENDPOINT');
  const minioBucket = configService.get('MINIO_BUCKET');

  return minioEndpoint + '/' + minioBucket + '/' + path;
};
const MinioUploadFile = async ({
  file = null,
  file_type = '',
  allow_file_type_add_on = [],
}: {
  file: any;
  file_type?: FileType;
  allow_file_type_add_on?: string[];
}) => {
  if (!file) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        code: 5100,
        description: 'File is missing.',
      },
    });
  }

  if (file.size > 1024 * 1024 * 10) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        code: 5101,
        description: 'File size is too large.',
      },
    });
  }

  const check = await checkMimeType({
    file: file,
    type: file_type,
    allow_file_type_add_on: allow_file_type_add_on,
  });

  if (!check) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        code: 5102,
        description: 'File type is not allowed.',
      },
    });
  }

  const isHeifOrHeic =
    file.mimetype === 'image/heif' || file.mimetype === 'image/heic';

  let bufferStream;
  if (isHeifOrHeic) {
    try {
      const imageBuffer = await sharp(file.buffer).jpeg().toBuffer();
      bufferStream = new stream.PassThrough();
      bufferStream.end(imageBuffer);
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการแปลง HEIF เป็น JPG:', err);
    }
  } else {
    bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
  }

  const extension = file.originalname.match(/\.([^.]+)$/)[1];
  const filename: any = uuidv4() + `.${extension}`;

  try {
    const response = await Minio.client.putObject(
      Minio.bucket,
      filename,
      bufferStream,
      file.size,
      {
        'Content-Type':
          file.mimetype === `text/plain`
            ? `${file.mimetype}; charset=utf-8`
            : file.mimetype,
      },
    );

    return {
      result: 'ok',
      description: 'Uploads file successfully',
      file: response,
      path: filename,
    };
  } catch (error) {
    console.log('errorerror', error);
    return {
      result: 'fail',
      description: 'Uploads file failed',
      error: error,
    };
  }
};
const MinioUpdateFile = async ({
  path = '',
  file = null,
  file_type = '',
  allow_file_type_add_on = [],
}: {
  path: string;
  file: any;
  file_type: FileType;
  allow_file_type_add_on: string[];
}) => {
  if (!file) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        code: 5100,
        description: 'File is missing.',
      },
    });
  }

  if (file.size > 1024 * 1024 * 10) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        code: 5101,
        description: 'File size is too large.',
      },
    });
  }

  const check = await checkMimeType({
    file,
    type: file_type,
    allow_file_type_add_on,
  });
  if (!check) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        code: 5102,
        description: 'File type is not allowed.',
      },
    });
  }

  const isHeifOrHeic =
    file.mimetype === 'image/heif' || file.mimetype === 'image/heic';

  let bufferStream;
  if (isHeifOrHeic) {
    try {
      const imageBuffer = await sharp(file.buffer).jpeg().toBuffer();
      bufferStream = new stream.PassThrough();
      bufferStream.end(imageBuffer);
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการแปลง HEIF เป็น JPG:', err);
    }
  } else {
    bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
  }

  try {
    const response = await Minio.client.putObject(
      Minio.bucket,
      path,
      bufferStream,
      file.size,
      {
        // 'Content-Type': file.mimetype,
        'Content-Type':
          file.mimetype === `text/plain`
            ? `${file.mimetype}; charset=utf-8`
            : file.mimetype,
      },
    );

    return {
      result: 'ok',
      description: 'Update file successfully',
      file: response,
      path: path,
    };
  } catch (error) {
    return {
      result: 'fail',
      description: 'Update file failed',
      error: error,
      path: path,
    };
  }
};
const MinioDeleteAndUploadFile = async ({
  path = '',
  file = null,
  file_type = '',
  allow_file_type_add_on = [],
}: {
  path: string;
  file: any;
  file_type?: FileType;
  allow_file_type_add_on?: string[];
}) => {
  await MinioDeleteFile({ path: path });
  return await MinioUploadFile({ file, file_type, allow_file_type_add_on });
};

const MinioDeleteFile = async ({ path = '' }: { path: string }) => {
  try {
    await Minio.client.removeObject(Minio.bucket, path);

    return {
      result: 'ok',
      description: 'Delete file successfully',
      path: path,
    };
  } catch (error) {
    return {
      result: 'fail',
      description: 'Delete file failed',
      error: error,
      path: path,
    };
  }
};

const checkMimeType = async ({
  file = null,
  type = '',
  allow_file_type_add_on = [],
}: {
  file: any;
  type: FileType;
  allow_file_type_add_on: string[];
}) => {
  const mimeType = file.mimetype;
  const mimeImg = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/heic',
    'image/heif',
  ];
  const mimeDoc = [
    'text/plain',
    'text/html',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  let mimeCheck: string[];
  if (type == 'img') {
    mimeCheck = [...mimeImg];
  } else if (type == 'doc') {
    mimeCheck = [...mimeDoc];
  } else {
    mimeCheck = [...mimeImg, ...mimeDoc];
  }

  if (!R.isEmpty(allow_file_type_add_on)) {
    allow_file_type_add_on.forEach((file_type) => {
      if (file_type === `pdf`) {
        mimeCheck.push(`application/pdf`);
      }
    });
  }

  if (!mimeCheck.includes(mimeType)) {
    return false;
  }
  return true;
};

export default {
  ToConvertMongooseSortOrder,
  ToConvertDataTypeFormData,
  ToCronJobScheduleFromHourAndMinute,
  checkMimeType,
  MinioGetFile,
  MinioUploadFile,
  MinioDeleteAndUploadFile,
  MinioDeleteFile,
};
