import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

export const signToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.verify(token, secret) as TokenPayload;
};