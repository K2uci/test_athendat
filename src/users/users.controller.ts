import { Controller, Post, Body, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Registro') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @ApiOperation({ summary: 'Registrar un nuevo usuario' }) // Descripción del endpoint
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' }) // Respuesta exitosa
  @ApiResponse({ status: 400, description: 'Datos inválidos' }) // Respuesta de error
  @ApiResponse({ status: 409, description: 'El correo electrónico ya está registrado' }) // Respuesta de error
  @ApiBody({ type: CreateUserDto }) // Especifica el tipo de cuerpo esperado
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { message: 'Usuario registrado exitosamente', user };
    } catch (error) {
      // Capturar errores específicos y devolver respuestas adecuadas
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      // Capturar errores inesperados
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}