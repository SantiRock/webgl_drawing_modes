import { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [activeBtn, setActiveBtn] = useState('2D-1');
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
        const scriptToRemove = document.querySelector(`srcript[src="${src}"]`);
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

  return (
    <section className="section">
      <div className="buttons_nav">
        <button 
          onClick={handle2d_1}
          style={{backgroundColor: activeBtn === '2D-1' ? 'rgb(26,230,179)' : 'rgb(26,179,230)'}}   
        >2D-1</button>
        <button 
          onClick={handle2d_2}
          style={{backgroundColor: activeBtn === '2D-2' ? 'rgb(26,230,179)' : 'rgb(26,179,230)'}} 
        >2D-2</button>
        <button 
          onClick={handle2d_1}
          style={{backgroundColor: activeBtn === '3D-1' ? 'rgb(26,230,179)' : 'rgb(26,179,230)'}} 
        >3D-1</button>
        <button
          onClick={handle2d_2}
          style={{backgroundColor: activeBtn === '3D-2' ? 'rgb(26,230,179)' : 'rgb(26,179,230)'}} 
        >3D-2</button>
        <button 
          onClick={handle2d_1}
          style={{backgroundColor: activeBtn === '3D-3' ? 'rgb(26,230,179)' : 'rgb(26,179,230)'}} 
        >3D-3</button>
      </div>


      <div className="container">
        <div className="item">
          <canvas id="points"></canvas>
          <p>gl.POINTS</p>
        </div>
        <div className="item">
          <canvas id="lines"></canvas>
          <p>gl.LINES</p>
        </div>
        <div className="item">
          <canvas id="line_strip"></canvas>
          <p>gl.LINE_STRIP</p>
        </div>
        <div className="item">
          <canvas id="line_loop"></canvas>
          <p>gl.LINE_LOOP</p>
        </div>
        <div className="item">
          <canvas id="triangles"></canvas>
          <p>gl.TRIANGLES</p>
        </div>
        <div className="item">
          <canvas id="triangle_strip"></canvas>
          <p>gl.TRIANGLE_STRIP</p>
        </div>
        <div className="item">
          <canvas id="triangle_fan"></canvas>
          <p>gl.TRIANGLE_FAN</p>
        </div>
      </div>
    </section>
  );
}

export default App;
