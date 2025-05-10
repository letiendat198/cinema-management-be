import nodemailer from 'nodemailer';

// Cấu hình Nodemailer (sử dụng Ethereal để test, thay thế bằng SMTP thật nếu cần)
const sendEmail = async (options) => {
  // Tạo một transporter test với Ethereal
  let transporter;
  if (process.env.NODE_ENV === 'test_ethereal') { // Ví dụ dùng biến môi trường để chọn transporter
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: (process.env.EMAIL_SECURE === 'true'), 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }


  const mailOptions = {              
    from: process.env.EMAIL_FROM || '"Cinema XYZ" <noreply@cinemaxyz.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Preview URL for Ethereal emails
    if (process.env.NODE_ENV === 'test_ethereal') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;
