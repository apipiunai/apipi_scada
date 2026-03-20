import AlarmsTable from "./AlarmsTable";
import GraficoPrensa from "./GraficoPrensa";
import { useIdioma } from "../../context/IdiomaContext";


export default function Dashboard() {
    const { diccionario } = useIdioma();
    return (
        <>
            <h3 >{diccionario?.Alarmas || "Alarmas"}</h3>
            <AlarmsTable />
            <h3>{diccionario?.["Grafico Prensa"] || "Grafico Prensa"}</h3>
            <GraficoPrensa />
        </>
    )
}