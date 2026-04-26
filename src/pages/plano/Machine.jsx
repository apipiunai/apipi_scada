import { useParams } from "react-router-dom";
import ModelViewer from "./ModelViewer";
import { useTheme } from "../../context/ThemeContext";

export default function Machine() {
    const { id } = useParams();
    const { theme } = useTheme();

    const models = ["model1.glb", "model2.glb", "model3.glb", "model4.glb", "model5.glb", "model6.glb", "model7.glb"];

    return (
        <div style={{ padding: '20px', backgroundColor: theme.background }}>
            <h2 style={{ color: theme.text1, marginBottom: '20px' }}>Vista 3D: Zona {parseInt(id) + 1}</h2>
            <ModelViewer model={models[parseInt(id)]} />
        </div>
    )
}