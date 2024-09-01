"use client";

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Sketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      const stringInput = "VAN VELUWEN";
      const alternateStrings = [
        "INVESTOR",
        "ANALYST",
        "DATA SCIENTIST",
        "SOFTWARE DEVELOPER",
        "TINKERER",
	"AVID READER",
	"DATA ENGINEER",
	"AUSTRALIAN"
      ];
      const repeatCount = 5; // Number of times to repeat the phrase per line
      const lines = 5; // Number of lines for formatting
      const topPadding = 20; // Add padding at the top to prevent clipping
      let fontGrid = [];
      const cols = repeatCount; // Set cols to repeatCount for consistency
      const scrambleDuration = 4000; // Slower, chill scramble effect (4 seconds)
      const transitionInterval = 10000; // 10 seconds between transitions
      const scrambleStep = 100; // Slow down the scramble transition
      let scrambling = false;
      let specialWordIndex = -1; // Index for the special word

      p.setup = () => {
        p.textSize(p.width / (cols * 1.2)); // Significantly increase text size
        const lineHeight = p.textSize() * 1.5; // Adjust line height for better spacing
        p.createCanvas(p.windowWidth * 1.4, lineHeight * lines * 1.3 + topPadding); // Larger canvas with top padding
        p.textAlign(p.LEFT, p.BASELINE); // Use BASELINE alignment to keep all text aligned
        p.background(0);
        initializeFonts();
        drawGrid();
      };

      const initializeFonts = () => {
        for (let line = 0; line < lines; line++) {
          fontGrid[line] = {
            isBold: Array(repeatCount).fill(false), // All VAN VELUWEN not bold
            isSpecial: Array(repeatCount).fill(false)
          };
        }
      };

      const randomCharacter = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        return characters.charAt(Math.floor(Math.random() * characters.length));
      };

      const smoothScramble = (currentText, targetText) => {
        return currentText.split('').map((char, index) => {
          if (Math.random() < 0.2) {
            return randomCharacter();
          } else {
            return targetText.charAt(index);
          }
        }).join('');
      };

      const scrambleText = () => {
        scrambling = true;
        const scrambleStartTime = p.millis();

        const interval = setInterval(() => {
          if (p.millis() - scrambleStartTime > scrambleDuration) {
            clearInterval(interval);
            finalizeText();
            scrambling = false;
            return;
          }

          p.clear();
          p.background(0);
          const lineHeight = p.textSize() * 1.5;

          for (let line = 0; line < lines; line++) {
            let x = 0;
            let y = line * lineHeight + topPadding; // Adjust y to include top padding

            for (let i = 0; i < repeatCount; i++) {
              const targetText = fontGrid[line].isSpecial[i]
                ? alternateStrings[Math.floor(Math.random() * alternateStrings.length)]
                : stringInput;

              const scrambledText = smoothScramble(stringInput, targetText);

              // Apply soft blur effect
              const blurAmount = p.map(p.millis() - scrambleStartTime, 0, scrambleDuration, 5, 0);
              p.drawingContext.filter = `blur(${blurAmount}px)`;

              p.textFont(fontGrid[line].isSpecial[i] ? 'Helvetica-Bold' : 'Helvetica-Light');
              p.textStyle(fontGrid[line].isSpecial[i] ? p.BOLD : p.NORMAL); // Bold only for alternateStrings
              if (fontGrid[line].isSpecial[i]) {
                p.fill(34, 139, 34); // Dark green color for special words
              } else {
                p.fill(255);
              }
              p.text(scrambledText, x, y);
              x += p.textWidth(targetText + " "); // Adjust spacing based on word length
            }
          }
        }, scrambleStep);
      };

      const finalizeText = () => {
        p.clear();
        p.background(0);
        const lineHeight = p.textSize() * 1.5;

        for (let line = 0; line < lines; line++) {
          let x = 0;
          let y = line * lineHeight + topPadding; // Adjust y to include top padding

          for (let i = 0; i < repeatCount; i++) {
            p.textFont(fontGrid[line].isSpecial[i] ? 'Helvetica-Bold' : 'Helvetica-Light');
            p.textStyle(fontGrid[line].isSpecial[i] ? p.BOLD : p.NORMAL); // Bold only for alternateStrings
            if (fontGrid[line].isSpecial[i]) {
              const specialText = alternateStrings[Math.floor(Math.random() * alternateStrings.length)];
              p.fill(34, 139, 34); // Dark green color for special words
              p.text(specialText, x, y);
              x += p.textWidth(specialText + " ");
            } else {
              p.fill(255);
              p.text(stringInput, x, y);
              x += p.textWidth(stringInput + " ");
            }
          }
        }
      };

      const updateBoldRandomly = () => {
        if (!scrambling) {
          for (let line = 0; line < lines; line++) {
            fontGrid[line].isSpecial = Array(repeatCount).fill(false);
          }
          // Randomly choose one "VAN VELUWEN" to turn into an alternate string
          specialWordIndex = Math.floor(Math.random() * repeatCount * lines);
          fontGrid[Math.floor(specialWordIndex / repeatCount)].isSpecial[specialWordIndex % repeatCount] = true;
          scrambleText();
        }
      };

      p.windowResized = () => {
        p.textSize(p.width / (cols * 1.2)); // Significantly increase text size
        const lineHeight = p.textSize() * 1.5; // Adjust line height for better spacing
        p.resizeCanvas(p.windowWidth * 1.4, lineHeight * lines * 1.3 + topPadding); // Larger canvas with top padding
        drawGrid();
      };

      const drawGrid = () => {
        finalizeText(); // Draw the initial static text
      };

      // Trigger the special word update every 10 seconds with a scramble effect
      setInterval(updateBoldRandomly, transitionInterval);
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Sketch;

