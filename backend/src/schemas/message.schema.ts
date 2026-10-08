import { z } from 'zod';

export const createMessageSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Ad alanı zorunludur.' }).min(2),
    email: z.string({ required_error: 'Email zorunludur.' }).email('Geçerli bir email giriniz.'),
    subject: z.string({ required_error: 'Konu zorunludur.' }).min(3),
    message: z.string({ required_error: 'Mesaj zorunludur.' }).min(10),
  }),
});