import './App.css'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Layout from './layout/Layout'
import Documents from './pages/documents/Documents'
import Plano from './pages/plano/Plano'
import { useAuth } from './context/AuthContext'
import Spinner from './components/Spinner'
import { useTheme } from './context/ThemeContext'
import Oee from './pages/oee/Oee'
import Machine from './pages/plano/Machine'

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
            {pages.some(p => p.path === '/documents') && <Route path="/documents" element={<Documents />} />}
            {pages.some(p => p.path === '/plano') && <Route path="/plano" element={<Plano />} />}
            {pages.some(p => p.path === '/oee') && <Route path="/oee" element={<Oee />} />}
            {pages.some(p => p.path === '/plano') && <Route path="/plano/:id" element={<Machine />} />}
            {/* Redirigir a la primera página disponible */}
            <Route path="*" element={<Navigate to={pages.length > 0 ? pages[0].path : "/login"} replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  )
}

export default App