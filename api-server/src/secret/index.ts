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
    const secretKey = `JWT_SECRET_USER_${userId}`;
    const secret = process.env[secretKey] as string;
    return secret;
}