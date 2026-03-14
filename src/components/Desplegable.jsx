import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Desplegable({ icon, children }) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, top: true });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const d = dropdownRef.current.getBoundingClientRect();
    const MARGIN = 8;

    const ideal = t.left + t.width / 2 - d.width / 2;
    const clamped = Math.max(MARGIN, Math.min(ideal, window.innerWidth - d.width - MARGIN));

    setCoords({
      x: clamped,
      top: t.bottom + d.height + MARGIN <= window.innerHeight,
    });
  }, [open]);

  useEffect(() => {
    const close = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const t = triggerRef.current?.getBoundingClientRect();

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{ cursor: "pointer", height: "100%", display: "flex", alignItems: "center" }}
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
      </div>

      {open && t && (
        <div
          ref={dropdownRef}
          style={{
            borderRadius: 10,
            position: "fixed",
            top: coords.top ? t.bottom + 8 : undefined,
            bottom: !coords.top ? window.innerHeight - t.top + 8 : undefined,
            left: coords.x,
            background: theme.back2,
            padding: 20,
            border: `1px solid ${theme.back3}`,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}