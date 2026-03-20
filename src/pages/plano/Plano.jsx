import { useEffect, useState, useRef } from "react";
import Card from "../../components/Card";
import { useTheme } from "../../context/ThemeContext";
import { useWindowSize } from "../../context/WindowSize";
import { useIdioma } from "../../context/IdiomaContext";


export default function Plano() {
    const { width } = useWindowSize();
    const { theme } = useTheme();
    const { diccionario } = useIdioma();
    const [selected, setSelected] = useState(null);
    const [over, setOver] = useState(null);
    const [imgWidth, setImgWidth] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);


    const imgRef = useRef(null);


    const infoRef = useRef(null);

    const scrollInfo = () => {
        infoRef.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (!selected) return;
        scrollInfo();
    }, [selected]);

    useEffect(() => {
        const updateSize = () => {
            const img = imgRef.current;
            if (!img) return;
            // getBoundingClientRect gives the actual rendered size
            const { width, height } = img.getBoundingClientRect();
            setImgWidth(Math.round(width));
            setImgHeight(Math.round(height));
        };

        const img = imgRef.current;
        if (!img) return;

        // If image is already cached/loaded, run immediately
        if (img.complete) {
            updateSize();
        } else {
            // Otherwise wait for it to load first
            img.addEventListener("load", updateSize);
        }

        window.addEventListener("resize", updateSize);

        return () => {
            img.removeEventListener("load", updateSize);
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    const Hitbox = ({ x, y, width, height, id }) => {
        return (
            <div className={selected === id ? "hitbox-blink-selected" : "hitbox-blink"} onClick={() => setSelected(id)} onMouseOver={() => setOver(id)} onMouseLeave={() => setOver(null)} style={{cursor: "pointer", width: width, height: height, position: "absolute", top: y, left: x, backgroundColor: "red" }}></div>
        )
    }


    const isometricos = {
        "modulo1.png": { img: "iso_modulo1.png", info: diccionario?.["Modulo 1 info"] || `Este módulo constituye el núcleo de la fuerza bruta y la precisión geométrica de la línea, donde dos robustos robots industriales de alta capacidad de carga se encargan de manipular y posicionar los chasis o componentes base sobre el raíl central. Mientras estos brazos naranjas aseguran la estabilidad de las piezas de gran volumen, una pareja de robots amarillos de alta velocidad realiza tareas de fijación, atornillado y soldadura de precisión en los puntos críticos. Todo el proceso está coordinado por un sistema de control centralizado que permite el intercambio automático de herramientas, garantizando que el esqueleto del producto esté perfectamente ensamblado antes de pasar a la siguiente fase.` },
        "modulo2.png": { img: "iso_modulo2.png", info: diccionario?.["Modulo 2 info"] || `Este módulo se encarga de la gestión detallada de piezas pequeñas y la validación final del producto mediante un sistema de "kitting" automatizado. El brazo robótico principal selecciona componentes específicos desde una estantería de suministros organizada por colores para alimentar las estaciones de trabajo, mientras los robots secundarios, equipados con sistemas de visión artificial, escanean cada unión y superficie en busca de defectos microscópicos. Este módulo incluye además una zona de acceso técnico con escaleras y paneles de control manual, diseñada para que los operarios puedan realizar ajustes de calibración o mantenimiento preventivo sin interrumpir el flujo continuo de la producción.` }
    }

    return (
        <div style={{ position: "relative" }}>
            <style>
                {`
                    @keyframes blink {
                        0%, 100% { opacity: 0.0; }
                        50% { opacity: 0.1; }
                    }
                    .hitbox-blink {
                        animation: blink 1.5s infinite ease-in-out;
                        cursor: pointer;
                    }
                    .hitbox-blink:hover {
                        animation: none;
                        opacity: 0 !important;
                    }
                    .hitbox-blink-selected {
                        animation: none;
                        opacity: 0 !important;
                    }
                `}
            </style>
            <img ref={imgRef} style={{ width: "100%", backgroundColor: "" }} src="plano.png" alt="" />

            {(over || selected) && <img style={{ width: "100%", backgroundColor: "", opacity: 0.5, position: "absolute", top: 0, left: 0 }} src={over || selected} alt="" />}

            <Hitbox x={imgWidth / 2.4} y={imgHeight / 8} width={imgWidth / 5.8} height={imgHeight / 3.1} id={"modulo1.png"} />
            <Hitbox x={imgWidth / 2.52} y={imgHeight / 2.1} width={imgWidth / 5.1} height={imgHeight / 2.45} id={"modulo2.png"} />

            {selected && <Card>
                <div style={{ display: "flex", gap: "20px", flexDirection: width < 900 ? "column" : "row" }}>
                    <div style={{width: width < 900 ? "calc(100% - 40px)" : "50%",  backgroundColor:theme.back3, padding: 20, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <img style={{width: "calc(100% - 40px)"}} src={isometricos[selected].img} alt="" />
                    </div>
                    <pre ref={infoRef} style={{ width: width < 900 ? "calc(100% - 40px)" : "50%", backgroundColor: "", whiteSpace: "pre-wrap" }}>{isometricos[selected].info}</pre>
                </div>
            </Card>}

        </div>
    );
}