import nodemailer from 'nodemailer';

/*
  KULLANIM:
  1) sendEmail(email, code, 'verification');
  2) sendEmail(email, code, 'reset');
*/

const sendEmail = async (userEmail, code, type) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });

  let subject;
  let htmlContent;

  if (type === 'verification') {
    subject = 'E-posta Adresinizi Doğrulayın.';
    htmlContent = `
      <h3>E-comMERNce sitesinde üyeliğinizi tamamlamak için e-posta adresinizi doğrulayın.</h3>
      <h4>E-posta adresinizi doğrulamak için onay kodunuz:</h4>
      <h2>${code}</h2>
      <p><i>Bu bağlantı 10 dakika içerisinde geçersiz olacaktır.</i></p>
    `;
  } else if (type === 'reset') {
    subject = 'Şifrenizi Sıfırlayın.';
    htmlContent = `
      <h3>E-comMERNce hesabınız için şifrenizi sıfırlayın</h3>
      <h4>Şifrenizi sıfırlamanız için gerekli onay kodu:</h4>
      <h2>${code}</h2>
      <p><i>Bu bağlantı 10 dakika içerisinde geçersiz olacaktır.</i></p>
    `;
  } else {
    throw new Error('Geçersiz e-posta türü.');
  }

  await transporter.sendMail({
    from: '"e-comMERNce" <yourapp@example.com>',
    to: userEmail,
    subject: subject,
    html: htmlContent,
  });

  console.log(`E-posta ${userEmail} adresine gönderildi.`);
};

export default sendEmail;
