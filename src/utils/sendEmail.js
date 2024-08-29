import nodemailer from 'nodemailer';
import env from './env.js';

const transport = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT')),
  secure: false,
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

const sendEmail = options => transport.sendMail(options);

export default sendEmail;
