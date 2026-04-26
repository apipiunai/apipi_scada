import { useTheme } from "../context/ThemeContext";


export default function Tabs({ tabs, tab, setTab }) {
    const { theme } = useTheme();
    return (
        <div style={{ display: "flex" }}>
            {tabs.map((t, i) => (
                <div key={i} onClick={() => setTab(i)} style={{ padding: 10, cursor: "pointer", borderBottom: tab === i ? `3px solid ${theme.main}` : "3px solid transparent" }}>
                    {t}
                </div>
            ))}
        </div>
    )
}