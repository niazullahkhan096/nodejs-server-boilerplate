import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashToken = async (token: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(token, saltRounds);
};

export const compareToken = async (token: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};

export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateJti = (): string => {
  return crypto.randomUUID();
};
