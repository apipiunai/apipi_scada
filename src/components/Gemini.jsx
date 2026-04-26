import { useGemini } from "../context/GeminiContext";
import { useWindowSize } from "../context/WindowSize";
import { useState, useRef, useEffect } from "react";
import ClickOut from "../utils/ClickOut";
import { useTheme } from "../context/ThemeContext";
import { useIdioma } from "../context/IdiomaContext";
import LinkIcon from "@mui/icons-material/Link";
import SendIcon from "@mui/icons-material/Send";
import StorageIcon from "@mui/icons-material/Storage";
import { GoogleGenAI } from "@google/genai";
import Spinner from "./Spinner";

export default function Gemini({ data }) {

    const { theme, mode } = useTheme();
    const { diccionario } = useIdioma();
    const { api_key, setApiKey } = useGemini();
    const { width } = useWindowSize();
    const ref = useRef(null);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Auto-scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage() {
        if (input.trim() === "") {
            return;
        }
        if (!api_key) {
            alert(diccionario?.["API Key Gemini"] || "Por favor, introduce tu API Key de Gemini.");
            return;
        }

        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: api_key });

            // ✅ Construir el historial para Gemini (solo roles user/model)
            const history = updatedMessages.slice(0, -1).map((m) => ({
                role: m.role === "assistant" ? "model" : "user" || "data",
                parts: [{ text: m.content }],
            }));

            const chat = ai.chats.create({
                model: "gemini-3-flash-preview",
                history,
                config: { "systemInstruction": "eres un asistente de texto que ayuda al usuario a responder preguntas sobre sus datos. ten en cuenta que todo lo que respondas se mostrara en texto plano sin formato html o markdown" },
            });

            const res = await chat.sendMessage({ message: input });

            setMessages((v) => [...v, { role: "assistant", content: res.text }]);
        } catch (err) {
            setMessages((v) => [...v, { role: "error", content: err.message }]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    const [data_already_loaded, setDataAlreadyLoaded] = useState(false);

    const handleCargarDatos = () => {
        if (data_already_loaded) {
            return;
        }
        console.log(data);
        setMessages((v) => [...v, { role: "data", content: JSON.stringify(data, null, 2) }]);
        setDataAlreadyLoaded(true);
    }

    return (
        <div>
            <img
                onClick={() => { setOpen((v) => !v); handleCargarDatos(); }}
                src={mode === "dark" ? "gemini.png" : "gemini_dark.png"}
                height={25}
                width={25}
                alt="Gemini"
                style={{ cursor: "pointer" }}
            />

            <ClickOut ref={ref} action={() => setOpen(false)}>
                {open && (
                    <div
                        ref={ref}
                        style={width > 600 ? {
                            position: "absolute", right: 0, top: 0,
                            height: "100%", width: "400px",
                            background: theme.background, zIndex: 9999,
                            borderLeft: `1px solid ${theme.border}`,
                            display: "flex", flexDirection: "column",
                        } : {
                            position: "absolute", bottom: 0, left: 10,
                            height: "calc(100% - 10px)", width: "calc(100% - 20px)",
                            background: theme.background, zIndex: 9999,
                            border: `1px solid ${theme.border}`,
                            display: "flex", flexDirection: "column",
                            borderRadius: "10px 10px 0 0",
                        }}
                    >

                        {/* Input API Key */}
                        <div style={{ padding: "10px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                            <input
                                type="password"
                                placeholder={diccionario?.["API Key placeholder"] || "API Key de Gemini..."}
                                value={api_key}
                                onChange={(e) => setApiKey(e.target.value)}
                                style={{ flex: 1, padding: "8px", borderRadius: 4, border: "none", background: theme.card, color: theme.text1, fontSize: 12 }}
                            />
                            <LinkIcon
                                onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
                                className={`link-icon ${!api_key ? "vibrate-icon" : ""}`}
                                sx={{ color: theme.light1, cursor: "pointer" }}
                            />
                        </div>

                        {/* Mensajes */}
                        <div style={{ flex: 1, overflowY: "auto", padding: "20px 10px", display: "flex", flexDirection: "column", gap: 10, background: theme.card }}>

                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    style={{
                                        alignSelf: m.role === "assistant" ? "flex-start" : "flex-end",
                                        backgroundColor: m.role === "user" ? theme.main : m.role === "data" ? theme.background : m.role === "error" ? theme.error : theme.background,
                                        color: m.role === "user" || m.role === "data" || m.role === "error" ? "#fff" : theme.text1,
                                        borderRadius: 4,
                                        padding: "6px 8px",
                                        maxWidth: "80%",
                                        fontSize: 12,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {m.role === "data" ? <span style={{ color: theme.light1, display: "flex", alignItems: "center", gap: "5px" }}><StorageIcon sx={{ fontSize: 16 }} /> {diccionario?.Data || "Data"}</span> : m.content}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: "center", color: theme.light1, fontSize: 13 }}>
                                    <Spinner size={20} />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>



                        {/* Input mensaje */}
                        <div style={{ padding: "10px", display: "flex", gap: 8, alignItems: "center" }}>
                            <textarea
                                rows={1}
                                placeholder={diccionario?.["Pregunta datos"] || "Pregunta sobre tus datos..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ flex: 1, padding: "8px", borderRadius: 8, border: `none`, background: theme.card, color: theme.text1, resize: "none", fontSize: 12 }}
                            />
                            <SendIcon
                                onClick={sendMessage}
                                sx={{ color: input.trim() ? "#6366f1" : theme.light1, cursor: "pointer", transition: "color 0.2s" }}
                            />
                        </div>
                    </div>
                )}
            </ClickOut>

            <style>{`
                @keyframes vibrateSoft {
                    0%   { transform: rotate(-45deg) scale(1); }
                    50%  { transform: rotate(-45deg) scale(1.1); filter: drop-shadow(0 0 8px #6366f1); }
                    100% { transform: rotate(-45deg) scale(1); }
                }
                .link-icon { transform: rotate(-45deg); }
                .vibrate-icon { animation: vibrateSoft 1.2s infinite ease-in-out; }
                .vibrate-icon:hover { animation-play-state: paused; }
            `}</style>
        </div>
    );
}