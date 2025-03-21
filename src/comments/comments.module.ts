import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentSchema } from './schemas/comment.schema';
import { AuthModule } from '../auth/auth.module'; // Importa el AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    AuthModule, // Importa el AuthModule para usar el JWT
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
