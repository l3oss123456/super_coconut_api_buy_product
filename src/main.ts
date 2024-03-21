import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/module/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api`);
  app.enableCors();
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new GeneralErrorFilter());
  // app.useGlobalFilters(new SequelizeUniqueConstraintErrorFilter());
  // app.use(requestIp.mw());

  const config = new DocumentBuilder()
    .setTitle('Api Swagger')
    .setDescription('All api description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
