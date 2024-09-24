import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.SMTP_EMAIL_USER}`,
      pass: `${process.env.SMTP_EMAIL_PASSWORD}`,
    },
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, '../mails', template);

  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: `${process.env.APP_NAME} <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
