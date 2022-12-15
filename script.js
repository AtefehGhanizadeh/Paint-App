const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

// Global Variables

const brushTime=1500
const canvas=document.createElement('canvas')
canvas.id='canvas'
const context=canvas.getContext('2d')
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize(currentSize) {
    if(currentSize<10){
        brushSize.textContent=`0${currentSize}`
    }
    else{
        brushSize.textContent=currentSize
    }
}

// Setting Brush Size
brushSlider.addEventListener('change', () => {
    currentSize=brushSlider.value
    displayBrushSize(currentSize)
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
    isEraser=false;
    currentColor=`#${brushColorBtn.value}`
    
});

// Setting Background Color

bucketColorBtn.addEventListener('change', () => {
    
    bucketColor=`#${bucketColorBtn.value}`
    createCanvas()
    restoreCanvas()
});

// Eraser
eraser.addEventListener('click', () => {

  isEraser=true;
  brushIcon.style.color = 'rgb(53, 53, 53)';
  eraser.style.color = 'white';
  activeToolEl.textContent = 'Eraser';
  currentColor=`#${bucketColorBtn.value}`
  brushSlider.value=50
  currentSize = brushSlider.value;
  displayBrushSize(currentSize)
});

// Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'white';
  eraser.style.color = 'rgb(53, 53, 53)';
  currentColor = `#${brushColorBtn.value}`;
  brushSlider.value=10
  currentSize = brushSlider.value;
  displayBrushSize(currentSize)

}

function setTimeoutForSwitchToBrush(ms){
    setTimeout(switchToBrush, ma);
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0,0,canvas.width,canvas.height);
  body.appendChild(canvas);
  switchToBrush();

}

// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  setTimeout(switchToBrush, 1500);
});

// Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  //Save aray
  localStorage.setItem('savedDrawnArray',JSON.stringify(drawnArray))
  //save bucket color
  localStorage.setItem('bucketColor',JSON.stringify(bucketColor))
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  setTimeoutForSwitchToBrush(brushTime)
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedDrawnArray')) {
    drawnArray = JSON.parse(localStorage.array);
    bucketColor=JSON.parse(localStorage.bucketColor);
    bucketColorBtn.value=bucketColor.slice(1)
    createCanvas()
    restoreCanvas()

  // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    setTimeoutForSwitchToBrush(brushTime)
  } 
  else{
    activeToolEl.textContent = 'NO Canvas Found';
    setTimeoutForSwitchToBrush(brushTime)
  }

});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {

  if (localStorage.getItem('savedDrawnArray')) {
  localStorage.removeItem('savedDrawnArray')
  localStorage.removeItem('bucketColor')
  // Active Tool
  activeToolEl.textContent = 'Local Storage Cleared';
  setTimeoutForSwitchToBrush(brushTime)
  } 
  else{
    activeToolEl.textContent = 'NO Canvas Found';
    setTimeoutForSwitchToBrush(brushTime)
  }
  

  
});

// Download Image
downloadBtn.addEventListener('click', () => {

  downloadBtn.href=canvas.toDataURL('image/jpeg',1)
  downloadBtn.download='painting-exp-1'
  // Active Tool
  activeToolEl.textContent = 'Image File Saved';
  setTimeoutForSwitchToBrush(brushTime)
});

// // Event Listener
brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
