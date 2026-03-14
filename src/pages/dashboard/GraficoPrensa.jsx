import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import Card from "../../components/Card";
import { useTheme } from "../../context/ThemeContext";
import PDF from "../../components/PDF";
import Excel from "../../components/Excel";
import Desplegable from "../../components/Desplegable";
import Gemini from "../../components/Gemini";
import DownloadIcon from '@mui/icons-material/Download';
import { useWindowSize } from '../../context/WindowSize';

export default function GraficoPrensa() {
    const { theme } = useTheme();
    const [data, setData] = useState([]);

    const {width} = useWindowSize();

    useEffect(() => {
        fetch('/press.json')
            .then(response => response.json())
            .then(json => {
                // Formatear datos para Recharts
                const formattedData = json.map(item => ({
                    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    presion: item.sensores.presion.valor,
                    temperatura: item.sensores.temperatura_aceite.valor,
                    vibracion: item.sensores.vibracion.rms
                }));
                setData(formattedData);
            })
            .catch(error => console.error("Error fetching press data:", error));
    }, []);

    return (
        <Card props={{ marginTop: '20px' }}>
           
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: theme.text1 }}>Press-A</h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.main1 }}></div>
                        <span style={{ fontSize: '0.8rem', color: theme.text2 }}>Presión (bar)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4caf50' }}></div>
                        <span style={{ fontSize: '0.8rem', color: theme.text2 }}>Temp (°C)</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <Gemini /> */}
                {data.length > 0 && <Desplegable icon={<DownloadIcon />}>
                <>
                    <PDF headers={Object.keys(data[0])} data={data} />
                    <Excel headers={Object.keys(data[0])} data={data} />
                </>
                </Desplegable>}
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPresion" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.main1} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={theme.main1} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.border1} />
                        <XAxis
                            dataKey="time"
                            stroke={theme.text2}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke={theme.text2}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                            hide={width < 600}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.card,
                                border: `1px solid ${theme.border1}`,
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ fontSize: '0.85rem' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="presion"
                            stroke={theme.main1}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPresion)"
                            name="Presión (bar)"
                        />
                        <Area
                            type="monotone"
                            dataKey="temperatura"
                            stroke="#4caf50"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                            name="Temperatura (°C)"
                        />
                    </AreaChart>
                </ResponsiveContainer>

            </div>
        </Card>
    );
}