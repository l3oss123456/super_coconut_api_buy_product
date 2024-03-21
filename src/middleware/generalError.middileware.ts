import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch(Error)
export class GeneralErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      console.log(error);
      if (error instanceof NotFoundException) {
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          code: '4004',
          description: 'Page not found: ไม่พบหน้าที่ท่านต้องการ',
        });
      } else if (error instanceof UnauthorizedException) {
        const errorReponse = error.getResponse();
        console.log('here');
        console.log('error', error.getResponse());
        response.status(errorReponse['statusCode']).json({
          statusCode: errorReponse['statusCode'],
          code: errorReponse['message']['code'],
          description: errorReponse['message']['description'],
        });
      } else if (error instanceof ForbiddenException) {
        const errorReponse = error.getResponse();
        response.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          code: errorReponse['code'] || '4105',
          description:
            errorReponse['description'] || `Forbidden: การเข้าถึงถูกปฏิเสธ`,
        });
      } else if (error instanceof BadRequestException) {
        const errorReponse = error.getResponse();

        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          code: errorReponse['message']['code'] || HttpStatus.BAD_REQUEST,
          description: errorReponse['message']['description'] || `Bad Request`,
        });
      } else if (error instanceof ConflictException) {
        const errorReponse = error.getResponse();

        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          code: errorReponse['message']['code'] || HttpStatus.CONFLICT,
          message: errorReponse['message']['description'] || `Conflict`,
        });
      } else if (error instanceof InternalServerErrorException) {
        const errorReponse = error.getResponse();

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code:
            errorReponse['message']['code'] || HttpStatus.INTERNAL_SERVER_ERROR,
          description:
            errorReponse['message']['description'] || `Internal Server Error`,
        });
      } else {
        // response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        //   statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        //   code: '5000',
        //   description: error.message,
        // });
      }
    } catch (error) {
      console.log(`error GeneralErrorFilter: `, error);
    }
  }
}
