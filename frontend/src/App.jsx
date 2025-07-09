import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'
import GroupDashboard from './pages/GroupDashboard'
import './App.css'

function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Helper component to redirect after login/register
  const LoginWrapper = () => {
    const navigate = useNavigate();
    return <LoginPage onLoginSuccess={() => navigate('/groups')} />;
  };
  const RegisterWrapper = () => {
    const navigate = useNavigate();
    return <RegisterPage onRegisterSuccess={() => navigate('/groups')} />;
  };
  const GroupDashboardWrapper = () => {
    const navigate = useNavigate();
    return <GroupDashboard onSelectGroup={g => { setSelectedGroup(g); navigate('/board'); }} />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
        <Route path="/groups" element={<GroupDashboardWrapper />} />
        <Route path="/board" element={selectedGroup ? <BoardPage group={selectedGroup} /> : <Navigate to="/groups" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
