import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 
import { UnauthorizedFilter } from './filters/unauthorized.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new UnauthorizedFilter()); 
  // Configura el ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
      transform: true, // Transforma los datos automáticamente (por ejemplo, strings a números)
    }),
  );
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Usuarios')
    .setDescription('API para el registro y autenticación de usuarios')
    .setVersion('1.0')
    .addTag('users') // Etiqueta para agrupar los endpoints de usuarios
    .addBearerAuth( // Agrega el esquema de autenticación JWT
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth', // Nombre del esquema de seguridad
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // La documentación estará en http://localhost:3000/api
  
  await app.listen(3000);
}
bootstrap();