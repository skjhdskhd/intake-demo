"use client";
import { useEffect, useRef } from "react";

export default function HouseAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 400;
    const H = 420;
    canvas.width = W;
    canvas.height = H;

    type Dot = { baseX: number; baseY: number; phase: number };
    const dots: Dot[] = [];

    const cx = W / 2;
    const houseW = 164;
    const houseH = 124;
    const wallTop = H / 2 - 10;
    const wallBottom = wallTop + houseH;
    const wallLeft = cx - houseW / 2;
    const wallRight = cx + houseW / 2;
    const roofPeakX = cx;
    const roofPeakY = wallTop - 90;
    const eaveLeft = wallLeft - 8;
    const eaveRight = wallRight + 8;
    const S = 11; // dot spacing

    function dot(x: number, y: number) {
      dots.push({ baseX: Math.round(x), baseY: Math.round(y), phase: Math.random() * Math.PI * 2 });
    }

    function lineDots(x1: number, y1: number, x2: number, y2: number, spacing: number = S) {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.round(dist / spacing);
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        dot(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
      }
    }

    function rectOutline(x: number, y: number, w: number, h: number, spacing: number = S) {
      lineDots(x, y, x + w, y, spacing);         // top
      lineDots(x + w, y, x + w, y + h, spacing); // right
      lineDots(x, y + h, x + w, y + h, spacing); // bottom
      lineDots(x, y, x, y + h, spacing);          // left
    }

    // Left roof slope
    lineDots(roofPeakX, roofPeakY, eaveLeft, wallTop);
    // Right roof slope
    lineDots(roofPeakX, roofPeakY, eaveRight, wallTop);
    // Eave line (top of wall / bottom of roof)
    lineDots(eaveLeft, wallTop, eaveRight, wallTop);

    // Chimney — on left side of roof, above wallTop
    const chimX = cx - 36;
    const chimW = 20;
    const chimBottom = wallTop - 18;
    const chimTop = chimBottom - 36;
    lineDots(chimX, chimTop, chimX + chimW, chimTop);           // top
    lineDots(chimX, chimTop, chimX, chimBottom);                 // left
    lineDots(chimX + chimW, chimTop, chimX + chimW, chimBottom); // right

    // House walls
    lineDots(wallLeft, wallTop, wallLeft, wallBottom);   // left wall
    lineDots(wallRight, wallTop, wallRight, wallBottom); // right wall
    lineDots(wallLeft, wallBottom, wallRight, wallBottom); // floor

    // Door — centered, taller
    const doorW = 32;
    const doorH = 52;
    const doorLeft = cx - doorW / 2;
    const doorTop = wallBottom - doorH;
    rectOutline(doorLeft, doorTop, doorW, doorH, S);
    // Door knob
    dot(doorLeft + doorW - 7, doorTop + doorH / 2);

    // Left window
    const winW = 30;
    const winH = 30;
    const winY = wallTop + 22;
    const win1X = wallLeft + 20;
    rectOutline(win1X, winY, winW, winH, S);
    // Cross dividers
    lineDots(win1X, winY + winH / 2, win1X + winW, winY + winH / 2, S);
    lineDots(win1X + winW / 2, winY, win1X + winW / 2, winY + winH, S);

    // Right window
    const win2X = wallRight - 20 - winW;
    rectOutline(win2X, winY, winW, winH, S);
    lineDots(win2X, winY + winH / 2, win2X + winW, winY + winH / 2, S);
    lineDots(win2X + winW / 2, winY, win2X + winW / 2, winY + winH, S);

    let frame = 0;
    let animId: number;

    function render() {
      ctx!.clearRect(0, 0, W, H);

      // Radial glow behind house
      const glow = ctx!.createRadialGradient(cx, wallTop + houseH / 2, 0, cx, wallTop + houseH / 2, 200);
      glow.addColorStop(0, "rgba(137,207,240,0.07)");
      glow.addColorStop(0.5, "rgba(89,182,235,0.03)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      const t = frame * 0.016;
      const globalBreath = 0.82 + Math.sin(t * 0.8) * 0.18;

      for (const d of dots) {
        const localPulse = 0.65 + Math.sin(t + d.phase) * 0.35;
        const alpha = Math.min(1, localPulse * globalBreath);
        const r = 2.2 + Math.sin(t * 1.2 + d.phase) * 0.5;

        ctx!.beginPath();
        ctx!.arc(d.baseX, d.baseY, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(137,207,240,${alpha.toFixed(3)})`;
        ctx!.fill();
      }

      frame++;
      animId = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", maxWidth: "400px", height: "auto", display: "block", margin: "0 auto" }}
    />
  );
}
