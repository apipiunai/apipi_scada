import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import Card from "../../components/Card";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import LinkIcon from '@mui/icons-material/Link';
import { useTheme } from "../../context/ThemeContext";
import { useGemini } from "../../context/GeminiContext";
import { useIdioma } from "../../context/IdiomaContext";

export default function AlbaranGemini() {

    const { theme } = useTheme();
    const { diccionario } = useIdioma();
    const { api_key, setApiKey } = useGemini();
    const [response, setResponse] = useState("");
    const [formData, setFormData] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [pdfBase64, setPdfBase64] = useState(null);
    const [loading, setLoading] = useState(false);

    // Convierte el asset estático a base64 al montar el componente
    useEffect(() => {
        fetch('albaran.png')
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(",")[1];
                    setImageBase64(base64);
                };
                reader.readAsDataURL(blob);
            });

        fetch('albaran.pdf')
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(",")[1];
                    setPdfBase64(base64);
                };
                reader.readAsDataURL(blob);
            });
    }, []);


    const spinnerRef = useRef(null);

    const scrollToSpinner = () => {
        spinnerRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (loading) {
            scrollToSpinner();
        }
    }, [loading]);


    const ofjeto_referencia = `
    {
  "emisor": {
    "nombre": "",
    "direccion": "",
    "codigo_postal": "",
    "localidad": "",
    "provincia": "",
    "pais": "",
    "telefono": "",
    "email": "",
    "nif": ""
  },
  "receptor": {
    "nombre": "",
    "direccion": "",
    "codigo_postal": "",
    "localidad": "",
    "provincia": "",
    "pais": "",
    "telefono": "",
    "email": "",
    "nif": ""
  },
  "detalles_albaran": {
    "numero": "",
    "fecha": ""
  },
  "totales": {
    "base_imponible_total": 0.00,
    "iva_total": 0.00,
    "gran_total": 0.00,
    "moneda": ""
  }
}`

    const parseGeminiResponse = (text) => {
        try {
            let cleanedText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
            const parsedData = JSON.parse(cleanedText);
            setFormData(parsedData);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            setFormData(null);
        }
    }

    async function processImg() {
        if (!imageBase64) return;
        if (!api_key) {
            alert(diccionario?.["API Key Gemini"] || "Por favor, introduce tu API Key de Gemini.");
            return;
        }

        setLoading(true);
        setFormData(null);
        setResponse("");
        try {
            const ai = new GoogleGenAI({ apiKey: api_key });
            const res = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `haz un objeto json como esta referencia: ${ofjeto_referencia} no incluyas nada mas. unicamente desde "{" hasta "}". extrae los datos de la imagen.`
                            },
                            {
                                inlineData: {
                                    mimeType: "image/png",
                                    data: imageBase64,
                                },
                            },
                        ],
                    },
                ],
            });

            setResponse(res.text);
            parseGeminiResponse(res.text);
        } catch (err) {
            setResponse("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function processPdf() {
        if (!pdfBase64) return;
        if (!api_key) {
            alert(diccionario?.["API Key Gemini"] || "Por favor, introduce tu API Key de Gemini.");
            return;
        }

        setLoading(true);
        setFormData(null);
        setResponse("");
        try {
            const ai = new GoogleGenAI({ apiKey: api_key });
            const res = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `haz un objeto json como esta referencia: ${ofjeto_referencia} no incluyas nada mas. unicamente desde "{" hasta "}". extrae los datos del pdf.`
                            },
                            {
                                inlineData: {
                                    mimeType: "application/pdf",
                                    data: pdfBase64,
                                },
                            },
                        ],
                    },
                ],
            });

            setResponse(res.text);
            parseGeminiResponse(res.text);
        } catch (err) {
            setResponse("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const renderForm = () => {
        if (!formData) return <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>;
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px", width: "100%" }}>
                {Object.keys(formData).map(section => {
                    if (typeof formData[section] === 'object' && formData[section] !== null && !Array.isArray(formData[section])) {
                        return (
                            <div key={section} style={{ padding: "15px", backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: "8px" }}>
                                <h4 style={{ margin: "0 0 15px 0", textTransform: "capitalize", color: theme.main, borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>{diccionario?.[section] || section.replace(/_/g, " ")}</h4>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                                    {Object.keys(formData[section]).map(field => (
                                        <div key={field} style={{ display: "flex", flexDirection: "column" }}>
                                            <label style={{ fontSize: "0.8rem", color: theme.text2, marginBottom: "4px", textTransform: "capitalize", fontWeight: "600" }}>{diccionario?.[field] || field.replace(/_/g, " ")}</label>
                                            <input
                                                type="text"
                                                value={formData[section][field] || ""}
                                                onChange={(e) => handleInputChange(section, field, e.target.value)}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: "6px",
                                                    border: `1px solid ${theme.border}`,
                                                    backgroundColor: theme.background,
                                                    color: theme.text1,
                                                    outline: "none",
                                                    fontSize: "0.9rem"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    return (
        <Card>
            <style>
                {`
    @keyframes vibrateSoft {
      0%   { transform: rotate(-45deg) scale(1); filter: drop-shadow(0 0 0px transparent); }
      50%  { transform: rotate(-45deg) scale(1.1); filter: drop-shadow(0 0 8px #6366f1); }
      100% { transform: rotate(-45deg) scale(1); filter: drop-shadow(0 0 0px transparent); }
    }

    .link-icon {
      transform: rotate(-45deg);
    }

    .vibrate-icon {
      animation: vibrateSoft 1.2s infinite ease-in-out;
      cursor: pointer;
    }

    .vibrate-icon:hover {
      animation-play-state: paused;
      transform: rotate(-45deg) scale(1.2);
      filter: drop-shadow(0 0 10px #6366f1);
      transition: transform 0.2s, filter 0.2s;
    }
  `}
            </style>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "5px", justifyContent: "end", alignItems: "center" }}>
                        <input
                            type="password"
                            placeholder={diccionario?.["API Key placeholder"]}
                            value={api_key || ""}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: "none", backgroundColor: theme.background, color: theme.text1 }}
                        />
                        <LinkIcon
                            onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
                            className={`link-icon ${!api_key ? "vibrate-icon" : ""}`}
                            sx={{ color: theme.main, cursor: "pointer" }}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "end", alignItems: "center" }}>
                    <Button text={diccionario?.["Generar desde Imagen"] || "Generar desde Imagen"} props={{ disabled: loading || !imageBase64 }} action={processImg} />
                    <Button text={diccionario?.["Generar desde PDF"] || "Generar desde PDF"} props={{ disabled: loading || !pdfBase64 }} action={processPdf} />
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Visualizador de PDF */}
                <div style={{ width: "100%", height: "600px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
                    <embed src="albaran.pdf" type="application/pdf" width="100%" height="100%" />
                </div>

                {/* Formulario generado o Loader de carga */}
                <div ref={spinnerRef}>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                            <Spinner />
                        </div>
                    ) : (
                        response && renderForm()
                    )}
                </div>
            </div>
        </Card>
    );
}