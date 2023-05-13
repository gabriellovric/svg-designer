import { useState } from "react";

interface Rectangle {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}
function drawRect(rect: Rectangle) {
  return (
    <rect
      className="fill-emerald-500"
      x={rect.width < 0 ? rect.x + rect.width : rect.x}
      y={rect.height < 0 ? rect.y + rect.height : rect.y}
      width={Math.abs(rect.width)}
      height={Math.abs(rect.height)}
    />
  );
}

function App() {
  const [tool, setTool] = useState("rectangle");
  const [content, setContent] = useState<Rectangle[]>([]);
  const [overlay, setOverlay] = useState<Rectangle | null>(null);

  const onPaneMouseDown: React.MouseEventHandler<SVGSVGElement> = (e) => {
    setOverlay({
      type: "rect",
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      width: 0,
      height: 0,
    });
  };

  const onPaneMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!overlay) return;
    const [width, height] = [
      e.nativeEvent.offsetX - overlay.x,
      e.nativeEvent.offsetY - overlay.y,
    ];
    setOverlay({ ...overlay, width: width, height: height });
  };

  const onPaneMouseUp: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!overlay) return;

    if (overlay.width !== 0 && overlay.height !== 0) {
      setContent([...content, overlay]);
    }
    setOverlay(null);
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
          <g>{content.map((element) => drawRect(element))}</g>
          <g>{overlay ? drawRect(overlay) : null}</g>
        </svg>
        <p>{tool}</p>
      </main>
    </>
  );
}

export default App;
