import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  Res,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';
import { ArchivoService } from './archivo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Response } from 'express';
@ApiTags(SERVICE_NAME)
@Controller('api/archivo')
//@UseGuards(JwtAuthGuard)
export class ArchivoController {
  constructor(private readonly archivoService: ArchivoService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Req() request: Request) {
    const { userId } = (<any>request).user;
    return await this.archivoService.uploadedFile(file, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFileByUserId(@Req() request: any) {
    const { userId } = request.user;
    return await this.archivoService.getFileByUserId(userId);
  }

  @Get('download/:id')
  //@UseGuards(JwtAuthGuard)
  async downloadFile(
    @Res() res: Response,
    @Param('id', new ParseIntPipe()) idArchivo: number,
  ) {
    //const { userId } = request.user;
    await this.archivoService.downloadFile(res, idArchivo);
  }
}
