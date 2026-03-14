import { useTheme } from "../context/ThemeContext"; 


export default function Button({ props, text, action }) {
    const { theme } = useTheme();
    return (
        <button onClick={action} style={{padding: "10px 20px", borderRadius: "5px", border: "none", cursor: "pointer", backgroundColor: theme.main1, color: "white", ...props}}>{text}</button>
    )
}