import AlbaranGemini from "./AlbaranGemini";
import FacturaGemini from "./FacturaGemini";
import Tabs from "../../components/Tabs";
import { useState } from "react";

export default function Documents() {

    const [tab, setTab] = useState(0);

    const tabs = ["Albaran", "Factura"]

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
        }}>
            <Tabs tabs={tabs} tab={tab} setTab={setTab} />
            {tab === 0 && <AlbaranGemini />}
            {tab === 1 && <FacturaGemini />}
        </div>
    )
}