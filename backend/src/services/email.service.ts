import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmailService = async (name: string, email: string, subject: string, message: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Kendi mail adresine geliyor
      subject: `Yeni Portfolyo Mesajı: ${subject || 'İletişim Formu'}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #18181b; color: #f4f4f5; border-radius: 12px;">
          <h2 style="color: #fbbf24; margin-top: 0;">Yeni Bir Mesaj Aldın!</h2>
          <p><strong>Gönderen:</strong> ${name} (<a href="mailto:${email}" style="color: #60a5fa;">${email}</a>)</p>
          <p><strong>Konu:</strong> ${subject || 'Belirtilmemiş'}</p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 20px 0;" />
          <p style="background: #27272a; padding: 15px; border-radius: 8px; color: #e4e4e7; line-height: 1.6;">${message}</p>
          <p style="font-size: 12px; color: #a1a1aa; margin-top: 20px;">Bu mesaj portfolyo siten üzerinden otomatik olarak gönderilmiştir.</p>
        </div>
      `,
    });
    console.log('E-posta başarıyla gönderildi:', info.messageId);
  } catch (error) {
    console.error('E-posta gönderilirken hata oluştu:', error);
  }
};