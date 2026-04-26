import { useEffect, useState, useRef } from "react";
import Card from "../../components/Card";
import { useTheme } from "../../context/ThemeContext";
import { useWindowSize } from "../../context/WindowSize";
import { useIdioma } from "../../context/IdiomaContext";
import Tabs from "../../components/Tabs";
import InfoIcon from '@mui/icons-material/Info';
import IconHover from "../../components/IconHover";
import { useNavigate } from "react-router-dom";


export default function Plano() {
    const { width } = useWindowSize();
    const { theme } = useTheme();
    const { diccionario } = useIdioma();
    const [selected, setSelected] = useState(null);
    const [over, setOver] = useState(null);
    const [imgWidth, setImgWidth] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);
    const navigate = useNavigate();

    const zonas = ["zona1.png", "zona2.png", "zona3.png", "zona4.png", "zona5.png", "zona6.png", "zona7.png"];

    const models = [
        {
            name: "Zona de preparación",
            img: "isometrico1.png",
            model: "model1.png",
            desc: "Área dedicada a la recepción y clasificación de materias primas. En esta fase se realiza un control de calidad inicial del tejido, verificando gramaje, color y textura antes de su entrada en la línea de producción. Cuenta con sistemas de desbobinado automático y mesas de inspección retroiluminadas para detectar posibles taras en el material."
        },
        {
            name: "Zona de medición",
            img: "isometrico2.png",
            model: "model2.png",
            desc: "Estación de alta precisión donde se determinan las dimensiones exactas necesarias para el aprovechamiento óptimo del tejido. Utiliza sensores láser y sistemas de visión artificial para calcular el anidamiento (nesting) más eficiente, minimizando el desperdicio de material y enviando las coordenadas directas al sistema de corte digital."
        },
        {
            name: "Zona de corte",
            img: "isometrico3.png",
            model: "model3.png",
            desc: "Núcleo tecnológico equipado con máquinas de corte CNC por cuchilla oscilante o láser. Esta zona garantiza una repetibilidad perfecta en las piezas cortadas, permitiendo geometrías complejas con tolerancias menores a 0.5mm. El sistema está integrado con la base de datos de patrones para cambios de modelo instantáneos sin intervención manual."
        },
        {
            name: "Zona de impresión",
            img: "isometrico4.png",
            model: "model4.png",
            desc: "Sección de personalización técnica donde se aplican gráficos, logotipos o códigos de trazabilidad mediante sublimación digital o serigrafía automatizada. Cuenta con túneles de secado UV y sistemas de registro por cámara que aseguran el alineamiento perfecto de la impresión sobre las piezas previamente cortadas."
        },
        {
            name: "Zona de costura",
            img: "isometrico5.png",
            model: "model5.png",
            desc: "Línea de ensamblaje principal compuesta por estaciones de costura robótica y puestos ergonómicos asistidos. Se utilizan hilos de alta resistencia y puntadas programables para asegurar la integridad estructural del producto. Sensores de rotura de hilo e IA de inspección supervisan cada unión en tiempo real para descartar defectos de fabricación."
        },
        {
            name: "Zona de planchado",
            img: "isometrico6.png",
            model: "model6.png",
            desc: "Fase de acabado térmico y conformado. Mediante la aplicación controlada de vapor y presión, se eliminan arrugas y se estabilizan las costuras. El sistema permite regular la temperatura y el tiempo de exposición según el tipo de tejido, garantizando que el producto final mantenga su forma y propiedades estéticas tras el embalaje."
        },
        {
            name: "Zona de empaquetado",
            img: "isometrico7.png",
            model: "model7.png",
            desc: "Etapa final del proceso donde se realiza el etiquetado inteligente (RFID/QR), plegado automático y embolsado al vacío. La zona está equipada con brazos robóticos para el paletizado y un sistema de verificación final de peso y dimensiones que valida el envío antes de su traslado al centro logístico."
        }
    ]

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

    const Hitbox = ({ x, y, width, height, id, background = "transparent" }) => {
        return (
            <div onMouseEnter={() => setOver(id)} onMouseLeave={() => setOver(null)} onClick={() => setSelected(id)} style={{ cursor: "pointer", width: width, height: height, position: "absolute", top: y, left: x, backgroundColor: background, opacity: 0.3 }}></div>
        )
    }




    const Blink = () => {
        return (
            <style>
                {`
                @keyframes blink {
                    0% { opacity: 0; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0; }
                }
                .blink-plano {
                    animation: blink 2s infinite ease-in-out;
                }
                `}
            </style>
        )
    }

    return (
        <div style={{ position: "relative" }}>
            <Blink />

            <img ref={imgRef} style={{ width: "100%", transition: "filter 0.3s ease" }} src="plano.png" alt="Plano" />

            <img
                className="blink-plano"
                src="plano_blink.png"
                style={{
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    pointerEvents: "none"
                }}
                alt=""
            />

            <img src={zonas[over !== null ? over : selected]} style={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: "none"
            }} alt="" srcset="" />


            <Hitbox x={imgWidth * 0.11} y={imgHeight * 0.33} width={imgWidth * 0.22} height={imgHeight * 0.3} id={0} />
            <Hitbox x={imgWidth * 0.31} y={imgHeight * 0.22} width={imgWidth * 0.18} height={imgHeight * 0.3} id={1}  />
            <Hitbox x={imgWidth * 0.515} y={imgHeight * 0.22} width={imgWidth * 0.183} height={imgHeight * 0.29} id={2} />
            <Hitbox x={imgWidth * 0.68} y={imgHeight * 0.34} width={imgWidth * 0.14} height={imgHeight * 0.23} id={3}  />
            <Hitbox x={imgWidth * 0.6} y={imgHeight * 0.55} width={imgWidth * 0.19} height={imgHeight * 0.32} id={4}  />
            <Hitbox x={imgWidth * 0.42} y={imgHeight * 0.52} width={imgWidth * 0.164} height={imgHeight * 0.38} id={5}  />
            <Hitbox x={imgWidth * 0.26} y={imgHeight * 0.62} width={imgWidth * 0.12} height={imgHeight * 0.26} id={6}  />


            {selected !== null && (
                <div style={{ marginTop: "20px" }}>
                    <Card>
                        <>
                            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: theme.text1, fontSize: "1.2rem", fontWeight: "bold" }}>{models[selected].name}</span>
                                <IconHover action={()=>navigate(`/plano/${selected}`)} icon={<span style={{color:theme.main, cursor:"pointer"}}>SHOW</span>} />
                            </div>

                            <div style={{ display: "flex", gap: "20px", flexDirection: width < 900 ? "column" : "row" }}>
                                <div style={{
                                    width: width < 900 ? "100%" : "50%",
                                    backgroundColor: theme.background,
                                    borderRadius: "8px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <img style={{ width: "100%", height: "auto", borderRadius: 10 }} src={models[selected].img} alt="" />
                                </div>
                                <div style={{ width: width < 900 ? "100%" : "50%", backgroundColor: theme.background, borderRadius: 10, padding: 20 }}>
                                    <pre
                                        ref={infoRef}
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            fontFamily: "inherit",
                                            color: theme.text1,
                                            margin: 0,
                                            fontSize: "0.95rem",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        {models[selected].desc}
                                    </pre>
                                </div>
                            </div>
                        </>
                    </Card>
                </div>
            )}
        </div>
    );
}