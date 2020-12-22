const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 450;
canvas.height = 500;

const lineWidth = 4;
const size = 40;

let cables = ['yellow', 'red', 'green', 'blue'];
const cableSize = 28;
const cableWidth = 60;
const padding = 120;
const distance = (canvas.height - padding) / cables.length;
let leftCables = sortCables();
let rightCables = sortCables();
leftCablesCoordinates();
rightCablesCoordinates();

canvas.addEventListener('mousedown', (e) => {
    mousePos.x = e.layerX;
    mousePos.y = e.layerY;
    mousePos.isClicking = true;

    checkCableSelected();
});

canvas.addEventListener('mouseup', (e) => {
    mousePos.isClicking = false;
    taskState.selectedColor = null;

    checkCableDropped();
});

canvas.addEventListener('mousemove', (e) => {
    if (mousePos.isClicking) {
        mousePos.x = e.layerX;
        mousePos.y = e.layerY;
    }
})

const mousePos = {
    x: 0,
    y: 0,
    isClicking: false,
}

const taskState = {
    selectedColor: null,
    droppedCables: [],
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
    gradient.addColorStop(0, '#333');
    gradient.addColorStop(0.5, '#666');
    gradient.addColorStop(1, '#333');

    ctx.strokeStyle = '#000';
    ctx.lineWidth = lineWidth;

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeRect(lineWidth / 2, lineWidth / 2, canvas.width, canvas.height - lineWidth);
}

function drawLeftHandle() {
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = lineWidth;
    ctx.fillRect(lineWidth / 2, lineWidth / 2, size, canvas.height - lineWidth);
    ctx.strokeRect(lineWidth / 2, lineWidth / 2, size, canvas.height - lineWidth);
}

function drawRightHandle() {
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = lineWidth;
    ctx.fillRect(canvas.width - size - (lineWidth/2), lineWidth / 2, size, canvas.height);
    ctx.strokeRect(canvas.width - size - (lineWidth/2), lineWidth / 2, size, canvas.height - lineWidth);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function sortCables() {
    let localCables = cables;
    return cables.map(cable => {
        const selectedCable = localCables[Math.floor(Math.random() * localCables.length)];
        localCables = localCables.filter(cable => cable !== selectedCable);
        return {
            color: selectedCable,
        };
    });
}

function leftCablesCoordinates() {
    leftCables.forEach((cable, index) => {
        cable.x = lineWidth / 2,
        cable.y = (distance * (index + 1)),
        cable.w = cableWidth - (lineWidth / 2),
        cable.h = cableSize - (lineWidth / 2)
    });
}

function rightCablesCoordinates() {
    rightCables.forEach((cable, index) => {
        cable.x = canvas.width - cableWidth,
        cable.y = (distance * (index + 1)),
        cable.w = cableWidth - (lineWidth / 2),
        cable.h = cableSize - (lineWidth / 2)
    });
}

function drawCables() {
    leftCables.forEach((cable, index) => {
        ctx.fillStyle = cable.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = lineWidth;
        ctx.fillRect(cable.x, cable.y, cable.w, cable.h);
        ctx.strokeRect(cable.x, cable.y, cable.w, cable.h);
    });

    rightCables.forEach((cable, index) => {        
        ctx.fillStyle = cable.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = lineWidth;
        ctx.fillRect(cable.x, cable.y, cable.w, cable.h);
        ctx.strokeRect(cable.x, cable.y, cable.w, cable.h);
    });
}

function drawCableLigature() {
    if (mousePos.isClicking && taskState.selectedColor) {
        const selectedCable = leftCables.find(cable => cable.color === taskState.selectedColor);
        if (selectedCable) {
            ctx.beginPath();
            ctx.fillStyle = selectedCable.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = lineWidth;
            ctx.moveTo(selectedCable.x + selectedCable.w + lineWidth / 2, selectedCable.y);
            ctx.lineTo(mousePos.x, mousePos.y - (cableSize / 2));
            ctx.lineTo(mousePos.x, mousePos.y + (cableSize / 2));
            ctx.lineTo(selectedCable.x + selectedCable.w + lineWidth / 2, selectedCable.y + selectedCable.h);
            ctx.fill();
            ctx.stroke();
        }
    }
}

function drawLinkedCables() {
    taskState.droppedCables.forEach(endCable => {
        const beginCable = leftCables.find(cable => cable.color === endCable.color);
        if (beginCable) {
            ctx.beginPath();
            ctx.fillStyle = endCable.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = lineWidth;
            ctx.moveTo(beginCable.x + beginCable.w + lineWidth / 2, beginCable.y);
            ctx.lineTo(endCable.x, endCable.y);
            ctx.lineTo(endCable.x, endCable.y + (cableSize - lineWidth / 2));
            ctx.lineTo(beginCable.x + beginCable.w + lineWidth / 2, beginCable.y + beginCable.h);
            ctx.fill();
            ctx.stroke();
        }        
    })
}

function checkCableSelected() {
    leftCables.forEach(cable => {
        if (
            cable.x < mousePos.x &&
            cable.x + cable.w > mousePos.x &&
            cable.y < mousePos.y &&
            cable.y + cable.h > mousePos.y
        ) {
            taskState.selectedColor = cable.color;
        }
    });
}

function checkCableDropped() {
    rightCables.forEach(cable => {
        if (
            cable.x < mousePos.x &&
            cable.x + cable.w > mousePos.x &&
            cable.y < mousePos.y &&
            cable.y + cable.h > mousePos.y
        ) {
            taskState.droppedCables.push(cable);
            console.log(taskState);
        }
    });
}

function main() {
    clearCanvas();
    drawBackground();
    drawLeftHandle();
    drawRightHandle();
    drawCables();
    drawCableLigature();
    drawLinkedCables();
    requestAnimationFrame(main);
}

function reset() {
    
}

main();