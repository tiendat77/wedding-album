import { Provider } from 'react-redux';
import { store } from './store';

import Album from './components/Album';
import Background from './components/Background';

function App() {
  return (
    <Provider store={store}>
      <main className="relative flex flex-auto flex-col">
        <Background />

        <section className="fixed h-screen w-screen">
          <Album />
        </section>
      </main>
    </Provider>
  );
}

export default App;
