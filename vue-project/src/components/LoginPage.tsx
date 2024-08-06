import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';
import { CuboButton, CuboText } from '@cuboapp/ui-vue';
import '@/assets/LoginPage.css'

const LoginPage = defineComponent({
  setup() {
    const store = useStore();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const login = async () => {
      try {
        await store.login(username.value, password.value);
        console.log('Logged in successfully');
      } catch (error) {
        errorMessage.value = 'Ошибка входа. Проверьте логин и пароль.';
      }
    };

    return () => (
      <div class="login-page">
        <h1>Вход</h1>
          <div class="form-group">
            <label for="username">Логин:</label>
             <CuboText
              html-type="text"
              value={username.value}
              onKeyup={(e)=> e.key === 'Enter' &&  login()}
              onChange={(val)=>username.value=val}
            />
          </div>
          <div class="form-group">
            <label for="password">Пароль:</label>
            <CuboText
              onChange={(val)=>password.value=val}
              onKeyup={(e)=> e.key === 'Enter' && login()}
              html-type="password"
              value={password.value}
            />
          </div>
          {errorMessage.value && <div class="error">{errorMessage.value}</div>}
          <CuboButton color='blue'  onClick={login}>Войти</CuboButton>
     </div>
    );
  },
});

export default LoginPage;
