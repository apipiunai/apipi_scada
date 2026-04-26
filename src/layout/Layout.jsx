import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Dashboard, ReceiptLong, Menu, Close, AccountCircle, Logout, Map, WbSunny, Brightness2 } from '@mui/icons-material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { useWindowSize } from '../context/WindowSize';
import IconHover from '../components/IconHover';
import Desplegable from '../components/Desplegable';
import { useAuth } from '../context/AuthContext';
import { useIdioma } from '../context/IdiomaContext';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function Layout() {
    const { theme, mode, setMode } = useTheme();
    const { IdiomaComponent, diccionario } = useIdioma();
    const location = useLocation();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { user, logout, pages } = useAuth();

    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (width > 600) {
            setOpen(true);
        }
    }, [width]);


    const pantallas = [
        {
            path: "/",
        },
        {
            path: "/documents",
        },
        {
            path: "/plano",
        },
        {
            path: "/oee",
        }
    ].filter(p => pages?.some(page => page.path === p.path));


    const MenuTheme = () => {
        return (
            <Desplegable icon={<IconHover icon={mode === "dark" ? <Brightness2 /> : mode === "default" ? <WbSunny /> : <AcUnitIcon />} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {mode !== "default" && <IconHover action={() => setMode("default")} icon={<WbSunny />} />}
                    {mode !== "dark" && <IconHover action={() => setMode("dark")} icon={<Brightness2 />} />}
                    {mode !== "ice" && <IconHover action={() => setMode("ice")} icon={<AcUnitIcon />} />}
                </div>
            </Desplegable>
        )
    }

    const UserMenu = () => {
        return (
            <Desplegable icon={<IconHover icon={<AccountCircle />} />}>
                <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                    <IconHover fontSize="small" action={() => logout()} icon={<div style={{ display: 'flex', alignItems: 'center', gap: 10, color: theme.error, fontSize: 12 }}><Logout fontSize="small" style={{ color: theme.error }} /> {diccionario?.Logout || "Logout"}</div>} />
                </div>
            </Desplegable>
        )
    }



    const paginas = pages.map((page) => {
        const matchingPantalla = pantallas.find(p => p.path === page.path);
        return matchingPantalla ? { ...page, icon: matchingPantalla.icon } : null;
    }).filter(p => p !== null);

    const iconos = {
        "Dashboard": <Dashboard fontSize="small" />,
        "Documentos": <AssignmentIcon fontSize="small" />,
        "Plano": <Map fontSize="small" />,
        "OEE": <Map fontSize="small" />
    }

    const isMobile = width < 600;

    return (
        <div style={{
            overflow: "hidden",
            position: "relative",
            width: "100%",
            height: "100vh",
            background: theme.background,
            color: theme.text1,
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                height: 60,
                background: theme.header,
                zIndex: 9999,
                borderBottom: `1px solid ${theme.border}`,
                alignItems: "center",
                gap: 20
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: isMobile ? "" : 200,
                    transition: 'all 0.3s',
                    padding: isMobile ? "0 20px" : ""
                }}>
                    <img src="logo.png" height={30} alt="Logo" />
                </div>
                <Divider orientation="vertical" flexItem style={{ background: theme.border, height: "100%" }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <IconHover icon={<MenuIcon />} action={() => setOpen(!open)} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", padding: "0px 20px", gap: isMobile ? 5 : 15 }}>
                        <MenuTheme />
                        <UserMenu />
                        <IdiomaComponent />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", height: "calc(100vh - 60px)", position: "relative" }}>
                {/* Sidebar Overlay for Mobile */}
                {isMobile && open && (
                    <div
                        onClick={() => setOpen(false)}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 9990
                        }}
                    />
                )}

                {/* Sidebar */}
               {open && <div style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 220,
                    width: isMobile ? 260 : 220,
                    height: "100%",
                    background: theme.card,
                    borderRight: `1px solid ${theme.border}`,
                    zIndex: 9995,
                    position: isMobile ? "absolute" : "relative",
                    left: open ? 0 : -300,
                    transition: 'left 0.3s ease-in-out'
                }}>
                    <div style={{ padding: "20px 0" }}>
                        {paginas.map((page, index) => {
                            const isActive = page.path === "/" ? location.pathname === page.path : location.pathname.includes(page.path);
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        navigate(page.path);
                                        if (isMobile) setOpen(false);
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 20px",
                                        gap: 12,
                                        background: isActive ? theme.background : "transparent",
                                        margin: "4px 10px",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        color: isActive ? theme.main : theme.text1,
                                        fontWeight: isActive ? "600" : "400",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.backgroundColor = theme.hover + '20';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", color: isActive ? theme.main : theme.text2 }}>
                                        {iconos[page.nombre] || <Dashboard fontSize="small" />}
                                    </div>
                                    <span style={{ fontSize: "0.9rem" }}>{diccionario?.[page.nombre] || page.nombre}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>}

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    padding: isMobile ? 20 : 40,
                    overflowY: "auto",
                    background: theme.background,
                    transition: 'all 0.3s'
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
