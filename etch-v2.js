const etchASketch = document.querySelector('.etch-a-sketch');
const setGridBtn = document.querySelector('button.set-grid');
const highlightWhiteBtn = document.querySelector('button.bw')
const highlightSingleColorBtn = document.querySelector('button.single-color')
const highlightMultiColorBtn = document.querySelector('button.multi-color')
const mouseTrailsBtn = document.querySelector('button.mouse-trails')
const clearBtn = document.querySelector('button.clear-grid')

let squares; 
let highlightType;
let highlightClass;
let mouseTrails = false;
let mousedown;

window.addEventListener('mousedown', () => mousedown = true);
window.addEventListener('mouseup', () => mousedown = false);

highlightSingleColorBtn.addEventListener('click', () => setColorClass('single-color'))
highlightMultiColorBtn.addEventListener('click', () => setColorClass('multi-color'))
mouseTrailsBtn.addEventListener('click', toggleMouseTrailsMode);
clearBtn.addEventListener('click', clearGrid);

function toggleMouseTrailsMode() {
  clearGrid();
  mouseTrails === false ? mouseTrails = true : mouseTrails = false;
  mouseTrailsBtn.classList.toggle('active')
}

function clearGrid() {
  squares.forEach((sq) => sq.style.removeProperty('background-color'));
  squares.forEach((sq) => sq.classList.remove('highlight-single-color'));
}

function createGrid(width=24) {
  const size = width*width;
  for (let i = 0; i < size; i++) {
    const gridSquare = document.createElement('div');
    gridSquare.classList.add('sq')
    gridSquare.style.width = `${100 / width}%`;
    etchASketch.appendChild(gridSquare);
  }
  squares = document.querySelectorAll('.sq');
  setColorClass();
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

setGridBtn.addEventListener('click', setGridSize)

function getRandomRGBA() {
  // returns a randomly generated RGBA value in format: rgba(0, 0, 255, 1)
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let a = 1;
  let result = `rgba(${[r, g, b, a].join(', ') })`
  return result;
};

function setColorClass(color='single-color') {
  highlightType = color;
  if (color === 'multi-color') {
    highlightClass = 'highlight-multi-color';
    addMultiColorDraw();
  } else if (color === 'single-color') {
    highlightClass = 'highlight-single-color';
    addSingleColorDraw();
  }
}

function resetEventListeners() {
  squares.forEach((sq) => sq.removeEventListener('mouseover', singleColorIn));
  squares.forEach((sq) => sq.removeEventListener('mouseout', singleColorOut));
  squares.forEach((sq) => sq.removeEventListener('mouseover', multiColorIn));
  squares.forEach((sq) => sq.removeEventListener('mouseout', multiColorOut));
  squares.forEach((sq) => sq.removeEventListener('mousedown', singleColorIn));
  squares.forEach((sq) => sq.removeEventListener('mousedown', multiColorIn));
}

function singleColorIn(e) {
  if (mousedown || e.type === "mousedown") this.classList.add(highlightClass);
}

function singleColorOut() {
  if (mouseTrails) setTimeout(() => this.classList.remove(highlightClass), 250);
}

function multiColorIn(e) {
  if (mousedown || e.type === "mousedown") this.style.backgroundColor = getRandomRGBA();
}

function multiColorOut() {
  if (mouseTrails) setTimeout(() => this.style.removeProperty('background-color'), 250)
}
 
function addSingleColorDraw() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', singleColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseover', singleColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseout', singleColorOut));
  
}

function addMultiColorDraw() {
  resetEventListeners()
  squares.forEach((sq) => sq.addEventListener('mousedown', multiColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseover', multiColorIn));
  squares.forEach((sq) => sq.addEventListener('mouseout', multiColorOut));
};

createGrid();
