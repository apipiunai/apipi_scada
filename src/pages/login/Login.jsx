import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIdioma } from '../../context/IdiomaContext';

export default function Login() {
    const { theme } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { idioma, diccionario } = useIdioma();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login attempt with:", credentials);
        await login();
        navigate("/");
    };

    return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: theme.background,
            color: theme.text1,
        }}>
            <form 
                onSubmit={handleLogin}
                style={{ 
                    backgroundColor: theme.card, 
                    margin: 20,
                    borderRadius: '15px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    width: 'calc(100% - 40px)',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    border: `1px solid ${theme.border}`,
                    padding: 20
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: theme.main }}>{diccionario?.[ "Welcome back" ]}</h1>
                    <p style={{ color: theme.text2, margin: 0 }}>{diccionario?.["Please enter your details"]}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>{diccionario?.Username}</label>
                    <input 
                        type="text" 
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        style={{ 
                            padding: '12px 15px', 
                            borderRadius: '8px', 
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.background,
                            color: theme.text1,
                            outline: 'none'
                        }} 
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>{diccionario?.Password}</label>
                    <input 
                        type="password" 
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ 
                            padding: '12px 15px', 
                            borderRadius: '8px', 
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.background,
                            color: theme.text1,
                            outline: 'none'
                        }} 
                    />
                </div>

                <button 
                    type="submit"
                    style={{ 
                        marginTop: '10px',
                        padding: '14px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        backgroundColor: theme.main, 
                        color: 'white', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    {diccionario?.Login}
                </button>
            </form>
        </div>
    );
}
