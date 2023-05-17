import { useState } from "react";

interface Drawable {
  tool: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  // points: [number, number][];
}

function App() {
  const [tool, setTool] = useState("rectangle");
  const [content, setContent] = useState<Drawable[]>([]);
  const [activeShape, setActiveShape] = useState<Drawable | null>(null);

  const renderFunctions: { [key: string]: (d: Drawable) => JSX.Element } = {
    rectangle: ({ startX, startY, endX, endY }) => {
      const x = startX < endX ? startX : endX;
      const y = startY < endY ? startY : endY;
      const w = startX < endX ? endX - startX : startX - endX;
      const h = startY < endY ? endY - startY : startY - endY;

      return (
        <rect className="fill-emerald-500" x={x} y={y} width={w} height={h} />
      );
    },
    circle: ({ startX, startY, endX, endY }) => {
      const rx = (startX < endX ? endX - startX : startX - endX) / 2;
      const ry = (startY < endY ? endY - startY : startY - endY) / 2;
      const r = Math.max(rx, ry);
      const cx = (startX < endX ? startX : endX) + r;
      const cy = (startY < endY ? startY : endY) + r;

      return <circle className="fill-emerald-500" cx={cx} cy={cy} r={r} />;
    },
    ellipse: ({ startX, startY, endX, endY }) => {
      const rx = (startX < endX ? endX - startX : startX - endX) / 2;
      const ry = (startY < endY ? endY - startY : startY - endY) / 2;
      const cx = (startX < endX ? startX : endX) + rx;
      const cy = (startY < endY ? startY : endY) + ry;

      return (
        <ellipse className="fill-emerald-500" cx={cx} cy={cy} rx={rx} ry={ry} />
      );
    },
    line: ({ startX, startY, endX, endY }) => {
      const x1 = startX;
      const y1 = startY;
      const x2 = endX;
      const y2 = endY;

      return (
        <line
          className="stroke-emerald-500 stroke-1"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      );
    },
    polyline: ({ startX, startY, endX, endY }) => {
      const x1 = startX;
      const y1 = startY;
      const x2 = endX;
      const y2 = endY;

      return (
        <polyline
          className="stroke-emerald-500 stroke-1"
          points={`${x1},${y1} ${x2},${y2}`}
        />
      );
    },
  };

  const onPaneMouseDown: React.MouseEventHandler<SVGSVGElement> = (e) => {
    setActiveShape({
      tool: tool,
      startX: e.nativeEvent.offsetX,
      startY: e.nativeEvent.offsetY,
      endX: e.nativeEvent.offsetX,
      endY: e.nativeEvent.offsetY,
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onPaneMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!activeShape) return;
    setActiveShape({
      ...activeShape,
      endX: e.nativeEvent.offsetX,
      endY: e.nativeEvent.offsetY,
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onPaneMouseUp: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!activeShape) return;

    const { startX, startY, endX, endY } = activeShape;
    if (startX !== endX && startY !== endY) {
      setContent([...content, activeShape]);
    }
    setActiveShape(null);

    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      <main className="flex flex-col">
        <div className="flex flex-row">
          {[
            ["pointer", "Pointer"],
            ["rectangle", "Rectangle"],
            ["circle", "Circle"],
            ["ellipse", "Ellipse"],
            ["line", "Line"],
            ["polyline", "Polyline"],
            ["polygon", "Polygon"],
            ["path", "Path"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`px-4 py-2 font-semibold text-sm ${
                tool === id ? "bg-neutral-400" : "bg-neutral-600"
              } text-white rounded-none shadow-sm`}
              onClick={() => setTool(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <svg
          className="border border-black"
          width="600"
          height="600"
          onMouseDown={onPaneMouseDown}
          onMouseMove={onPaneMouseMove}
          onMouseUp={onPaneMouseUp}
        >
          <g>
            {content.map((element) => renderFunctions[element.tool](element))}
          </g>
          <g>
            {activeShape
              ? renderFunctions[activeShape.tool](activeShape)
              : null}
          </g>
        </svg>
        <p>{tool}</p>
      </main>
    </>
  );
}

export default App;
