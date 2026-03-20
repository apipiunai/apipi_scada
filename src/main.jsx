import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './context/ThemeContext'
import WindowSizeProvider from './context/WindowSize'
import AuthProvider from './context/AuthContext'
import GeminiProvider from './context/GeminiContext'
import IdiomaProvider from './context/IdiomaContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <GeminiProvider>
        <WindowSizeProvider>
          <ThemeProvider>
            <IdiomaProvider>
              <App />
            </IdiomaProvider>
          </ThemeProvider>
      </WindowSizeProvider>
      </GeminiProvider>
    </AuthProvider>
  </StrictMode>,
)
