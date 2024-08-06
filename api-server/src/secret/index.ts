import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function generateToken(userId:number, payload:{id:number,name:string}) :string {
  const secret = loadUserEnv(userId);
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyToken(userId: number, token: string): JwtPayload |  null {
  const secret = loadUserEnv(userId);
  try {
    return jwt.verify(token, secret) as JwtPayload  ;
  } catch (e) {
    return null;
  }
}

export function decodeToken(token: string) :JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (e) {
      return null;
    }
  }

export function loadUserEnv(userId: number):string {
  const envFilePath = path.resolve(__dirname, `.env.user.${userId}`);
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log(process.env.JWT_SECRET_USER)
    return process.env.JWT_SECRET_USER as string;
  } else {
    throw new Error(`Env file for user ${userId} not found`);
  }
}
