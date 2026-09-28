import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { LoginInput } from '../schemas/auth.schema.js';
import { AppError } from '../utils/appError.js';
import { signToken } from '../utils/jwt.js';

export const loginAdminService = async (input: LoginInput) => {
  // 1. Kullanıcı var mı kontrol et
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError('Geçersiz email veya şifre.', 401);
  }

  // 2. Şifreyi doğrula
  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Geçersiz email veya şifre.', 401);
  }

  // 3. JWT Token üret
  const token = signToken({ userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};