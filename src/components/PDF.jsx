import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    table: { 
        display: 'flex',
        flexDirection: 'column',
        width: '100%', 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderRightWidth: 0, 
        borderBottomWidth: 0 
    },
    tableRow: { 
        display: 'flex',
        flexDirection: 'row' 
    },
    tableColHeader: { 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderLeftWidth: 0, 
        borderTopWidth: 0, 
        backgroundColor: '#f0f0f0' 
    },
    tableCol: { 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    },
    tableCellHeader: { 
        margin: 5, 
        fontSize: 10, 
        fontWeight: 'bold' 
    },
    tableCell: { 
        margin: 5, 
        fontSize: 8 
    }
});

export default function PDF({ headers = [], data = [] }) {
    const PDFDocument = () => {
        const colWidth = headers.length > 0 ? `${100 / headers.length}%` : '100%';

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.table}>
                        {/* Cabecera */}
                        <View style={styles.tableRow}>
                            {headers.map((header, i) => (
                                <View key={`header-${i}`} style={[styles.tableColHeader, { width: colWidth }]}>
                                    <Text style={styles.tableCellHeader}>
                                        {typeof header === 'object' ? (header.label || header.key) : header}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {/* Filas de datos */}
                        {data.map((row, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={styles.tableRow}>
                                {headers.map((header, colIndex) => {
                                    const key = typeof header === 'object' ? header.key : header;
                                    const value = row[key];
                                    
                                    // Comprobar si es un objeto para serializarlo o formatearlo
                                    let displayValue = "";
                                    if (value !== null && value !== undefined) {
                                        displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                                    }

                                    return (
                                        <View key={`cell-${rowIndex}-${colIndex}`} style={[styles.tableCol, { width: colWidth }]}>
                                            <Text style={styles.tableCell}>{displayValue}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    };

    return (
        <PDFDownloadLink document={<PDFDocument />} fileName="tabla_datos.pdf">
            {() => (
                <img 
                    src="pdf.png" 
                    alt="Descargar PDF" 
                    height={25} 
                    width={25}
                    style={{ 
                        cursor: 'pointer', 
                        transition: 'opacity 0.2s'
                    }} 
                />
            )}
        </PDFDownloadLink>
    );
}

