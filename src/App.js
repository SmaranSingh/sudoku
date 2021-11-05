import './App.css';

import React, { createRef, useState } from 'react';
import { generateCompleteSudoku, getEmptyMatrix, getNeighbour, getSudoku, getValidValues } from './Utils';

const initialSudoku = getSudoku();
function App() {
  const [values, setValues] = useState(JSON.parse(JSON.stringify(initialSudoku)));
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorLocations, setErrorLocations] = useState([]);
  const [hints, setHints] = useState(getEmptyMatrix());
  const refsArray = [];

  for (let index = 0; index < 81; index += 1) {
    refsArray.push(createRef(null));
  }
  const isComplete = errorLocations.length === 0 && !values.some(section => section.some(input => input === ''));

  const handleKeyDown = (e, section, index) => {
    let value = e.key;
    if (!e.shiftKey || value === 'h' || value === 'H') {
      let intValue = parseInt(value);
      let nextInputSection = section;
      let nextInputIndex = index;
      // eslint-disable-next-line default-case
      switch (value) {
        case 'Backspace':
          value = '';
          break;
        case 'ArrowUp':
          ({ section: nextInputSection, index: nextInputIndex } = getNeighbour('up', section, index));
          break;
        case 'ArrowDown':
          ({ section: nextInputSection, index: nextInputIndex } = getNeighbour('down', section, index));
          break;
        case 'ArrowLeft':
          ({ section: nextInputSection, index: nextInputIndex } = getNeighbour('left', section, index));
          break;
        case 'ArrowRight':
          ({ section: nextInputSection, index: nextInputIndex } = getNeighbour('right', section, index));
          break;
        case 'h':
        case 'H':
          generateHint();
      }

      if (nextInputSection !== section || nextInputIndex !== index) {
        refsArray[nextInputSection * 9 + nextInputIndex]?.current?.focus();
      }

      if (initialSudoku[section][index] === '' && (value === '' || (intValue > 0 && intValue < 10))) {
        const isValid = getValidValues(values, section, index).includes(intValue);
        const updatedValues = [...values];

        updatedValues[section][index] = intValue || '';
        setValues(updatedValues);

        if (!isValid && value !== '') {
          setErrorLocations([...errorLocations, { section, index }]);
        } else {
          const sectionIndex = index;
          setErrorLocations(
            errorLocations.filter(object => object.section !== section && object.index !== sectionIndex)
          );
        }
      }
    }
  };

  const generateHint = () => {
    const validSudoku = generateCompleteSudoku(JSON.parse(JSON.stringify(values)));
    const updatedHints = [...hints];
    const updatedValues = [...values];

    updatedHints[Math.floor(focusedInput / 9)][focusedInput % 9] =
      validSudoku[Math.floor(focusedInput / 9)][focusedInput % 9];
    updatedValues[Math.floor(focusedInput / 9)][focusedInput % 9] =
      validSudoku[Math.floor(focusedInput / 9)][focusedInput % 9];
    setHints(updatedHints);
    setValues(updatedValues);
  };

  const hasError = (section, sectionIndex) =>
    errorLocations.some(object => object.section === section && object.index === sectionIndex);

  const getInputs = (section) => {
    const inputs = [];

    for (let index = 0; index < 9; index += 1) {
      inputs.push(
        <input
          type="number"
          min={1}
          max={9}
          step={1}
          value={values[section][index]}
          key={section * 9 + index}
          onKeyDown={e => handleKeyDown(e, section, index)}
          disabled={isComplete || initialSudoku[section][index] !== ''}
          className={`${hasError(section, index) ? 'error' : ''} ${
            hints[section][index] === values[section][index] ? 'hint' : ''
          }`}
          ref={refsArray[section * 9 + index]}
          onChange={() => {}}
          onFocus={() => setFocusedInput(section * 9 + index)}
        />
      );
    }
    return inputs;
  };

  const getGrid = () => {
    const grid = [];
    let index = 0;

    while (index < 9) {
      grid.push(
        <div className={`section-${index} grid-3-3`} key={index}>
          {getInputs(index)}
        </div>
      );
      index += 1;
    }

    return grid;
  };

  return (
    <div
      className={`main-container grid-3-3 ${isComplete ? 'complete' : ''} ${focusedInput ? 'hint-btn-visible' : ''}`}
    >
      {getGrid()}
      {focusedInput && (
        <button className="hint-button" onClick={generateHint}>
          Hint
        </button>
      )}
    </div>
  );
}

export default App;
