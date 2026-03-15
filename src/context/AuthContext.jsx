import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        login();
    }, []);

    const usuario = {username: "unai", role: "admin"};

    const paginas = [
        {"page": "Dashboard", "path": "/"},
        {"page": "Albaran", "path": "/albaran"},
        {"page": "Plano", "path": "/plano"},
        {"page": "OEE", "path": "/oee"}
    ];

    const login = async () => {
        try {
            setLoading(true);   
            // const userRes = await fetch("http://localhost:5000/getUser");
            // const userData = await userRes.json();
            setUser(usuario);

            // const pagesRes = await fetch("http://localhost:5000/getPages");
            // const pagesData = await pagesRes.json();
            setPages(paginas);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setPages([]);
    };

    return (
        <AuthContext.Provider value={{ user, pages, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
