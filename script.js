let canvas = document.getElementById("paint");
let context = canvas.getContext("2d");
let strokeInput = document.getElementById("line");
let colors = document.getElementById("color");
let fillBtn = document.getElementById("fill-board");
let drawBtn = document.getElementById("draw");
let saveBtn = document.getElementById("save");

let undoBtn = document.getElementById("undo");

let buttons = document.querySelectorAll(".color");
// console.log(buttons.length);

let clear = document.getElementById("clear");

let painting = false;
let filling = false;
let undoArray = [];
let idx = -1;

let x, y;

canvas.width = window.innerWidth - 70;
// canvas.width = 700;
canvas.height = window.innerHeight - 180;
// canvas.height = 500;

context.lineWidth = 2.5;
context.fillStyle = "#ffffff";
context.fillRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = "#000000";


canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mousedown", startPainting, false);
canvas.addEventListener("mouseup", stopPainting, false);
canvas.addEventListener("mouseleave", stopPainting, false);
canvas.addEventListener("click", onCanvasClick, false);


strokeInput.addEventListener("input", onRangeChange, false);
fillBtn.addEventListener("click", startFilling, false);
drawBtn.addEventListener("click", stopFilling, false);
saveBtn.addEventListener("click", saveImage, false);
clear.addEventListener("click", clearCanvas);

undoBtn.addEventListener("click",undo);

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", onColorClick, false);
}

// Draw on canvas 
function onMouseMove(e) {
    // console.log(e);
    x = e.offsetX;
    y = e.offsetY;
    if (!filling) {
        if (!painting) {
            context.beginPath();
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
            context.stroke();
        }
    }
}

function startPainting() {
    painting = true;
}

function stopPainting(e) {
    painting = false;
    if (e.type != 'mouseleave') {
        undoArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
        idx++;
    }
    // console.log(undoArray);
}

// Changes the with of pencil
function onRangeChange(e) {
    let value = e.target.value;
    context.lineWidth = value;
}

function onColorClick(e) {
    let style = e.target.style;
    context.strokeStyle = style.backgroundColor;
}

function startFilling() {
    filling = true;
}

function stopFilling() {
    filling = false;
}

// Fill canvas with color
function onCanvasClick() {
    if (filling) {
        context.closePath();
        context.beginPath();
        context.fillStyle = context.strokeStyle;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Clear Canvas
function clearCanvas() {
    context.fillStyle = "#ffffff";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    undoArray = [];
    idx = -1;
}

// Undo the canvas
function undo() {
    if(idx<=0){
        clearCanvas();
    }else{
        idx--;
        undoArray.pop();
        context.putImageData(undoArray[idx],0,0);
    }
}

// Download Image
function saveImage() {
    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg");
    a.download = "Paint";
    a.click();
}