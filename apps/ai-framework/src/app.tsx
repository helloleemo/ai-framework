import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/index';
import '@xyflow/react/dist/style.css';

export function App() {
  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
}

export default App;
