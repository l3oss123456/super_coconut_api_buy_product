import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      let message_validator = '';

      if (errors[0].children[0] instanceof ValidationError) {
        const errors = [];
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const data = object[key];
            if (typeof data === 'object') {
              for (const data2 of data) {
                const errors = await validate(data2);
                if (errors.length > 0) {
                  message_validator =
                    errors[0].constraints[
                      Object.keys(errors[0].constraints)[0]
                    ];
                  break;
                }
              }
            }
          }
          if (errors.length > 0) {
            break;
          }
        }
      } else {
        message_validator =
          errors[0].constraints[Object.keys(errors[0].constraints)[0]];
      }

      let error_code = null;
      let error_description = null;

      const matched = message_validator.match(/^\[(\d+)](.*)/);
      if (matched) {
        error_code = Number(matched[1]);
        error_description = matched[2].trim();
      } else {
        error_description = message_validator.trim();
      }
      // const errorResponse = {
      //   code: error_code,
      //   description: error_description,
      // };
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: {
          code: error_code,
          description: error_description,
        },
      });
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
