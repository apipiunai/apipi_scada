
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/Card';
import Select from '../../components/Select';
import Desplegable from '../../components/Desplegable';
import PDF from '../../components/PDF';
import Excel from '../../components/Excel';
import DownloadIcon from '@mui/icons-material/Download';
import Gemini from '../../components/Gemini';

export default function AlarmsTable() {
    const { theme } = useTheme();
    const [alarms, setAlarms] = useState([]);
    const [filters, setFilters] = useState({
        maquina: "",
        tipo: "",
        prioridad: "",
        turno: ""
    });

    // Configuración de las columnas disponibles (key: ruta en el objeto, label: nombre amigable)
    const availableKeys = [
        { key: 'id', label: 'ID' },
        { key: 'maquina.nombre', label: 'Máquina' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'estado', label: 'Estado' },
        { key: 'prioridad', label: 'Prioridad' },
        { key: 'tiempos.fecha_inicio', label: 'Inicio' },
        { key: 'turno', label: 'Turno' },
        { key: 'incidencia.categoria', label: 'Categoría' },
        { key: 'incidencia.descripcion', label: 'Incidencia' },
        { key: 'solucion.descripcion', label: 'Solución' }
    ];

    const [selectedKeys, setSelectedKeys] = useState(['id', 'maquina.nombre', 'tipo', 'prioridad', 'incidencia.descripcion']);

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
                                    border: `1px solid ${isSelected ? theme.main1 : theme.border1}`,
                                    backgroundColor: isSelected ? theme.main1 : 'transparent',
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
                <div style={{ display: 'flex', alignItems: '' }}>

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
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>MÁQUINA</label>
                    <Select
                        placeholder="Todas las máquinas"
                        options={getOptions('maquina.nombre')}
                        value={filters.maquina}
                        setValue={(val) => setFilters(f => ({ ...f, maquina: val }))}
                    />
                </div>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>TIPO</label>
                    <Select
                        placeholder="Todos los tipos"
                        options={getOptions('tipo')}
                        value={filters.tipo}
                        setValue={(val) => setFilters(f => ({ ...f, tipo: val }))}
                    />
                </div>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>PRIORIDAD</label>
                    <Select
                        placeholder="Todas"
                        options={getOptions('prioridad')}
                        value={filters.prioridad}
                        setValue={(val) => setFilters(f => ({ ...f, prioridad: val }))}
                    />
                </div>
                <div style={{ flex: 1, }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: theme.text2, marginBottom: '5px', fontWeight: 'bold' }}>TURNO</label>
                    <Select
                        placeholder="Todos"
                        options={getOptions('turno')}
                        value={filters.turno}
                        setValue={(val) => setFilters(f => ({ ...f, turno: val }))}
                    />
                </div>
                <div
                    onClick={() => setFilters({ maquina: "", tipo: "", prioridad: "", turno: "" })}
                    style={{ alignSelf: 'flex-end', paddingBottom: '12px', color: theme.main1, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                    Limpiar
                </div>

            </div>

            <div style={{ overflowX: 'auto', maxHeight: '400px', borderRadius: '8px', border: `1px solid ${theme.border1}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: theme.card }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.border1}`, position: 'sticky', top: 0, backgroundColor: theme.card, zIndex: 10 }}>
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
                                    borderBottom: `1px solid ${theme.border1}`,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.border1 + '30'}
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
