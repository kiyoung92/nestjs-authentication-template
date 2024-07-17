import { InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getEnv } from 'src/global/config.global';
import { SendEmailParams } from 'src/utils/interfaces/util-email.interface';

export const sendEmail = async ({
  email,
  subject,
  contents,
}: SendEmailParams): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: getEnv<string>('EMAIL_SERVICE'),
    auth: {
      user: getEnv<string>('EMAIL_AUTH_USER'),
      pass: getEnv<string>('EMAIL_AUTH_PASSWORD'),
    },
  });

  try {
    await transporter.sendMail({
      from: getEnv<string>('EMAIL_AUTH_USER'),
      to: email,
      subject: subject,
      html: contents,
    });
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
