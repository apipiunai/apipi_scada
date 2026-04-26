import { createContext, useContext, useState, useEffect } from "react";
import Desplegable from "../components/Desplegable";
import IconHover from "../components/IconHover";
import { MoreVert } from "@mui/icons-material";
import { WbSunny, Brightness2 } from "@mui/icons-material";


const IdiomaContext = createContext();

export const useIdioma = () => {
    const context = useContext(IdiomaContext);
    if (!context) {
        throw new Error("useIdioma must be used within a IdiomaProvider");
    }
    return context;
};

export default function IdiomaProvider({ children }) {
    

    const [idioma, setIdioma] = useState(localStorage.getItem("idioma") || "es");
    const [diccionario, setDiccionario] = useState(null);

    useEffect(() => {
        localStorage.setItem("idioma", idioma);
        fetch(`${import.meta.env.BASE_URL}/idiomas.json`)
            .then(res => res.json())
            .then(data => setDiccionario(data[idioma]))
            .catch(err => console.error(err));
    }, [idioma]);

    const IdiomaComponent = () => {
        return (
            <Desplegable icon={<IconHover icon={idioma === "es" ? <img style={{padding: "0px 5px"}} src="es.png" height={20} width={30} alt="" srcset="" /> : idioma === "en" ? <img style={{padding: "0px 5px"}} src="en.png" height={20} width={30} alt="" srcset="" /> : <MoreVert />} />}>
                <div  style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <img src="en.png" onClick={() => setIdioma("en")} style={{cursor: 'pointer'}} height={20} width={30} alt="" srcset="" />
                    <img src="es.png" onClick={() => setIdioma("es")} style={{cursor: 'pointer'}} height={20} width={30} alt="" srcset="" />
                </div>
            </Desplegable>
        )
    }


    return (
        <IdiomaContext.Provider value={{ idioma, setIdioma, IdiomaComponent, diccionario }}>
            {children}
        </IdiomaContext.Provider>
    )
}
