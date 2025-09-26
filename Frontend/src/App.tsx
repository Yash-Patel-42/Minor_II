import { Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Home from './pages/general/Home.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
