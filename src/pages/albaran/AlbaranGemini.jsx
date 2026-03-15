import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import Card from "../../components/Card";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import LinkIcon from '@mui/icons-material/Link';
import { useTheme } from "../../context/ThemeContext";
import { useGemini } from "../../context/GeminiContext";

export default function AlbaranGemini() {

    const { theme } = useTheme();
    const { apiKey, setApiKey } = useGemini();
    const [response, setResponse] = useState("");
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
    "nombre": "Empresa SL",
    "direccion": "Calle de la Empresa, 1",
    "codigo_postal": "50003",
    "localidad": "Zaragoza",
    "provincia": "Zaragoza",
    "pais": "España",
    "telefono": "971233456",
    "email": "empresa@sl.com",
    "nif": "B00000001"
  },
  "receptor": {
    "nombre": "Sociedad Limitada SL",
    "direccion": "Gan Via, 1",
    "codigo_postal": "28013",
    "localidad": "Madrid",
    "provincia": "Madrid",
    "pais": "España",
    "telefono": "911233344",
    "email": "sociedad.limitada@sl.com",
    "nif": "B01234567"
  },
  "detalles_albaran": {
    "numero": "AL-2020-0001",
    "fecha": "16/12/2020"
  },
  "lineas_detalle": [
    {
      "sku": "SKU000002",
      "descripcion": "Pantalón Génova rayas. Color crema. Recto, pana",
      "unidades": 20,
      "precio_unitario": 15.00,
      "descuento": "20%",
      "base_total": 240.00,
      "iva_porcentaje": "21%",
      "iva_importe": 50.40
    },
    {
      "sku": "SKU000008",
      "descripcion": "Abrigo Polo Norte. Relleno 50% pluma, 50% plumón",
      "unidades": 10,
      "precio_unitario": 80.00,
      "descuento": "30%",
      "base_total": 560.00,
      "iva_porcentaje": "21%",
      "iva_importe": 117.60
    },
    {
      "sku": "SKU000009",
      "descripcion": "Bufanda Pirenaica. 100% lana, estampados de bolas de nieve",
      "unidades": 40,
      "precio_unitario": 7.00,
      "descuento": "0%",
      "base_total": 280.00,
      "iva_porcentaje": "21%",
      "iva_importe": 58.80
    },
    {
      "sku": "SKU000001",
      "descripcion": "Jersey Navidad. 100% lana, estampados navideños",
      "unidades": 10,
      "precio_unitario": 12.00,
      "descuento": "0%",
      "base_total": 120.00,
      "iva_porcentaje": "21%",
      "iva_importe": 25.20
    },
    {
      "sku": "SKU000007",
      "descripcion": "Calcetines Sevilla. Estampado en topos de colores",
      "unidades": 60,
      "precio_unitario": 5.00,
      "descuento": "0%",
      "base_total": 300.00,
      "iva_porcentaje": "21%",
      "iva_importe": 63.00
    }
  ],
  "totales": {
    "base_imponible_total": 1500.00,
    "iva_total": 315.00,
    "gran_total": 1815.00,
    "moneda": "EUR"
  }
}`

    async function processImg() {
        if (!imageBase64) return;
        if (!apiKey) {
            alert("Por favor, introduce tu API Key de Gemini.");
            return;
        }

        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey });
            const res = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `haz un objeto json como esta referencia: ${ofjeto_referencia} no incluyas nada mas. unicamente desde "{" hasta "}".`
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
        } catch (err) {
            setResponse("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function processPdf() {
        if (!pdfBase64) return;
        if (!apiKey) {
            alert("Por favor, introduce tu API Key de Gemini.");
            return;
        }

        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey });
            const res = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `haz un objeto json como esta referencia: ${ofjeto_referencia} no incluyas nada mas. unicamente desde "{" hasta "}".`
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
        } catch (err) {
            setResponse("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

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
                            placeholder="API Key de Gemini..."
                            value={apiKey || ""}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: "none", backgroundColor: theme.back3 }}
                        />
                        <LinkIcon 
                            onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")} 
                            className={`link-icon ${!apiKey ? "vibrate-icon" : ""}`}
                            sx={{ color: theme.light1, cursor: "pointer" }} 
                        />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "end", alignItems: "center" }}>
                    <Button text="Generar desde Imagen" props={{ disabled: loading || !imageBase64 }} action={processImg} />
                    <Button text="Generar desde PDF" props={{ disabled: loading || !pdfBase64 }} action={processPdf} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <embed src="albaran.pdf" type="application/pdf" width="100%" height="600px" />
            </div>

            {loading ? <div ref={spinnerRef} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", margin: "10px" }}><Spinner /></div> : <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>}
        </Card>
    );
}