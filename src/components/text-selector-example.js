import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import FontPicker from "./FontPicker";
import { fabric } from "fabric";

import "./styles.css";
// https://stackoverflow.com/questions/43924988/displaying-applicable-controls-with-fabric-js
// http://casesandberg.github.io/react-color/#examples
// https://react-popup.elazizi.com/react-tooltip/
function App() {
  const [font, setFont] = useState("Arial");
  const [canvas, setCanvas] = useState();
  const canvasRef = useRef();

  // const ctx = canvas.getContext("2d")

  useEffect(() => {
    // setCanvas(canvasRef.current)
    // Need to add error handling
    const c = new fabric.Canvas("main-canvas", {
      preserveObjectStacking: true
    });
    setCanvas(c);
  }, []);
  const handleChange = font => {
    console.log(font);
    setFont(font);
    var activeObject = canvas.getActiveObject();
    activeObject.set("fontFamily", font);
    // canvas.getActiveObject().setFontFamily(font);
    canvas.renderAll();
  };
  const bgColor = () => {
    console.log(canvas);
    canvas.setBackgroundColor("rgba(255, 73, 64, 0.6)");
  };
  const Addtext = () => {
    // const canvas = document.querySelector('canvas')
    var text = new fabric.Textbox("Add text", {
      fontFamily: "arial",
      left: 100,
      top: 100,
      type: "text",
      fontSize: 18,
      width: 200,
      fill: "pink"
    });
    console.log(text, canvas);
    canvas.add(text);
    canvas.renderAll();
  };
  return (
    <div>
      <b>With local component state:</b>
      <br />
      <br />
      <br />
      <br />

      <FontPicker
        label="Select Font"
        value={font}
        previews={true}
        onChange={handleChange}
      />

      <button onClick={Addtext}>Text</button>
      <button onClick={bgColor}>Color</button>
      <canvas ref={canvasRef} id="main-canvas" width="800" height="600" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
