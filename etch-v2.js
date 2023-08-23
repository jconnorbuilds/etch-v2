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

let squares; 
let mouseTrails = false;
let mousedown;
let selectedDrawColor = colorPickerDraw.value;
let selectedBgColor = colorPickerBg.value;

window.addEventListener('mousedown', () => mousedown = true);
window.addEventListener('mouseup', () => mousedown = false);

singleColorDrawBtn.addEventListener('click', setSingleColorDraw)
multiColorDrawBtn.addEventListener('click', setMultiColorDraw)
mouseTrailsBtn.addEventListener('click', toggleMouseTrailsMode);
lightenBtn.addEventListener('click', setLighten);
darkenBtn.addEventListener('click', setDarken);
clearBtn.addEventListener('click', clearGrid);
setGridBtn.addEventListener('click', setGridSize)
colorPickerDraw.addEventListener('input', () => selectedDrawColor = colorPickerDraw.value);
colorPickerBg.addEventListener('change', updateBgColor);

function updateBgColor() {
  selectedBgColor = colorPickerBg.value;
  squares.forEach((sq) => {
    if (!(sq.classList.contains('colored'))) {
      sq.style.backgroundColor = selectedBgColor;
    };
  });
};

function toggleMouseTrailsMode() {
  clearGrid();
  mouseTrails === false ? mouseTrails = true : mouseTrails = false;
  mouseTrailsBtn.classList.toggle('active')
}

function clearGrid() {
  squares.forEach((sq) => sq.style.backgroundColor = selectedBgColor);
  squares.forEach((sq) => sq.classList.remove('colored'));
}

function createGrid(width=24) {
  const size = width*width;
  for (let i = 0; i < size; i++) {
    const gridSquare = document.createElement('div');
    gridSquare.classList.add('sq')
    gridSquare.style.width = `${100 / width}%`;
    gridSquare.style.backgroundColor = selectedBgColor;
    etchASketch.appendChild(gridSquare);
    
  }
  squares = document.querySelectorAll('.sq');
  setSingleColorDraw();
};

function setGridSize() {
  let gridSize = 0;
  do {
    gridSize = parseInt(prompt('Set the grid size (Course (1) -> Fine(100)'));
  } while (!(gridSize > 1 && gridSize <= 100));

  while (etchASketch.childNodes.length > 0) {
    etchASketch.removeChild(etchASketch.firstChild)
  }
  createGrid(gridSize)
};

function getRandomRGB() {
  // returns a randomly generated RGB value in format: rgb(0 0 255)
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let result = `rgb(${[r, g, b].join(' ') })`
  return result;
};

function parseRGBValues(rgbString) {
  let r = parseInt(rgbString.split(', ')[0].slice(4));
  let g = parseInt(rgbString.split(', ')[1]);
  let b = parseInt(rgbString.split(', ')[2].slice(0).replace(')', ''));
  return [r, g, b];
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
      if (value < 5) value; // values less than 5 are unaffected by multiplying by 1.1
      newRGBValues.push(value * 1.1);
    };
    this.style.backgroundColor = `rgb(${newRGBValues.join(' ')})`
  };
}

function darken(e) {
  if (mousedown || e.type === "mousedown") {
    let currentColorRGB;
    let newRGBValues = []
    let currentColor = this.style.backgroundColor;
    currentColor[0] === '#' ? currentColorRGB = hexToRGB(currentColor) : currentColorRGB = parseRGBValues(currentColor);

    for (value of currentColorRGB) {
      if (value < 6) value--; // values less than 6 are unaffected by multiplying by 0.9
      newRGBValues.push(value * 0.9);
    };
    this.style.backgroundColor = `rgb(${newRGBValues.join(' ')})`
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
}

function singleColorIn(e) {
  if (mousedown || e.type === "mousedown") {
    this.style.backgroundColor = selectedDrawColor;
    this.classList.add('colored')
  };
}

function multiColorIn(e) {
  if (mousedown || e.type === "mousedown") {
    this.style.backgroundColor = getRandomRGB();
    this.classList.add('colored')
  };
}

function colorOut() {
  if (mouseTrails) {
    setTimeout(() => {
      this.style.backgroundColor = selectedBgColor;
      this.classList.remove('colored');
    }, 200);
  };
}
 
function setSingleColorDraw() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', singleColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseover', singleColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseout', colorOut));
}

function setMultiColorDraw() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', multiColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseover', multiColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseout', colorOut));
};

function setLighten() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', lighten));
  squares.forEach((sq) => sq.addEventListener('mouseover', lighten));
}

function setDarken() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', darken));
  squares.forEach((sq) => sq.addEventListener('mouseover', darken));
}

createGrid();
