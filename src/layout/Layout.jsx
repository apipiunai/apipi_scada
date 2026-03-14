import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Dashboard, ReceiptLong, Menu, Close, AccountCircle, Logout, Map } from '@mui/icons-material';
import { useWindowSize } from '../context/WindowSize';
import IconHover from '../components/IconHover';
import Desplegable from '../components/Desplegable';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { ThemeComponent, theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, logout, pages } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isMobile = width < 600;

    const pantallas = [
        {
            path: "/",
            name: "Dashboard",
            icon: <Dashboard fontSize="small" />
        },
        {
            path: "/albaran",
            name: "Albaran",
            icon: <ReceiptLong fontSize="small" />
        },
        {
            path: "/plano",
            name: "Plano",
            icon: <Map fontSize="small" />
        },
        {
            path: "/oee",
            name: "OEE",
            icon: <Map fontSize="small" />
        }
    ].filter(p => pages?.some(page => page.path === p.path));

    const handleNavigate = (path) => {
        navigate(path);
        if (isMobile) setIsMobileMenuOpen(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", backgroundColor: theme.background, color: theme.text1, transition: 'all 0.3s ease' }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${theme.border1}`, backgroundColor: theme.card, position: 'relative', zIndex: 1100 }}>
                <div style={{
                    width: isMobile ? "auto" : "220px",
                    padding: isMobile ? "15px 20px" : "15px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMobile ? "flex-start" : "center",
                    borderRight: isMobile ? 'none' : `1px solid ${theme.border1}`,
                    gap: 15
                }}>
                    {isMobile && (
                        <IconHover
                            icon={isMobileMenuOpen ? <Close /> : <Menu />}
                            action={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    )}
                    <img src="logo.png" height={isMobile ? 20 : 30} alt="Logo" />
                    
                </div>

                {user && !isMobile && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        padding: '6px 16px', 
                        borderRadius: '30px', 
                        backgroundColor: theme.back2,
                        border: `1px solid ${theme.border1}`,
                        marginLeft: '10px'
                    }}>
                        <AccountCircle style={{ color: theme.main1, fontSize: '1.8rem' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.text1, lineHeight: 1.2 }}>{user.name}</span>
                            <span style={{ fontSize: '0.7rem', color: theme.text2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>{user.role}</span>
                        </div>
                    </div>
                )}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '0 20px', gap: 10 }}>
                    <ThemeComponent />
                    <Desplegable icon={<IconHover icon={<AccountCircle />} />}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <IconHover action={() => logout() } icon={<Logout style={{ color: theme.error }}  />} />
                            </div>
                    </Desplegable>
                        
                    
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                {/* Sidebar */}
                <div style={{
                    backgroundColor: theme.card,
                    borderRight: `1px solid ${theme.border1}`,
                    display: "flex",
                    flexDirection: "column",
                    width: "220px",
                    padding: '10px',
                    position: isMobile ? 'absolute' : 'relative',
                    left: isMobile && !isMobileMenuOpen ? '-100%' : '0',
                    top: 0,
                    bottom: 0,
                    zIndex: 1000,
                    transition: 'left 0.3s ease-in-out',
                    boxShadow: isMobile && isMobileMenuOpen ? '5px 0 15px rgba(0,0,0,0.1)' : 'none'
                }}>
                    {pantallas.map((page, index) => {
                        const isActive = location.pathname === page.path;
                        return (
                            <div
                                key={index}
                                onClick={() => handleNavigate(page.path)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: '12px 15px',
                                    cursor: "pointer",
                                    borderRadius: '8px',
                                    marginBottom: '4px',
                                    backgroundColor: isActive ? theme.light1 + '20' : 'transparent',
                                    color: isActive ? theme.main1 : theme.text2,
                                    fontWeight: isActive ? '600' : '400',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = theme.border1 + '50';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', color: isActive ? theme.main1 : theme.text2 }}>
                                    {page.icon}
                                </span>
                                <span style={{ fontSize: '0.95rem' }}>{page.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Overlay */}
                {isMobile && isMobileMenuOpen && (
                    <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            zIndex: 999
                        }}
                    />
                )}

                {/* Main Content */}
                <main style={{ flex: 1, padding: "20px", overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

