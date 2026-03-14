import { useMemo, cloneElement } from "react";
import { useTheme } from "../context/ThemeContext";

export default function IconHover({ icon, action }) {

    const {theme} = useTheme();

    const styledIcon = useMemo(() => {
        return cloneElement(icon, {
            onClick: action,
            sx: {
                color: theme.color1,
                cursor: "pointer",
                borderRadius: "50%",
                padding: "5px",
                transition: "background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: theme.light1,
                },
            }
        });
    }, [icon, action]);

    return styledIcon;
}