"use client";

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Sketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let fontGrid;
      let h;
      const stringInput = "Joel Van Veluwen";
      const rows = 3; // Reduced from 4 for performance
      const cols = 7; // Reduced from 10 for performance
      const fonts = ["Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Gill Sans", "Lucida Sans", "Century Gothic", "Futura", "Avenir"];
      let sectors = [];
      let lastMouseMoveTime = 0;
      const debounceTime = 100; // Time in milliseconds to limit update frequency

      p.setup = () => {
        p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.8); // Reduced canvas size for performance
        scramble();
        createSectors(); // Ensure this is called after scramble
      };

      const scramble = () => {
        fontGrid = [];
        for (let j = 0; j <= rows; j++) {
          fontGrid[j] = [];
          for (let i = 0; i < cols; i++) {
            fontGrid[j].push(fonts[Math.floor(Math.random() * fonts.length)]);
          }
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

      const createSectors = () => {
        sectors = []; // Reset the sectors array
        for (let row = 0; row < rows; row++) {
          sectors[row] = [];
          for (let col = 0; col < cols; col++) {
            sectors[row][col] = p.createGraphics(
              Math.floor(p.windowWidth / cols),
              Math.floor(h / rows)
            );
          }
        }
      };

      const getSector = (row, col) => {
        if (sectors[row] && sectors[row][col]) { // Check if sector exists
          let out = sectors[row][col];
          out.clear();
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
        }
        return null;
      };

      p.mouseMoved = () => {
        if (p.millis() - lastMouseMoveTime > debounceTime) {
          changeGridOnMouseMove();
          lastMouseMoveTime = p.millis();
        }
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

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.8); // Keep the canvas size reduced
        scramble();
        createSectors(); // Re-create sectors after resize
      };

      const drawGraphic = () => {
        p.clear();
        p.background(0);
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const sector = getSector(row, col);
            if (sector) { // Only draw if sector exists
              p.image(
                sector,
                col * p.windowWidth / cols,
                p.windowHeight / 2 - h / 2 + row * h / rows,
                p.windowWidth / cols,
                h / rows
              );
            }
          }
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

