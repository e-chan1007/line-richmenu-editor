import { EditingRichMenuContext } from "contexts/EditingRichMenuContext";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";

export default function TapAreaController(
  { bounds, setBounds, readonly = false, width: viewWidth = 640 }
  : {
    bounds: (number|boolean)[],
    setBounds?: React.Dispatch<React.SetStateAction<(number|boolean)[]>>,
    readonly?: boolean,
    width?: number,
  }
) {
  const { menuImage } = useContext(EditingRichMenuContext);
  const [diffColor, setDiffColor] = useState(["black", "black", "black", "black"]);
  const [viewBounds, setViewBounds] = useState([0, 0, viewWidth, 128]);
  const [viewHeight, setViewHeight] = useState(0);
  const canvas = useRef<HTMLCanvasElement>();
  const adjustAndSetBounds = (_rect: number[]) => {
    const newBounds = _rect.map(v => Math.round(v * ((menuImage.image.width || viewWidth) / viewWidth)));
    if (newBounds[2] > menuImage.image.width - newBounds[0]) newBounds[2] = menuImage.image.width - newBounds[0];
    if (newBounds[3] > menuImage.image.height - newBounds[1]) newBounds[3] = menuImage.image.height - newBounds[1];
    setBounds(newBounds);
  };
  const handleDragNW: DraggableEventHandler = (_, position) => {
    const newBounds = [
      position.x,
      position.y,
      viewBounds[2] - position.deltaX,
      viewBounds[3] - position.deltaY
    ];
    setViewBounds(newBounds);
    adjustAndSetBounds(newBounds);
  };
  const handleDragNE: DraggableEventHandler = (_, position) => {
    const newBounds = [
      viewBounds[0],
      position.y,
      position.x - viewBounds[0],
      viewBounds[3] - position.deltaY
    ];
    setViewBounds(newBounds);
    adjustAndSetBounds(newBounds);
  };
  const handleDragSW: DraggableEventHandler = (_, position) => {
    const newBounds = [
      position.x,
      viewBounds[1],
      viewBounds[2] - position.deltaX,
      position.y - viewBounds[1]
    ];
    setViewBounds(newBounds);
    adjustAndSetBounds(newBounds);
  };
  const handleDragSE: DraggableEventHandler = (_, position) => {
    const newBounds = [
      viewBounds[0],
      viewBounds[1],
      position.x - viewBounds[0],
      position.y - viewBounds[1]
    ];
    setViewBounds(newBounds);
    adjustAndSetBounds(newBounds);
  };
  const handleDragBox: DraggableEventHandler = (_, position) => {
    const newBounds = [...viewBounds];
    newBounds[0] = position.x;
    newBounds[1] = position.y;
    setViewBounds(newBounds);
    adjustAndSetBounds(newBounds);
  };
  const calcDiffColor = useCallback((context: CanvasRenderingContext2D) => {
    if (context) {
      setDiffColor([
        context.getImageData(viewBounds[0], viewBounds[1], 16, 16),
        context.getImageData(viewBounds[0] + viewBounds[2], viewBounds[1], -16, 16),
        context.getImageData(viewBounds[0], viewBounds[1] + viewBounds[3], 16, -16),
        context.getImageData(viewBounds[0] + viewBounds[2], viewBounds[1] + viewBounds[3], -16, -16)
      ].map(({ data }) => (
        data.map((_, i) => i)
          .filter((_, i) => !(i % 4))
          .map(i => [data[i], data[i + 1], data[i + 2]].reduce((acc, cur) => acc + cur) / 3 / 2.55)
          .reduce((accumrator, brightness) => accumrator + brightness) / (data.length / 4) < 55 ? "white" : "black")));
    }
  }, [viewBounds]);

  useEffect(() => {
    if (menuImage.image && canvas.current) {
      setViewHeight(menuImage.image.height * (viewWidth / menuImage.image.width));
      canvas.current.width = viewWidth;
      canvas.current.height = viewHeight;
      const context = canvas.current.getContext("2d");
      context.drawImage(menuImage.image, 0, 0, viewWidth, viewHeight);
      calcDiffColor(context);
    }
  }, [calcDiffColor, canvas, menuImage, menuImage.image, viewHeight]);
  useEffect(() => {
    if (menuImage.image && canvas.current) {
      const context = canvas.current.getContext("2d");
      calcDiffColor(context);
    }
  }, [viewBounds, menuImage, menuImage.image, canvas, calcDiffColor]);
  useEffect(() => {
    if (bounds[4]) {
      const newBounds = (bounds[0] === -1) ? [0, 0, menuImage.image.width, menuImage.image.height]: bounds
        .slice(0, 4)
        .map(v => Number.isNaN(v)? 0 : v) as number[];
      if (bounds[0] === -1) setBounds([...newBounds, true]);
      setViewBounds([...newBounds].map(v => Math.round(v / ((menuImage.image.width || viewWidth) / viewWidth))));
    }
  }, [bounds]);
  useEffect(() => {
    if (bounds[0] === -1) setBounds([0, 0, menuImage.image.width, menuImage.image.height, true]);
  }, []);
  return (
    <>
      <div style={{
        width: `${viewWidth}px`,
        height: `${viewHeight}px`,
        position: "relative",
        overflow: "hidden"
      }}>
        <canvas ref={canvas} style={{
          position: "absolute",
          pointerEvents: "none",
          width: `${viewWidth}px`,
          height: `${viewHeight}px`
        }} />
        <svg width={viewWidth} height="100%" xmlns="http://www.w3.org/2000/svg" style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}>
          <defs>
            <mask id="outsideBoundsMask">
              <rect x="0" y="0" width="100%" height="100%" fill="white"/>
              <rect x={viewBounds[0]} y={viewBounds[1]} width={viewBounds[2]} height={viewBounds[3]}/>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="#000000AA"
            mask="url(#outsideBoundsMask)"/>
        </svg>
        {!readonly && (<>
          <Draggable
            position={{
              x: viewBounds[0],
              y: viewBounds[1]
            }}
            onDrag={handleDragBox}
            bounds={{
              left: 0,
              top: 0,
              right: viewWidth - viewBounds[2],
              bottom: viewHeight - viewBounds[3]
            }}>
            <div style={{
              position: "absolute",
              width: `${viewBounds[2]}px`,
              height: `${viewBounds[3]}px`,
              cursor: "move",
              boxSizing: "border-box"
            }}></div>
          </Draggable>
          <Draggable
            bounds={{
              left: 0,
              top: 0,
              right: viewBounds[0] + viewBounds[2] - 32,
              bottom: viewBounds[1] + viewBounds[3] - 32
            }}
            position={{
              x: viewBounds[0],
              y: viewBounds[1]
            }}
            positionOffset={{
              x: 0,
              y: 0
            }}
            onDrag={handleDragNW}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16" style={{
              display: "block",
              cursor: "nw-resize"
            }}>
              <polygon points="0,0 16,0 16,3 3,3 3,16 0,16" fill={diffColor[0]} />
            </svg>
          </Draggable>
          <Draggable
            bounds={{
              left: viewBounds[0] + 32,
              top: 0,
              right: viewWidth,
              bottom: viewBounds[1] + viewBounds[3] - 32
            }}
            position={{
              x: viewBounds[0] + viewBounds[2],
              y: viewBounds[1]
            }}
            positionOffset={{
              x: -16,
              y: -16
            }}
            onDrag={handleDragNE}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16" style={{
              display: "block",
              cursor: "ne-resize"
            }}>
              <polygon points="0,0 16,0 16,16 13,16 13,3 0,3" fill={diffColor[1]} />
            </svg>
          </Draggable>
          <Draggable
            bounds={{
              left: 0,
              top: viewBounds[1] + 32,
              right: viewBounds[0] + viewBounds[2] - 32,
              bottom: viewHeight
            }}
            position={{
              x: viewBounds[0],
              y: viewBounds[1] + viewBounds[3]
            }}
            positionOffset={{
              x: 0,
              y: -48
            }}
            onDrag={handleDragSW}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16" style={{
              display: "block",
              cursor: "sw-resize"
            }}>
              <polygon points="0,0 3,0 3,13 16,13 16,16 0,16" fill={diffColor[2]} />
            </svg>
          </Draggable>
          <Draggable
            bounds={{
              left: viewBounds[0] + 32,
              top: viewBounds[1] + 32,
              right: viewWidth,
              bottom: viewHeight
            }}
            position={{
              x: viewBounds[0] + viewBounds[2],
              y: viewBounds[1] + viewBounds[3]
            }}
            positionOffset={{
              x: -16,
              y: -64
            }}
            onDrag={handleDragSE}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16" style={{
              display: "block",
              cursor: "se-resize"
            }}>
              <polygon points="13,0 16,0 16,16 0,16 0,13 13,13" fill={diffColor[3]} />
            </svg>
          </Draggable>
        </>
        )}
      </div>
    </>
  );
}
