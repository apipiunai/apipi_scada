import { useTheme } from '../context/ThemeContext';

export default function Spinner({ size = 40, color }) {
    const { theme } = useTheme();

    const spinnerColor = color || theme.main1;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <div
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    border: `4px solid ${theme.border1}`,
                    borderTop: `4px solid ${spinnerColor}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
        </div>
    );
}
