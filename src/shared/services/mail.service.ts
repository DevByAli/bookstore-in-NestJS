import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';
import { resolve } from 'node:path';
import { createTransport, TransportOptions } from 'nodemailer';
import { MailOptions } from '../types/mailOption.type';

@Injectable()
export class MailService {
  async sendMail(options: MailOptions) {
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      service: process.env.SMTP_SERVICE as any,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    } as TransportOptions);

    const { email, subject, template, data } = options;

    // get the path to the mail template file
    const templatePath = resolve('./src/templates') + `/${template}`;

    // render the email template with EJS
    const html = await renderFile(templatePath, { data: data });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  }
}
