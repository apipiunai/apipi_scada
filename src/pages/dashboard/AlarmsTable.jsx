
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useIdioma } from '../../context/IdiomaContext';
import Card from '../../components/Card';
import Select from '../../components/Select';
import Desplegable from '../../components/Desplegable';
import PDF from '../../components/PDF';
import Excel from '../../components/Excel';
import DownloadIcon from '@mui/icons-material/Download';
import Gemini from '../../components/Gemini';

export default function AlarmsTable() {
    const { theme } = useTheme();
    const { diccionario } = useIdioma();
    const [alarms, setAlarms] = useState([]);
    const [filters, setFilters] = useState({
        maquina: "",
        tipo: "",
        prioridad: "",
        turno: ""
    });

    // Configuración de las columnas disponibles (key: ruta en el objeto, label: nombre amigable)
    const availableKeys = [
        { key: 'maquina.nombre', label: diccionario?.MAQUINA || 'Máquina' },
        { key: 'tipo', label: diccionario?.TIPO || 'Tipo' },
        { key: 'estado', label: diccionario?.ESTADO || 'Estado' },
        { key: 'prioridad', label: diccionario?.PRIORIDAD || 'Prioridad' },
        { key: 'tiempos.fecha_inicio', label: diccionario?.INICIO || 'Inicio' },
        { key: 'turno', label: diccionario?.TURNO || 'Turno' },
        { key: 'incidencia.categoria', label: diccionario?.CATEGORIA || 'Categoría' },
        { key: 'incidencia.descripcion', label: diccionario?.INCIDENCIA || 'Incidencia' },
        { key: 'solucion.descripcion', label: diccionario?.SOLUCION || 'Solución' }
    ];

    const [selectedKeys, setSelectedKeys] = useState(['maquina.nombre', 'tipo', 'prioridad', 'turno', 'incidencia.categoria']);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}/alarms.json`)
            .then(response => response.json())
            .then(data => setAlarms(data))
            .catch(error => console.error(error))
    }, []);

    const toggleKey = (key) => {
        setSelectedKeys(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Obtener opciones únicas para los filtros
    const getOptions = (key) => {
        const values = alarms.map(alarm => getNestedValue(alarm, key)).filter(Boolean);
        return [...new Set(values)].sort();
    };

    // Aplicar filtros a las alarmas
    const filteredAlarms = alarms.filter(alarm => {
        return (
            (filters.maquina === "" || alarm.maquina.nombre === filters.maquina) &&
            (filters.tipo === "" || alarm.tipo === filters.tipo) &&
            (filters.prioridad === "" || alarm.prioridad === filters.prioridad) &&
            (filters.turno === "" || alarm.turno.toString() === filters.turno)
        );
    });

    // Filtrar las columnas que se deben mostrar
    const activeColumns = availableKeys.filter(col => selectedKeys.includes(col.key));

    const exportData = filteredAlarms.map(alarm => {
        const row = {};
        activeColumns.forEach(col => {
            const value = getNestedValue(alarm, col.key);
            row[col.key] = typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))
                ? new Date(value).toLocaleString()
                : value?.toString() || '-';
        });
        return row;
    });

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'top', gap: '10px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                    {availableKeys.map((item) => {
                        const isSelected = selectedKeys.includes(item.key);
                        return (
                            <div
                                key={item.key}
                                onClick={() => toggleKey(item.key)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    border: `1px solid ${isSelected ? theme.main : theme.border}`,
                                    backgroundColor: isSelected ? theme.main : 'transparent',
                                    color: isSelected ? 'white' : theme.text2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                {item.label}
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'end', flex: 1 }}>

                <Gemini data={alarms} />

                {alarms.length > 0 && <Desplegable icon={<DownloadIcon />}>
                    <>
                        <PDF headers={activeColumns} data={exportData} />
                        <Excel headers={activeColumns} data={exportData} />
                    </>
                </Desplegable>}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>{diccionario?.MAQUINA || "MÁQUINA"}</label>
                    <Select
                        placeholder={diccionario?.["Todas las maquinas"] || "Todas las máquinas"}
                        options={getOptions('maquina.nombre')}
                        value={filters.maquina}
                        setValue={(val) => setFilters(f => ({ ...f, maquina: val }))}
                    />
                </div>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>{diccionario?.TIPO || "TIPO"}</label>
                    <Select
                        placeholder={diccionario?.["Todos los tipos"] || "Todos los tipos"}
                        options={getOptions('tipo')}
                        value={filters.tipo}
                        setValue={(val) => setFilters(f => ({ ...f, tipo: val }))}
                    />
                </div>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>{diccionario?.PRIORIDAD || "PRIORIDAD"}</label>
                    <Select
                        placeholder={diccionario?.Todas || "Todas"}
                        options={getOptions('prioridad')}
                        value={filters.prioridad}
                        setValue={(val) => setFilters(f => ({ ...f, prioridad: val }))}
                    />
                </div>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>{diccionario?.TURNO || "TURNO"}</label>
                    <Select
                        placeholder={diccionario?.Todos || "Todos"}
                        options={getOptions('turno')}
                        value={filters.turno}
                        setValue={(val) => setFilters(f => ({ ...f, turno: val }))}
                    />
                </div>
                <div
                    onClick={() => setFilters({ maquina: "", tipo: "", prioridad: "", turno: "" })}
                    style={{ alignSelf: 'flex-end', paddingBottom: '12px', color: theme.main, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                    {diccionario?.Limpiar || "Limpiar"}
                </div>

            </div>

            <div style={{ overflowX: 'auto', maxHeight: '400px', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: theme.card }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.border}`, position: 'sticky', top: 0, backgroundColor: theme.card, zIndex: 10 }}>
                            {activeColumns.map(col => (
                                <th key={col.key} style={{ padding: '15px 12px', color: theme.text2, fontWeight: '600', fontSize: '0.85rem' }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlarms.map((alarm) => (
                            <tr
                                key={alarm.id}
                                style={{
                                    borderBottom: `1px solid ${theme.border}`,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.border + '30'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {activeColumns.map(col => {
                                    const value = getNestedValue(alarm, col.key);
                                    return (
                                        <td key={col.key} style={{ padding: '15px 12px', fontSize: '0.9rem', color: theme.text1 }}>
                                            {typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))
                                                ? new Date(value).toLocaleString()
                                                : value?.toString() || '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
