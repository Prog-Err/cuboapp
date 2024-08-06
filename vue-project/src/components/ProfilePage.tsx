import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from '@/store';
import type  { User } from '@/types/User'; // Импортируем тип User

const ProfilePage = defineComponent({
  setup() {
    const store = useStore();
    const user = ref<User | null>(null);
    const error = ref<string>('');

    const loadUser = async () => {
      try {
        user.value = await store.fetchUser();
      } catch (err) {
        error.value = (err as Error).message;
      }
    };

    onMounted(() => {
      loadUser();
    });

    return () => (
      <div class="profile-page">
        <h1>Профиль</h1>
        {error.value ? (
          <p>Error: {error.value}</p>
        ) : user.value ? (
          <div>
            <p>ID: {user.value.id}</p>
            <p>Name: {user.value.name}</p>
            <p>Login: {user.value.login}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <p>Токен: {store.state.token}</p>
      </div>
    );
  },
});

export default ProfilePage;
