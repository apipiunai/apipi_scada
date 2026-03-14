import { createContext, useContext, useState, useEffect } from "react";


const GeminiContext = createContext();

export const useGemini = () => {
    const context = useContext(GeminiContext);
    if (!context) {
        throw new Error("useGemini must be used within a GeminiProvider");
    }
    return context;
};

export default function GeminiProvider({ children }) {
    
    const [api_key, setApiKey] = useState(null);

    

   


    return (
        <GeminiContext.Provider value={{ api_key, setApiKey }}>
            {children}
        </GeminiContext.Provider>
    )
}
