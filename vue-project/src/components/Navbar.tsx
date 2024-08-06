import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { CuboButton} from '@cuboapp/ui-vue';
import '@/assets/Navbar.css';  

const Navbar = defineComponent({
  setup() {
    const store = useStore();

    const logout = () => {
      store.logout();
      console.log('Logged out successfully');
    };

    return () => (
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a href="/">My App</a>
          </div>
          <div class="navbar-menu">
            {store.state.isAuthenticated && (
              <CuboButton color='blue'  onClick={logout}>Выйти</CuboButton>
            )}
          </div>
        </div>
      </nav>
    );
  },
});

export default Navbar;
