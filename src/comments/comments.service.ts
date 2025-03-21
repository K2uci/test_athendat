import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<Comment>,
  ) {}

  async addComment(user: string, text: string): Promise<Comment> {
    const newComment = new this.commentModel({ text, user });
    return newComment.save();
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async generateFile(): Promise<string> {
    const comments = await this.getAllComments();
    const fileContent = comments
      .map((comment) => `El usuario ${comment.user} comentó esto: " ${comment.text} " -- En la fecha ${comment.date}`)
      .join('\n');

    const filePath = path.join(__dirname, '..', 'comments.txt');
    fs.writeFileSync(filePath, fileContent);

    return filePath;
  }
}