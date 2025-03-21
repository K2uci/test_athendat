import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'juan@example.com',
    description: 'El correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'El email no debe estar vacio' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'La contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'El nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario no debe estar vacio' })
  name: string;
}