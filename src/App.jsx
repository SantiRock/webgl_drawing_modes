import { useState, useEffect } from "react";
import "./App.css";

const Btn = ({handler, text, isActive}) => {
  return (
    <button
      onClick={handler}
      style={{backgroundColor: isActive ? 'rgb(26,230,179)' : 'rgb(26,179,230)'}}
    >{text}</button>
  )
}

const Canvas = ({id, text}) => {
  return(
    <div className="item">
      <canvas id={id}></canvas>
      <p>{text}</p>
    </div>
  )
}


function App() {
  const [activeBtn, setActiveBtn] = useState('2D-1');
  const [active2D, setActive2D] = useState(true);
  const [active3D, setActive3D] = useState(false);
  const [scriptActuales, setScriptActuales] = useState([
    "./js/2d_1/points.js",
    "./js/2d_1/lines.js",
    "./js/2d_1/line_strip.js",
    "./js/2d_1/line_loop.js",
    "./js/2d_1/triangles.js",
    "./js/2d_1/triangle_strip.js",
    "./js/2d_1/triangle_fan.js"
  ]);
  

  const cargarScripts = (srcArray) => {
    const cleanupFunctions = [];

    srcArray.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);

      const cleanup = () => {
        const scriptToRemove = document.querySelector(`script[src="${src}"]`);
        if (scriptToRemove) {
          document.body.removeChild(scriptToRemove);
        }
      };
      cleanupFunctions.push(cleanup);
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  };

  useEffect(() => {

    const timeoutId = setTimeout(() => {
      const cleanup = cargarScripts(scriptActuales);
      return cleanup;
    }, 100);

    return () => clearTimeout(timeoutId);

  }, []);

  useEffect(() => {
    if (scriptActuales.length > 0) {
      const cleanup = cargarScripts(scriptActuales);
      return cleanup;
    }
  }, [scriptActuales]);

  const handle2d_1 = () => {
    setActiveBtn('2D-1');
    setActive2D(true);
    setActive3D(false);
    setScriptActuales([
      "./js/2d_1/points.js",
      "./js/2d_1/lines.js",
      "./js/2d_1/line_strip.js",
      "./js/2d_1/line_loop.js",
      "./js/2d_1/triangles.js",
      "./js/2d_1/triangle_strip.js",
      "./js/2d_1/triangle_fan.js"
    ])
  };
    
  const handle2d_2 = () => {
    setActiveBtn('2D-2');
    setActive2D(true);
    setActive3D(false);
    setScriptActuales([
      "./js/2d_2/points.js",
      "./js/2d_2/lines.js",
      "./js/2d_2/line_strip.js",
      "./js/2d_2/line_loop.js",
      "./js/2d_2/triangles.js",
      "./js/2d_2/triangle_strip.js",
      "./js/2d_2/triangle_fan.js"
    ])
  };

  const handle3d_1 = () => {
    setActiveBtn('3D-1');
    setActive2D(false);
    setActive3D(true);
    setScriptActuales([
      "./js/3d_1/points.js",
      "./js/3d_1/lines.js",
      "./js/3d_1/line_strip.js",
      "./js/3d_1/line_loop.js",
      "./js/3d_1/triangles.js",
      "./js/3d_1/triangle_strip.js",
      "./js/3d_1/triangle_fan.js"
    ])
  };

  const handle3d_2 = () => {
    setActiveBtn('3D-2');
    setActive2D(false);
    setActive3D(true);
    setScriptActuales([
      "./js/3d_2/points.js",
      "./js/3d_2/lines.js",
      "./js/3d_2/line_strip.js",
      "./js/3d_2/line_loop.js",
      "./js/3d_2/triangles.js",
      "./js/3d_2/triangle_strip.js",
      "./js/3d_2/triangle_fan.js"
    ])
  };

  const handle3d_3 = () => {
    setActiveBtn('3D-3');
    setActive2D(false);
    setActive3D(true);
    setScriptActuales([
      "./js/3d_3/points.js",
      "./js/3d_3/lines.js",
      "./js/3d_3/line_strip.js",
      "./js/3d_3/line_loop.js",
      "./js/3d_3/triangles.js",
      "./js/3d_3/triangle_strip.js",
      "./js/3d_3/triangle_fan.js"
    ])
  };

  return (
    <section className="section">
      <div className="buttons_nav">
        <Btn handler={handle2d_1} text={"2D-1"} isActive={activeBtn === '2D-1'} />
        <Btn handler={handle2d_2} text={"2D-2"} isActive={activeBtn === '2D-2'} />
        <Btn handler={handle3d_1} text={"3D-1"} isActive={activeBtn === '3D-1'} />
        <Btn handler={handle3d_2} text={"3D-2"} isActive={activeBtn === '3D-2'} />
        <Btn handler={handle3d_3} text={"3D-3"} isActive={activeBtn === '3D-3'} />
      </div>

      {active2D && (
            <div className="container">
            <Canvas id={"_2Dpoints"} text={"gl.POINTS"} />
            <Canvas id={"_2Dlines"} text={"gl.LINES"} />
            <Canvas id={"_2Dline_strip"} text={"gl.LINE_STRIP"} />
            <Canvas id={"_2Dline_loop"} text={"gl.LINE_LOOP"} />
            <Canvas id={"_2Dtriangles"} text={"gl.TRIANGLES"} />
            <Canvas id={"_2Dtriangle_strip"} text={"gl.TRIANGLE_STRIP"} />
            <Canvas id={"_2Dtriangle_fan"} text={"gl.TRIANGLE_FAN"} />
          </div>
      )}

      {active3D && (
            <div className="container">
            <Canvas id={"_3Dpoints"} text={"gl.POINTS"} />
            <Canvas id={"_3Dlines"} text={"gl.LINES"} />
            <Canvas id={"_3Dline_strip"} text={"gl.LINE_STRIP"} />
            <Canvas id={"_3Dline_loop"} text={"gl.LINE_LOOP"} />
            <Canvas id={"_3Dtriangles"} text={"gl.TRIANGLES"} />
            <Canvas id={"_3Dtriangle_strip"} text={"gl.TRIANGLE_STRIP"} />
            <Canvas id={"_3Dtriangle_fan"} text={"gl.TRIANGLE_FAN"} />
          </div>
      )}
  
    </section>
  );
}

export default App;
