import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
    });

    try {
      // Guardar el usuario en la base de datos
      await user.save();
      return user;
    } catch (error) {
      // Manejar errores de duplicidad (correo ya registrado)
      if (error.code === 11000) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      // Manejar otros errores
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}