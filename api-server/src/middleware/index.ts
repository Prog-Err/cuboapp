import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken,decodeToken } from '@/secret';

// Middleware для проверки JWT токена
export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  try {
  
    // Проверяем наличие токена в заголовке для всех запросов, кроме OPTIONS
    if (req.method?.toLowerCase() !== 'options') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization header missing or malformed' });
      }

    //   const JWT_SECRET = process.env.JWT_SECRET as string;
      const token = authHeader.substring(7); // Извлечение токена из заголовка

      try {
         // Декодируем токен без проверки подписи, чтобы получить userId
        const decodedToken =  decodeToken(token) as { id: number };
        if (!decodedToken || !decodedToken.id) {
            return res.status(401).send({ message: 'Invalid token payload' });
        }

        // Проверяем токен с помощью verifyToken
        const decoded =  verifyToken( decodedToken.id,token);
        if (!decoded) {
            return res.status(401).send({ message: 'Invalid or expired token' });
        }
        
        // Добавляем декодированные данные в `request` для дальнейшего использования
        (req as any).user = decoded;

      } catch (err) {
        return res.status(401).send({ message: 'Invalid or expired token' });
      }
    }

    // Обработка OPTIONS запроса для CORS
    if (req.method?.toLowerCase() === 'options') {
      return res.status(200).send();
    }

  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Server error' });
  }
}
