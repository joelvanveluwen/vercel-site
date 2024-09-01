"use client";

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Sketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      const stringInput = "VAN VELUWEN";
      const repeatCount = 5; // Number of times to repeat the phrase per line
      const stagger = 1; // How many words roll over to the next line
      const fonts = [
        "Courier New", "Lucida Console", "Monaco", "Consolas", "Andale Mono",
        "DejaVu Sans Mono", "Source Code Pro", "Ubuntu Mono", "Roboto Mono",
        "Droid Sans Mono", "PT Mono", "Inconsolata", "Oxygen Mono",
        "Anonymous Pro", "Fira Mono", "Hack", "Menlo", "Space Mono",
        "JetBrains Mono", "IBM Plex Mono", "Noto Mono", "Liberation Mono"
      ]; // Extensive list of monospace fonts
      let fontGrid = [];
      const rows = 5; // Number of lines
      const cols = repeatCount + 1; // Number of columns accounting for stagger
      let transitionProgress = 0; // Track progress of transition
      const transitionSpeed = 0.005; // Slower transition speed for a chill effect
      const mouseMoveThreshold = 0.05; // 5% of mouse moves

      p.setup = () => {
        p.createCanvas(p.windowWidth * 0.9, p.windowHeight * 0.6); // Canvas size
        p.textSize(p.width / (cols * 2)); // Dynamically set text size based on grid size
        p.textAlign(p.LEFT, p.CENTER); // Align text left to start the rolling effect
        p.background(0);
        initializeFonts();
        drawGrid();
      };

      const initializeFonts = () => {
        for (let row = 0; row < rows; row++) {
          fontGrid[row] = {
            currentFont: randomFont(),
            targetFont: randomFont(),
          };
        }
        transitionProgress = 0; // Reset transition progress
      };

      const randomFont = () => {
        return fonts[Math.floor(Math.random() * fonts.length)];
      };

      const drawGrid = () => {
        p.clear();
        p.background(0);
        const cellWidth = p.width / cols;
        const cellHeight = p.height / rows;

        transitionProgress = Math.min(transitionProgress + transitionSpeed, 1);

        for (let row = 0; row < rows; row++) {
          let lineText = "";
          for (let col = 0; col < cols; col++) {
            lineText += stringInput + " ";
          }

          const staggerOffset = -(row * stagger) * cellWidth;

          // Use currentFont during transition
          p.textFont(fontGrid[row].currentFont);
          p.fill(255);
          p.text(
            lineText.trim(),
            staggerOffset, // Apply the stagger offset
            row * cellHeight + cellHeight / 2
          );

          // Gradually transition to the targetFont
          if (transitionProgress >= 1) {
            fontGrid[row].currentFont = fontGrid[row].targetFont;
            fontGrid[row].targetFont = randomFont();
            transitionProgress = 0; // Restart transition
          }
        }

        // Continue drawing to update transition
        requestAnimationFrame(drawGrid);
      };

      let lastMouseMoveTime = 0;
      const mouseMoveInterval = 200; // Minimum time in milliseconds between font scrambles

      p.mouseMoved = () => {
        const now = p.millis();
        if (Math.random() < mouseMoveThreshold && (now - lastMouseMoveTime > mouseMoveInterval)) {
          initializeFonts();
          lastMouseMoveTime = now;
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth * 0.9, p.windowHeight * 0.6);
        p.textSize(p.width / (cols * 2)); // Adjust text size on resize
        drawGrid();
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

