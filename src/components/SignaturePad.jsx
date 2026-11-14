import { useRef, useState } from "react";

/** Minimal touch/mouse signature pad. onChange(dataUrl|null). */
export default function SignaturePad({ onChange, label, clearLabel }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * ref.current.width, y: ((e.clientY - r.top) / r.height) * ref.current.height };
  };
  const down = (e) => {
    drawing.current = true;
    ref.current.setPointerCapture?.(e.pointerId);
    const c = ref.current.getContext("2d");
    const { x, y } = pos(e);
    c.beginPath();
    c.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const c = ref.current.getContext("2d");
    c.lineWidth = 3;
    c.lineCap = "round";
    c.strokeStyle = "#1F2A26";
    const { x, y } = pos(e);
    c.lineTo(x, y);
    c.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setEmpty(false);
    onChange(ref.current.toDataURL("image/png"));
  };
  const clear = () => {
    ref.current.getContext("2d").clearRect(0, 0, ref.current.width, ref.current.height);
    setEmpty(true);
    onChange(null);
  };

  return (
    <div>
      <div className="relative rounded-lg border border-[#DCE4DC]" style={{ background: "#fff" }}>
        <canvas ref={ref} width={600} height={220} aria-label={label} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} className="w-full h-40 touch-none cursor-crosshair rounded-lg" />
        {empty && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: "#8A93A8" }}>{label}</span>}
      </div>
      <button type="button" onClick={clear} className="mt-2 text-[11px] font-bold text-[#56635B] hover:text-[#1F2A26] cursor-pointer">{clearLabel}</button>
    </div>
  );
}
