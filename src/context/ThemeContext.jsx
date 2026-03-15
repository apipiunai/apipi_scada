import { createContext, useContext, useState, useEffect } from "react";
import Desplegable from "../components/Desplegable";
import IconHover from "../components/IconHover";
import { MoreVert } from "@mui/icons-material";
import { WbSunny, Brightness2 } from "@mui/icons-material";


const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default function ThemeProvider({ children }) {
    const palettes = {
        default: {
            background: "#ffffff",
            back2: "#f5f5f5",
            back3: "#e0e0e0",
            card: "#ffffff",
            border1: "#e0e0e0",
            border2: "#cccccc",
            main1: "#1565c0",
            main2: "#1565c0",
            main3: "#0d47a1",
            main4: "#82b1ff",
            light1: "#82b1ff",
            light2: "#42a5f5",
            light3: "#1565c0",
            text1: "#000000",
            text2: "#333333",
            error: "#d32f2f",
            success: "#4caf50",
            warning: "#ff9800",
            info: "#2196f3",
        },
        dark: {
            background: "#121212",
            back2: "#1e1e1e",
            back3: "#333333",
            card: "#1e1e1e",
            border1: "#333333",
            border2: "#444444",
            main1: "#64b5f6",
            main2: "#42a5f5",
            main3: "#2196f3",
            main4: "#1565c0",
            light1: "#9fd2fbff",
            light2: "#42a5f5",
            light3: "#2196f3",
            text1: "#ffffff",
            text2: "#e0e0e0",
            error: "#d32f2f",
            success: "#4caf50",
            warning: "#ff9800",
            info: "#2196f3",
        },
    };


    const [mode, setMode] = useState(localStorage.getItem("theme") || "default");
    const [theme, setTheme] = useState(palettes[mode]);

    useEffect(() => {
        setTheme(palettes[mode]);
        localStorage.setItem("theme", mode);
    }, [mode]);

    const ThemeComponent = () => {
        return (
            <Desplegable icon={<IconHover icon={mode === "default" ? <WbSunny /> : mode === "dark" ? <Brightness2 /> : <MoreVert />} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <IconHover icon={<WbSunny />} action={() => setMode("default")} />
                    <IconHover icon={<Brightness2 />} action={() => setMode("dark")} />
                </div>
            </Desplegable>
        )
    }


    return (
        <ThemeContext.Provider value={{ theme, setMode, ThemeComponent, mode }}>
            {children}
        </ThemeContext.Provider>
    )
}
