import { reactive, provide, inject } from 'vue';
import type  { User } from '@/types/User'; // Импортируем тип User

// Уникальный символ для идентификации хранилища
const storeSymbol = Symbol('store');

// Определение типов хранилища
type StoreType = {
  state: {
    token: string | null;
    isAuthenticated: boolean;
  };
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  handleApiError: (response: Response) => void;
  fetchUser: () => Promise<User>; 
};

// Функция для создания хранилища
export const createStore = (): StoreType => {
  const state = reactive({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  });

  const login = async (username: string, password: string) => {

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        state.token = data.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', data.token);
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/logout', {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${state.token}` 
        }
      });
  
      if (response.ok) {
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  const fetchUser = async (): Promise<User> => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/me', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      await handleApiError(response); // Проверка и обработка ошибок

      if (response.ok) {
        const user = await response.json();
        return user
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      throw error;
    }
  };
  const handleApiError = async (response: Response) => {
    if (response.status === 401) {
      // Если ошибка 401, выполняем логаут
      await logout();
    }
  };

  return {
    state,
    login,
    logout,
    handleApiError,
    fetchUser
  };
};

// Функция для предоставления хранилища
export const provideStore = (store: StoreType) => {
  provide(storeSymbol, store);
};

// Функция для получения хранилища
export const useStore = (): StoreType => {
  const store = inject(storeSymbol);
  if (!store) {
    throw new Error('Store not provided!');
  }
  return store as StoreType;
};
