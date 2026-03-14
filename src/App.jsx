import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Layout from './layout/Layout'
import Albaran from './pages/albaran/Albaran'
import Plano from './pages/plano/Plano'
import { useAuth } from './context/AuthContext'
import Spinner from './components/Spinner'
import { useTheme } from './context/ThemeContext'
import { Navigate } from 'react-router-dom'
import Oee from './pages/oee/Oee'

function App() {

  const { loading, user, pages } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme.background }}><Spinner /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {(!user || !pages) && <Route path="*" element={<Navigate to="/login" />} />}
        
        {user && pages && (
          <Route element={<Layout />}>
            {pages.some(p => p.path === '/') && <Route path="/" element={<Dashboard />} />}
            {pages.some(p => p.path === '/albaran') && <Route path="/albaran" element={<Albaran />} />}
            {pages.some(p => p.path === '/plano') && <Route path="/plano" element={<Plano />} />}
            {pages.some(p => p.path === '/oee') && <Route path="/oee" element={<Oee />} />}
            
            {/* Si el path no coincide con ninguna de las habilitadas, enviar a la primera disponible */}
            <Route path="*" element={<Navigate to={pages.length > 0 ? pages[0].path : "/login"} replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  )
}

export default App
