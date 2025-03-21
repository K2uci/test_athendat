import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'juan@example.com',
    description: 'El correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({
    example: 'password123',
    description: 'La contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}