import { Provider } from 'react-redux';
import AppRoutes from './routes/index';
import '@xyflow/react/dist/style.css';
import { store } from './store';

export function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
