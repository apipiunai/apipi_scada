import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Excel({ headers = [], data = [], fileName = "tabla_datos.xlsx" }) {

    const handleDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        // Configurar cabeceras
        worksheet.columns = headers.map(header => {
            const key = typeof header === 'object' ? header.key : header;
            const label = typeof header === 'object' ? (header.label || header.key) : header;
            return {
                header: label,
                key: key,
                width: 20
            };
        });

        // Estilos de cabecera
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0F0F0' }
        };

        // Añadir datos
        data.forEach(row => {
            const rowData = {};
            headers.forEach(header => {
                const key = typeof header === 'object' ? header.key : header;
                let value = row[key];
                
                // Formatear arrays u objetos
                if (value !== null && value !== undefined && typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                
                rowData[key] = value;
            });
            worksheet.addRow(rowData);
        });

        // Generar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
    };

    return (
        <img 
            src="excel.png" 
            alt="Descargar Excel" 
            height={25} 
            width={25}
            onClick={handleDownload}
            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
        />
    );
}