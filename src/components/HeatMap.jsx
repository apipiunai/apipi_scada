import {useTheme} from "../context/ThemeContext";
import Card from "./Card";

const d = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    // Genera 20 valores por día con variaciones para dar aspecto realista
    values: Array.from({ length: 20 }, () => {
        const base = Math.floor(Math.random() * 30) + 20; // base 20-50
        const spike = Math.random() > 0.8 ? Math.floor(Math.random() * 40) + 10 : 0; // picos ocasionales
        return base + spike;
    })
}));


export default function HeatMap({ data=d , colors=["red", "yellow", "green"]}) {

    const {theme} = useTheme();

    const allValues = data.flatMap(d => d.values);

    const max = Math.max(...allValues);
    const min = Math.min(...allValues);

    const getColor = (value) => {
        const range = max - min || 1;
        const ratio = (value - min) / range;
        
        // Mapeamos el ratio de 0 (mínimo) a 1 (máximo) 
        // a un valor de Hue (matiz) entre 0 (Rojo) y 120 (Verde).
        const hue = ratio * 120; 
        
        return colors ? `hsl(${hue}, 85%, 50%)` : colors[0];
    };



    return (
        <Card>

        <div style={{ display: "flex",  borderRadius: "10px", overflow: "hidden", gap: "1px"}}>
            {data.map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", flex: 1, gap: "1px" }}>
                    {d.values.map((v, j) => (
                        <div key={j} style={{ backgroundColor: getColor(v), height: 20, display: "flex"}}></div>
                    ))}
                </div>
            ))}
        </div>
            </Card>
    );
}