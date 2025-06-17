import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Logger } from '@b-accel-logger/logger.service';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private logger: Logger) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async enviarCorreo(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: '"Tu Nombre" <contacto@ius-copilot.com>',
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Correo enviado: %s', info.messageId);
    } catch (error) {
      this.logger.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
