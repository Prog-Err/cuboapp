import { FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'crypto';
import { Application } from '@/app'
import { generateToken } from '@/secret';

export async function methodLogin({ api }: Application, req: FastifyRequest, res: FastifyReply) {
  try {
    switch (req.method?.toLowerCase()) {
      case 'post':
        const FIXED_SALT = process.env.FIXED_SALT as string;

        let { username: login, password } = req.body as { username: string; password: string };
        const entity = 'users'

        // Получаем User по логину
        const user = await api.getOne(entity, { query: { login } })
        if (!user) {
          return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Хешируем введенный пароль
        const hashedPassword = crypto.pbkdf2Sync(password, FIXED_SALT, 1000, 64, 'sha256').toString('hex');

        // Проверяем пароль
        if (hashedPassword !== user.password) {
          return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Генерация JWT токена
        const token = generateToken(user.id, { id: user.id, name: user.name });

        res.header('Content-Type', 'application/json');
        return res.status(200).send({ token });

      case 'options':
        return res.status(200).send();

      default:
        return res.status(405).send({ error: 'Method Not Allowed' });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send('Bad request');
  }
}

export async function methodLogout({ api }: Application, req: FastifyRequest, res: FastifyReply) {
  try {
    switch (req.method?.toLowerCase()) {
      case 'post':
        // Логика для выхода из системы
       
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7); // Извлечение токена из заголовка
          // Логика для инвалидирования токена
          // Например, удаление токена из базы данных или кэша
        }
        return res.status(200).send();
      case 'options':
        // Обработка OPTIONS запроса для CORS
        return res.status(200).send();

      default:
        return res.status(405).send({ error: 'Method Not Allowed' });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send('Bad request');
  }
}
export async function methodMe({ api }: Application, req: FastifyRequest, res: FastifyReply) {
  try {
    // Проверяем, что декодированные данные есть в запросе
    if (!(req as any).user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
      // Получаем идентификатор пользователя из декодированных данных
      const userId = (req as any).user.id;

      // Получаем пользователя из БД
      const user = await api.getOne('users', { query: { id: userId } });

      return res.status(200).send(user);
    } catch (err) {
      return res.status(401).send({ message: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Server error' });
  }
}

export async function methodCreateUser({ api }: Application, req: FastifyRequest, res: FastifyReply) {
  try {
    switch (req.method?.toLowerCase()) {
      case 'get':
        const login='ilya@example.com'
        const password ='test'
        const name ='ilya'
        const entity = 'users';
        const FIXED_SALT = process.env.FIXED_SALT as string;

        // Хешируем пароль перед сохранением
        const hashedPassword = crypto.pbkdf2Sync(password, FIXED_SALT, 1000, 64, 'sha256').toString('hex');

        // Создаем нового пользователя
        const newUser = await api.createOne(entity, {
          body: {
            id:1,
            login,
            password: hashedPassword,
            name
          }
        });

        return res.status(200).send(newUser);

      default:
        return res.status(405).send({ error: 'Method Not Allowed' });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send('Bad request');
  }
}

