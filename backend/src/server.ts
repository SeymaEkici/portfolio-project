import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Veritabanı bağlantısını doğrula
    await prisma.$connect();
    console.log('✅ PostgreSQL Veritabanı bağlantısı başarılı.');

    app.listen(PORT, () => {
      console.log(`🚀 Server http://localhost:${PORT} adresinde aktif.`);
    });
  } catch (error) {
    console.error('❌ Sunucu başlatılamadı:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();