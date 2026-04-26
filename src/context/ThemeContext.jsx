import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const palettes = {
    default: {
        background: "#e8e8e8ff",
        card: "#ffffff",
        header: "#ffffff",
        border: "#e8e8e8ff",
        main: "#007accff",
        text1: "#1a1a1a",
        text2: "#4a4a4a",
        textContrast1: "#fff",
        textContrast2: "#e6f3ff",
        hover: "#c5e6ffff",
        lightHover: "#f0f9ffff",
        darkHover: "#b3dfff",
        icon: "#333",
        iconContrast: "#fff",
        tableHeader: "#daeefdff",
        tableRow1: "#f7fbff",
        tableRow2: "#ffffff",
        chart1: "#007accff",
        chart2: "#00bcd4ff",
        chart3: "#ef5350ff",
        chart4: "#26a69aff",
        chart5: "#5c6bc0ff",
        chart6: "#1565c0ff",
        button: "#007accff",
        cancelButton: "#90caf9ff",
        clearButton: "#ef5350ff",
        tooltip: "#555",
        error: "#ef5350ff",
        warning: "#ffa726ff",
        success: "#26a69aff",
    },
    dark: {
        background: "#222222",
        card: "#333333",
        header: "#444444",
        border: "#555555",
        main: "#59c5f7ff",
        text1: "#e6edf3ff",
        text2: "#8b949eff",
        textContrast1: "#0d1117ff",
        textContrast2: "#ffffffff",

        // Hover: Usamos el azul principal con transparencia o variaciones
        hover: "#1f6feb33",       // Azul semitransparente para filas
        lightHover: "#1f6feb1a",  // Azul muy sutil
        darkHover: "#1f6feb66",   // Azul intenso para estados activos

        // Iconos
        icon: "#e1e1e1",
        iconContrast: "#0d1117ff",

        // Tablas: Gradación clara de niveles
        tableHeader: "#777777", // Cabecera bien diferenciada
        tableRow1: "#444444",   // Fila base (fondo)
        tableRow2: "#555555",   // Fila alterna (igual que card para jerarquía)

        // Gráficos (Colores neón mantenidos, funcionan perfecto)
        chart1: "#42a5f5ff", // Blue
        chart2: "#26c6daff", // Cyan
        chart3: "#ef5350ff", // Red
        chart4: "#66bb6aff", // Green
        chart5: "#ab47bcff", // Purple
        chart6: "#ffca28ff", // Yellow

        // Botones
        button: "#42a5f5ff",
        cancelButton: "#484f58ff", // Gris azulado neutro
        clearButton: "#f85149ff",  // Rojo más vibrante que el anterior

        tooltip: "#1c2128ff", // Fondo del tooltip similar al header

        // Estados
        error: "#f85149ff",
        warning: "#d29922ff",
        success: "#3fb950ff",
    },
    ice: {
        // Fondo gris medio/claro (estilo plata o plomo claro)
        background: "#8fa3b3ff",
        card: "#a8b8c5ff",
        header: "#a8b8c5ff",
        border: "#dcecf6ff",

        // Azul acero (Steel Blue) como color principal
        main: "#ccd9e6ff",

        text1: "#e1e1e1",
        text2: "#fff",
        textContrast1: "#fff",
        textContrast2: "#1c2833ff",

        // Hover con tonos azulados sobre gris
        hover: "#97aab6ff",
        lightHover: "#97aab6ff",
        darkHover: "#6d8a9cff",   // Azul grisáceo oscuro para activos

        icon: "#e1e1e1",
        iconContrast: "#fff",

        tableHeader: "#8898a3ff",
        tableRow1: "#b8c7d1ff",
        tableRow2: "#a8b8c5ff",

        chart1: "#4da6ffff",
        chart2: "#00bcd4ff",
        chart3: "#ef5350ff",
        chart4: "#26a69aff",
        chart5: "#5c6bc0ff",
        chart6: "#1565c0ff",

        button: "#4da6ffff",
        cancelButton: "#78909cff",
        clearButton: "#ef5350ff",

        tooltip: "#2c3e50",

        error: "#ef5350ff",
        warning: "#ffa726ff",
        success: "#26a69aff",
        
        // Adding missing info color property
        info: "#29b6f6ff"
    }
};

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem("theme_mode") || "default";
    });

    useEffect(() => {
        localStorage.setItem("theme_mode", mode);
    }, [mode]);


   

    const theme = palettes[mode];

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
