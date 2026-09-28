import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email alanı zorunludur.' })
      .email('Geçerli bir email adresi giriniz.'),
    password: z
      .string({ message: 'Şifre alanı zorunludur.' })
      .min(6, 'Şifre en az 6 karakter olmalıdır.'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];