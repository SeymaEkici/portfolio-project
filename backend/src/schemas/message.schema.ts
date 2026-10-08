import { z } from 'zod';

export const createMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Ad alanı en az 2 karakter olmalıdır.'),
    email: z.string().min(1, 'Email zorunludur.').email('Geçerli bir email giriniz.'),
    subject: z.string().min(3, 'Konu en az 3 karakter olmalıdır.'),
    message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır.'),
  }),
});