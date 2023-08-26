const etchASketch = document.querySelector('.etch-a-sketch');
const setGridBtn = document.querySelector('button.set-grid');
// const highlightWhiteBtn = document.querySelector('button.bw')
const singleColorDrawBtn = document.querySelector('button.single-color')
const multiColorDrawBtn = document.querySelector('button.multi-color')
const mouseTrailsBtn = document.querySelector('button.mouse-trails')
const clearBtn = document.querySelector('button.clear-grid')
const colorPickerDraw = document.querySelector('.color-pickers .color-main')
const colorPickerBg = document.querySelector('.color-pickers .color-bg')
const lightenBtn = document.querySelector('.button-container .lighten')
const darkenBtn = document.querySelector('.button-container .darken')
const eraserBtn = document.querySelector('.button-container .eraser')
const colorSlider = document.querySelector('.color-slider');
const sliderDisplay = document.querySelector('.slider-display')

let squares; 
let mouseTrails = false;
let mousedown;
let selectedDrawColor = colorPickerDraw.value;
let selectedBgColor = colorPickerBg.value;
let colorVariation;
setMultiColorVariation(colorSlider.value);

window.addEventListener('mousedown', () => mousedown = true);
window.addEventListener('mouseup', () => mousedown = false);

sliderDisplay.textContent = `Color variation: ${colorSlider.value}`;

singleColorDrawBtn.addEventListener('click', setSingleColorDraw)
multiColorDrawBtn.addEventListener('click', setMultiColorDraw)
mouseTrailsBtn.addEventListener('click', toggleMouseTrailsMode);
lightenBtn.addEventListener('click', setLighten);
darkenBtn.addEventListener('click', setDarken);
clearBtn.addEventListener('click', clearGrid);
eraserBtn.addEventListener('click', setEraser);
setGridBtn.addEventListener('click', setGridSize)
colorPickerDraw.addEventListener('input', () => selectedDrawColor = colorPickerDraw.value);
colorPickerBg.addEventListener('input', updateBgColor);
colorSlider.addEventListener('input', () => setMultiColorVariation(colorSlider.value))

function setMultiColorVariation(position) {
  // https://stackoverflow.com/questions/846221/logarithmic-slider
  let minPosition = 1;
  let maxPosition = 20;

  let minValue = Math.log(0.08);
  let maxValue = Math.log(3);

  let scale = (maxValue - minValue) / (maxPosition - minPosition);
  let result = Math.exp(minValue + scale * (position - minPosition))
  sliderDisplay.textContent = `Color variation: ${colorSlider.value}`
  console.log(result)
  colorVariation = result;
};

function updateBgColor() {
  selectedBgColor = colorPickerBg.value;
  squares.forEach((sq) => {
    if (!(sq.classList.contains('has-changed'))) {
      sq.style.backgroundColor = selectedBgColor;
      sq.dataset.prevColor = selectedBgColor;
    };
  });
};

function toggleMouseTrailsMode() {
  mouseTrails === false ? mouseTrails = true : mouseTrails = false;
  squares.forEach((sq) => sq.setAttribute('data-prev-color', sq.style.backgroundColor));
  this.classList.toggle('active')
};

function clearGrid() {
  squares.forEach((sq) => sq.style.backgroundColor = selectedBgColor);
  squares.forEach((sq) => sq.setAttribute('data-prev-color', selectedBgColor));
  squares.forEach((sq) => sq.classList.remove('has-changed'));
};

function createGrid(width=24) {
  const size = width*width;
  for (let i = 0; i < size; i++) {
    const gridSquare = document.createElement('div');
    gridSquare.classList.add('sq')
    gridSquare.style.width = `${100 / width}%`;
    gridSquare.style.backgroundColor = selectedBgColor;
    gridSquare.setAttribute('data-prev-color', selectedBgColor);
    etchASketch.appendChild(gridSquare);
    
  }
  squares = document.querySelectorAll('.sq');
  setMultiColorDraw();
};

function setGridSize() {
  let gridSize = 0;
  do {
    gridSize = parseInt(prompt('Set the grid size (Course (2) -> Fine(64)'));
  } while (!(gridSize >= 2 && gridSize <= 64));

  while (etchASketch.childNodes.length > 0) {
    etchASketch.removeChild(etchASketch.firstChild)
  }
  createGrid(gridSize)
};

function setActiveStyle(btn) {
  const buttons = document.querySelectorAll('.button-container .selfish');
  buttons.forEach((button) => button.classList.remove('active'))
  btn.classList.add('active')
}

function getRandomMulticolor() {
  let r, g, b;
  let baseColorRGB;
  selectedDrawColor[0] === '#' ? baseColorRGB = hexToRGB(selectedDrawColor) : baseColorRGB = parseRGBValues(selectedDrawColor);
  console.log(baseColorRGB);
  console.log(colorVariation);
  let largestValue = Math.max(...baseColorRGB);
  let largestIdx = baseColorRGB.indexOf(largestValue);

  let newRGBVals = [0, 0, 0]

  for (let idx = 0; idx < 3; idx++) {
    let min = baseColorRGB[idx] - (baseColorRGB[idx] * colorVariation);
    let max = baseColorRGB[idx] + (baseColorRGB[idx] * colorVariation);

    if (idx === largestIdx) {
      min = baseColorRGB[idx] - (baseColorRGB[idx] * colorVariation)
      max = baseColorRGB[idx] + (baseColorRGB[idx] * colorVariation * 3)
    };
    if (min === 0) min = getRandomInRange(0, (colorSlider.value/20) * 256);
    
    newRGBVals[idx] = getRandomInRange(min, max);
  };

  r = newRGBVals[0];
  g = newRGBVals[1];
  b = newRGBVals[2];

  let result = `rgb(${[r, g, b].join(' ')})`
  console.log(result)
  return result;
};

function getRandomInRange(min, max) {
  if (max > 256) max = 256;
  if (min < 0) min = 0;
  return Math.floor(Math.random() * (max - min) + min);
}

function parseRGBValues(rgbString) {
  let r, g, b;

  let splitRGB = rgbString.split(', ');
  r = parseInt(splitRGB[0].slice(4));
  g = parseInt(splitRGB[1]);
  b = parseInt(splitRGB[2].slice(0).replace(')', ''));
  return [r, g, b]
}

function hexToRGB(hexValue){
  let r = parseInt(hexValue.slice(1,3), 16);
  let g = parseInt(hexValue.slice(3,5), 16);
  let b = parseInt(hexValue.slice(5), 16);
  return [r, g, b];
}

function lighten(e) {
  if (mousedown || e.type === "mousedown") {
    let currentColorRGB;
    let newRGBValues = []
    let currentColor = this.style.backgroundColor;
    currentColor[0] === '#' ? currentColorRGB = hexToRGB(currentColor) : currentColorRGB = parseRGBValues(currentColor);

    for (value of currentColorRGB) {
      if (value < 10) value += 10;
      value >= 50 ? newRGBValues.push(value * 1.1) : newRGBValues.push(value * 1.75)
    };
    this.style.backgroundColor = `rgb(${newRGBValues.join(' ')})`
  };
}

function darken(e) {
  if (mousedown || e.type === "mousedown") {
    let currentColorValues;
    let newRGBValues = []
    let currentColor = this.style.backgroundColor;
    currentColor[0] === '#' ? currentColorValues = hexToRGB(currentColor) : currentColorValues = parseRGBValues(currentColor);

    for (value of currentColorValues) {
      if (value < 6) value--; // values less than 6 are unaffected by multiplying by 0.9
      value <= 60 ? newRGBValues.push(value * 0.75) : newRGBValues.push(value * 0.9)
    };
    this.style.backgroundColor = `rgb(${newRGBValues.join(', ')})`;
  };
}

function erase(e) {
  if (mousedown || e.type === "mousedown") {
    this.style.backgroundColor = selectedBgColor;
    this.dataset.prevColor = selectedBgColor;
    this.classList.remove('has-changed');
  };
}

function resetEventListeners() {
  squares.forEach((sq) => sq.removeEventListener('mousedown', singleColorIn));
  squares.forEach((sq) => sq.removeEventListener('mouseover', singleColorIn));
  squares.forEach((sq) => sq.removeEventListener('mousedown', multiColorIn));
  squares.forEach((sq) => sq.removeEventListener('mouseover', multiColorIn));
  squares.forEach((sq) => sq.removeEventListener('mouseout', colorOut));
  squares.forEach((sq) => sq.removeEventListener('mousedown', lighten));
  squares.forEach((sq) => sq.removeEventListener('mouseover', lighten));
  squares.forEach((sq) => sq.removeEventListener('mousedown', darken));
  squares.forEach((sq) => sq.removeEventListener('mouseover', darken));
  squares.forEach((sq) => sq.removeEventListener('mousedown', erase));
  squares.forEach((sq) => sq.removeEventListener('mouseover', erase));
}

function singleColorIn(e) {
  if (mousedown || e.type === "mousedown") {
    this.style.backgroundColor = selectedDrawColor;
    if (!mouseTrails) this.classList.add('has-changed');
  };
}

function multiColorIn(e) {
  if (mousedown || e.type === "mousedown") {
    this.style.backgroundColor = getRandomMulticolor();
    if (!mouseTrails) this.classList.add('has-changed');
  };
}

function colorOut() {
  if (mouseTrails) {
    setTimeout(() => {
      this.style.backgroundColor = this.dataset.prevColor;
    }, 200);
  };
}
 
function setSingleColorDraw() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', singleColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseover', singleColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseout', colorOut));
  setActiveStyle(singleColorDrawBtn)
}

function setMultiColorDraw() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', multiColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseover', multiColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseout', colorOut));
  setActiveStyle(multiColorDrawBtn)
};

function setLighten() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', lighten));
  squares.forEach((sq) => sq.addEventListener('mouseover', lighten));
  squares.forEach((sq) => sq.addEventListener('mouseout', colorOut));
  setActiveStyle(lightenBtn)
}

function setDarken() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', darken));
  squares.forEach((sq) => sq.addEventListener('mouseover', darken));
  squares.forEach((sq) => sq.addEventListener('mouseout', colorOut));
  setActiveStyle(darkenBtn);
}

function setEraser() {
  squares.forEach((sq) => sq.addEventListener('mousedown', erase));
  squares.forEach((sq) => sq.addEventListener('mouseover', erase));
  setActiveStyle(eraserBtn);
}

createGrid();