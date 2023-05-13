import { useState } from "react";

interface Rectangle {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Ellipse {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
interface Drawable {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
function drawRect(rect: Rectangle) {
  return (
    <rect
      className="fill-emerald-500"
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
    />
  );
}

function drawableToRectangle({
  startX,
  startY,
  endX,
  endY,
}: Drawable): Rectangle | null {
  if (startX === endX || startY == endY) return null;
  return {
    type: "rectangle",
    x: startX < endX ? startX : endX,
    y: startY < endY ? startY : endY,
    width: startX < endX ? endX - startX : startX - endX,
    height: startY < endY ? endY - startY : startY - endY,
  };
}
function drawEllipse({ cx, cy, rx, ry }: Ellipse) {
  return (
    <ellipse className="fill-emerald-500" cx={cx} cy={cy} rx={rx} ry={ry} />
  );
}
function drawableToEllipse({
  startX,
  startY,
  endX,
  endY,
}: Drawable): Ellipse | null {
  if (startX === endX || startY == endY) return null;

  const rx = (startX < endX ? endX - startX : startX - endX) / 2;
  const ry = (startY < endY ? endY - startY : startY - endY) / 2;
  return {
    type: "ellipse",
    rx: rx,
    ry: ry,
    cx: (startX < endX ? startX : endX) + rx,
    cy: (startY < endY ? startY : endY) + ry,
  };
}

function App() {
  const [tool, setTool] = useState("rectangle");
  const [content, setContent] = useState<(Rectangle | Ellipse)[]>([]);
  const [overlay, setOverlay] = useState<Drawable | null>(null);

  const functions: {
    [key: string]: (d: Drawable) => Rectangle | Ellipse | null;
  } = {
    rectangle: drawableToRectangle,
    ellipse: drawableToEllipse,
  };
  const functions2: {
    [key: string]: (d: any) => JSX.Element;
  } = {
    rectangle: drawRect,
    ellipse: drawEllipse,
  };
  const drawing = overlay ? functions[tool](overlay) : null;

  const onPaneMouseDown: React.MouseEventHandler<SVGSVGElement> = (e) => {
    setOverlay({
      startX: e.nativeEvent.offsetX,
      startY: e.nativeEvent.offsetY,
      endX: e.nativeEvent.offsetX,
      endY: e.nativeEvent.offsetY,
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onPaneMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!overlay) return;
    setOverlay({
      ...overlay,
      endX: e.nativeEvent.offsetX,
      endY: e.nativeEvent.offsetY,
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const onPaneMouseUp: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!overlay) return;

    if (drawing) {
      setContent([...content, drawing]);
    }
    setOverlay(null);

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
          <g>{content.map((element) => functions2[element.type](element))}</g>
          <g>{drawing ? functions2[drawing.type](drawing) : null}</g>
        </svg>
        <p>{tool}</p>
      </main>
    </>
  );
}

export default App;
