import React, { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'
import './App.css'

function App() {
  const [route, setRoute] = useState(window.location.pathname)

  const handleLoginSuccess = () => {
    window.location.href = '/board'
  }
  const handleRegisterSuccess = () => {
    window.location.href = '/board'
  }

  React.useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const goTo = (path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
  }

  if (route === '/register') {
    return <RegisterPage onRegisterSuccess={() => goTo('/board')} />
  }
  if (route === '/board') {
    return <BoardPage />
  }
  if (route === '/login') {
    return <LoginPage onLoginSuccess={() => goTo('/board')} />
  }
  // Default: redirect to login
  goTo('/login')
  return null
}

export default App
