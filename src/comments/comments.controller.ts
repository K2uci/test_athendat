import { Controller, Post, Body, UseGuards, Get, Res, UnauthorizedException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/schemas/users.schema';
import { Response } from 'express';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Operaciones - Comentarios')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) { }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Agregar un comentario' }) // Descripción del endpoint
  @ApiResponse({ status: 201, description: 'Comentario agregado exitosamente' }) // Respuesta exitosa
  @ApiResponse({ status: 401, description: 'Acceso denegado. Debes iniciar sesión para realizar esta acción.' }) // Respuesta de error
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          example: 'Este es un comentario de prueba',
          description: 'El texto del comentario',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt')) // Protege el endpoint con JWT
  async addComment(
    @GetUser() user: User, // Obtiene el usuario autenticado
    @Body('text') text: string,
  ) {
    const comment = await this.commentsService.addComment(user.email, text);
    return { message: 'Comentario agregado', comment };
  }

  @Get('download')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Descargar un archivo con todos los comentarios' }) // Descripción del endpoint
  @ApiResponse({
    status: 200,
    description: 'Archivo descargado exitosamente',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }) // Respuesta exitosa (archivo descargado)
  @ApiResponse({ status: 401, description: 'Acceso denegado. Debes iniciar sesión para realizar esta acción.' })
  @UseGuards(AuthGuard('jwt')) // Protege el endpoint con JWT
  async downloadFile(@Res() res: Response) {
    const filePath = await this.commentsService.generateFile();
    res.download(filePath, 'comments.txt', (err) => {
      if (err) {
        throw new UnauthorizedException('Error al descargar el archivo');
      }
      fs.unlinkSync(filePath); // Elimina el archivo después de la descarga
    });
  }
}