import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Sketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let fontGrid;
      let h;
      const stringInput = "Joel Van Veluwen";
      const rows = 4;
      const cols = 10;
      const fonts = ["Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Gill Sans", "Lucida Sans", "Century Gothic", "Futura", "Avenir"];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        scramble();
      };

      const scramble = () => {
        fontGrid = new Array();
        for (let j = 0; j <= rows; j++) {
          fontGrid[j] = new Array();
          for (let i = 0; i < cols; i++)
            fontGrid[j].push(fonts[Math.floor(Math.random() * fonts.length)]);
        }
        getHeight();
        drawGraphic();
      };

      const getHeight = () => {
        let x = 0;
        for (let i = 0; i < fonts.length; i++) {
          p.textFont(fonts[i]);
          p.textSize(p.windowWidth);
          p.textSize((p.windowWidth * p.windowWidth) / p.textWidth(stringInput));
          x = Math.max(x, p.textAscent());
        }
        h = x;
      };

      p.mouseMoved = () => {
        changeGridOnMouseMove();
      };

      const changeGridOnMouseMove = () => {
        const totalGrids = rows * cols;
        const gridsToChange = Math.floor(totalGrids * 0.05);

        for (let i = 0; i < gridsToChange; i++) {
          setTimeout(() => {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            fontGrid[row][col] = fonts[Math.floor(Math.random() * fonts.length)];
            drawGraphic();
          }, i * 50); // Staggered effect by 50ms
        }
      };

      const getSector = (row, col) => {
        const out = p.createGraphics(
          Math.floor(p.windowWidth / cols),
          Math.floor(h / rows)
        );
        out.fill(255);
        out.textFont(fontGrid[row][col]);
        out.textSize(p.windowWidth);
        out.textAlign(p.CENTER, p.CENTER);
        out.textSize(
          (p.windowWidth * p.windowWidth) / out.textWidth(stringInput)
        );
        out.text(
          stringInput,
          p.windowWidth / 2 - col * p.windowWidth / cols,
          h / 2 - row * h / rows
        );
        return out.get();
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        scramble();
      };

      const drawGraphic = () => {
        p.clear();
        p.background(0);
        for (let row = 0; row < rows; row++)
          for (let col = 0; col < cols; col++) {
            p.image(
              getSector(row, col),
              col * p.windowWidth / cols,
              p.windowHeight / 2 - h / 2 + row * h / rows,
              p.windowWidth / cols,
              h / rows
            );
          }
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Sketch;

