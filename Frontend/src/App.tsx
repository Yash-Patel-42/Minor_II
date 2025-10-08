import { Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Home from './pages/general/Home.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PrivacyPolicy from './pages/policy/PrivacyPolicy.tsx';
import TermsOfService from './pages/policy/TermsOfService.tsx';
import Workspace from './pages/general/Workspace.tsx';
import Inbox from './pages/general/Inbox.tsx';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/:workspaceId"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invites"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
