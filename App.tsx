
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Auth from './pages/Auth';
import UserApp from './pages/user/UserApp';
import AdminPanel from './pages/admin/AdminPanel';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/app" element={<UserApp />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
