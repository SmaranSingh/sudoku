const getRow = index => Math.floor(index / 3);
const getColumn = index => index % 3;
const allIndexes = [...new Array(9).keys()];
const allValues = allIndexes.map(number => number + 1);
const getRandomNumber = (max = 2, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getEmptyMatrix = () => {
  const valuesArray = new Array(9);

  for (var index = 0; index < 9; index++) {
    valuesArray[index] = new Array(9).fill('');
  }

  return valuesArray;
};

export const getValidValues = (values, section, index) => {
  let takenValues = [...values[section]].filter(value => value);
  const row = getRow(index);
  const column = getColumn(index);
  const sectionRow = getRow(section);
  const sectionColumn = getColumn(section);
  const adjacentSections = [];
  const adjacentRows = [];
  const adjacentColumns = [];

  for (let loopIndex = 0; loopIndex < 9; loopIndex += 1) {
    if (loopIndex !== section) {
      if (getRow(loopIndex) === sectionRow) {
        adjacentSections.push(loopIndex);
        adjacentRows.push(loopIndex);
      } else if (getColumn(loopIndex) === sectionColumn) {
        adjacentSections.push(loopIndex);
        adjacentColumns.push(loopIndex);
      }
    }
  }

  adjacentRows.forEach(loopIndex => {
    const rowValues = values[loopIndex].filter((value, filterIndex) => value && getRow(filterIndex) === row);
    takenValues = [...takenValues, ...rowValues];
  });

  adjacentColumns.forEach(loopIndex => {
    const columnValues = values[loopIndex].filter((value, filterIndex) => value && getColumn(filterIndex) === column);
    takenValues = [...takenValues, ...columnValues];
  });

  return allValues.filter(number => !takenValues.includes(number));
};

export const generateCompleteSudoku = (values, section = 0, index = 0) => {
  if (section < 9) {
    const validValues = values[section][index] ? [values[section][index]] : getValidValues(values, section, index);
    while (validValues.length > 0) {
      const randomIndex = getRandomNumber(validValues.length - 1);
      values[section][index] = validValues[randomIndex];
      const newIndex = (index + 1) % 9;
      let newSection = section;
      if (newIndex === 0) {
        newSection += 1;
      }

      const isValid = generateCompleteSudoku(values, newSection, newIndex);
      if (isValid) {
        return values;
      } else {
        values[section][index] = '';
        validValues.splice(randomIndex, 1);
      }
    }

    return false;
  }

  return values;
};

export const getSudoku = () => {
  let values = JSON.parse(JSON.stringify(getEmptyMatrix()));

  const diagonalSections = [0, 4, 8];
  diagonalSections.forEach(section => {
    const availableValues = [...allValues];

    for (let index = 0; index < 9; index += 1) {
      const randomIndex = getRandomNumber(availableValues.length - 1);
      values[section][index] = availableValues[randomIndex];
      availableValues.splice(randomIndex, 1);
    }
  });

  generateCompleteSudoku(values, 1, 0);

  for (let index = 0; index < 9; index += 1) {
    let deleteCount = getRandomNumber(6, 3);
    while (deleteCount > 0) {
      const availableIndexes = [...allIndexes];
      const randomIndex = getRandomNumber(availableIndexes.length - 1);

      if (values[index][availableIndexes[randomIndex]] !== '') {
        values[index][availableIndexes[randomIndex]] = '';
        availableIndexes.splice(randomIndex, 1);
        deleteCount -= 1;
      }
    }
  }

  return values;
};

export const getNeighbour = (direction, section, index) => {
  let neighbourSection = section;
  let neighbourIndex = section;
  // eslint-disable-next-line default-case
  switch (direction.toLowerCase()) {
    case 'up': {
      if (index < 3) {
        neighbourSection = section - 3;
        neighbourIndex = index + 6;
      } else {
        neighbourIndex = index - 3;
      }
      break;
    }
    case 'down': {
      if (index > 5) {
        neighbourSection = section + 3;
        neighbourIndex = index - 6;
      } else {
        neighbourIndex = index + 3;
      }
      break;
    }
    case 'left': {
      if (index % 3 === 0) {
        neighbourSection = section - 1;
        neighbourIndex = index + 2;
      } else {
        neighbourIndex = index - 1;
      }
      break;
    }
    case 'right': {
      if (index % 3 === 2) {
        neighbourSection = section + 1;
        neighbourIndex = index - 2;
      } else {
        neighbourIndex = index + 1;
      }
    }
  }

  return {
    section: neighbourSection < 0 || neighbourSection > 8 ? null : neighbourSection,
    index: neighbourIndex < 0 || neighbourIndex > 8 ? null : neighbourIndex,
  };
};
