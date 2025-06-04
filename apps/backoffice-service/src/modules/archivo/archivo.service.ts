import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';
import { AWSS3BucketService } from '../aws-s3-bucket/aws-s3-bucket.service';
import { v4 as uuid } from 'uuid';
import { Archivo } from '../../database/entities/userV2/archivo.entity';
import { UserV2 } from '../../database/entities/userV2/user.entity';
import { ArchivoDBService } from '../db-module/archivo.service';
import { UsersDBService } from '../db-module/users.service';
import { Response } from 'express';
import { createHash } from 'crypto';

@Injectable()
export class ArchivoService {
  constructor(
    private httpService: HttpService,
    private logger: Logger,
    private readonly awsS3BucketService: AWSS3BucketService,
    private readonly archivoDBService: ArchivoDBService,
    private readonly usersDBService: UsersDBService,
  ) {}
  async uploadedFile(file, userId: string) {
    try {
      this.logger.log(`init function uploadedFile ${file.mimetype}`);
      const agente = await this.getAgenteByUserId(userId);
      const fileBuffer = file.buffer; // Asegúrate de que `file.buffer` contenga el contenido del archivo
      const fileHash = this.computeHash(fileBuffer);
      await this.existsByHashAndAgente(fileHash, agente.id);
      const path = '';
      const fileName = `${uuid()}_${file.originalname}`;
      await this.awsS3BucketService.uploadFile(file, path, fileName);
      const archivo = new Archivo();
      const user = new UserV2();
      user.id = userId;
      archivo.path = path;
      archivo.nombre = fileName;
      archivo.type = file.mimetype;
      archivo.user = user;
      archivo.hash = fileHash;
      return await this.archivoDBService.save(archivo);
    } catch (err) {
      this.logger.error(`error function uploadedFile`, err);
      throw err;
    }
  }

  async existsByHashAndAgente(hash: string, agenteId: string) {
    this.logger.log(
      `init function existsByHashAndAgente hash: ${hash}, agenteId: ${agenteId}`,
    );
    const archivo = await this.archivoDBService.existsByHashAndAgente(
      hash,
      agenteId,
    );

    if (archivo) {
      this.logger.error(
        `Archivo already exists for hash: ${hash} and agenteId: ${agenteId}`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Archivo already exists for this agent',
          id: archivo.id, // Incluye el ID del archivo existente
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAgenteByUserId(userId: string) {
    const agente = (await this.usersDBService.findUserV2ById(userId, true))
      .agente;
    if (!agente) {
      this.logger.error(`User with ID ${userId} does not have an agent`);
      throw new HttpException(
        'User does not have an agent associated',
        HttpStatus.BAD_REQUEST,
      );
    }
    return agente;
  }

  async getFileByUserId(userId: string) {
    try {
      this.logger.log(`init function getFileByUserId ${userId}`);
      const user = await this.usersDBService.findUserV2ById(userId, true);

      return user.archivo;
    } catch (err) {
      this.logger.error(`error function getFileByUserId`, err);
      throw new HttpException(
        'Error retrieving file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadFile(res: Response, idArchivo: number) {
    try {
      this.logger.log(`init function downloadFile  `);
      const archivo = await this.usersDBService.findArchivoById(idArchivo);
      if (archivo) {
        const fileKey = archivo.path + `/` + archivo.nombre;
        this.logger.log('path-->', fileKey);
        const data = await this.awsS3BucketService.downloadFile(fileKey);
        res.setHeader('Content-Type', archivo.type);
        res.setHeader('Content-Length', data.ContentLength.toString()); // Configura el tamaño del archivo
        res.send(data.Body);
      } else {
        throw new NotFoundException(`no existe recurso `);
      }
    } catch (err) {
      this.logger.error(`error function downloadFileGasto`, err);
      throw err;
    }
  }

  computeHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }
}
