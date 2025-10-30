import { Route, Routes } from 'react-router';

import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Home from './pages/general/Home.tsx';
import Inbox from './pages/general/Inbox.tsx';
import Workspace from './pages/general/Workspace.tsx';
import PrivacyPolicy from './pages/policy/PrivacyPolicy.tsx';
import TermsOfService from './pages/policy/TermsOfService.tsx';
import LandingPage from './pages/LandingPage.tsx';
import UploadVideo from './pages/general/UploadVideo.tsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
      <Route
        path="workspace/:workspaceId/upload-video"
        element={
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
