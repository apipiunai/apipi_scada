import AlarmsTable from "./AlarmsTable";
import GraficoPrensa from "./GraficoPrensa";



export default function Dashboard() {
    return (
        <>
            <h3 >Alarmas</h3>
            <AlarmsTable />
            <h3>Grafico Prensa</h3>
            <GraficoPrensa />
        </>
    )
}