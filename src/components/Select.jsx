import { useTheme } from "../context/ThemeContext";

export default function Select({ options, value = "", placeholder = "select an option", setValue }) {
    const { theme } = useTheme();
    return (
        <>
            <style>{`
                select.kentu-custom-select {
                    appearance: base-select;
                    flex: 1;
                    border: 1px solid ${theme.border};
                    padding: 10px 15px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-wrap: nowrap;
                    cursor: pointer;
                    background-color: ${theme.card};
                    color: ${theme.text1};
                    font-size: 0.9rem;
                    outline: none;
                }
                
                select.kentu-custom-select:hover,
                select.kentu-custom-select:focus {
                    background: ${theme.card};
                    border-color: ${theme.main};
                }
                
                select.kentu-custom-select::picker-icon {
                    color: ${theme.text2};
                    transition: 0.4s rotate;
                }
                
                select.kentu-custom-select:open::picker-icon {
                    rotate: 180deg;
                }
                
                ::picker(select.kentu-custom-select) {
                    appearance: base-select;
                    border: 1px solid ${theme.border};
                    border-radius: 8px;
                    opacity: 0;
                    transition: all 0.3s allow-discrete;
                    top: calc(anchor(bottom) + 5px);
                    background-color: ${theme.card};
                    padding: 5px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                :open::picker(select.kentu-custom-select) {
                    opacity: 1;
                }
                
                @starting-style {
                    :open::picker(select.kentu-custom-select) {
                        opacity: 0;
                    }
                }
                
                select.kentu-custom-select option {
                    display: flex;
                    justify-content: flex-start;
                    gap: 20px;
                    background: transparent;
                    color: ${theme.text1};
                    padding: 10px 15px;
                    transition: 0.2s;
                    border-radius: 5px;
                    margin: 2px 0;
                }
                
                select.kentu-custom-select option:hover {
                    background-color: ${theme.border}50;
                }

                select.kentu-custom-select option:checked {
                    background-color: ${theme.main};
                    color: white;
                }
            `}</style>
            <select className="kentu-custom-select" onChange={(e) => setValue(e.target.value)} value={value}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option key={index} value={typeof option === 'object' ? option.value : option}>
                        {typeof option === 'object' ? option.label : option}
                    </option>
                ))}
            </select>
        </>
    );
}