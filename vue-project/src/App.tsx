import { defineComponent } from 'vue';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import { provideStore, createStore } from './store';

const App = defineComponent({
  setup() {
    const store = createStore();
    provideStore(store);

    return () => (
      <>
        <header>
          <Navbar />
        </header>
        <main>
          {store.state.isAuthenticated ? <ProfilePage /> : <LoginPage />}
        </main>
      </>
    );
  },

});

export default App;
