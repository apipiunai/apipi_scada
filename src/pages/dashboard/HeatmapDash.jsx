import HeatMap from "../../components/HeatMap";
import { useTheme } from "../../context/ThemeContext";

export default function HeatmapDash() {
    const { theme } = useTheme();
    return (
        <div>
            <HeatMap colors={[theme.error, theme.warning, theme.main]} />
        </div>
    );
}