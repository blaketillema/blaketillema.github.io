let colours = [];
let radius = 0;
let steps = 0;


// TODO: MOVE COLOURS AROUND


function removeColour(li){
    let ul = document.getElementById('coloursList');
    if(!ul) return;
    ul.removeChild(li);

    update();
}

function moveColourUp(li){
    let ul = document.getElementById('coloursList');
    if(!ul) return;
    if(li.previousSibling){
        ul.insertBefore(li, li.previousSibling);
        update();
    };
}

function moveColourDown(li){
    let ul = document.getElementById('coloursList');
    if(!ul) return;
    if(li.nextSibling){
        ul.insertBefore(li.nextSibling, li);
        update();
    }
}

function addColour(){
    let ul = document.getElementById('coloursList');
    if(!ul) return;
    // <li><input type="color" value="#000000" /><button>Remove</button><button>Up</button><button>Down</button></li>
    let li = document.createElement('li');

    let input = document.createElement('input');
    input.setAttribute('type', 'color');
    input.oninput = () => {update()};
    li.appendChild(input);

    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {removeColour(li)};
    li.appendChild(removeButton);

    let upButton = document.createElement('button');
    upButton.textContent = 'Up';
    upButton.onclick = () => {moveColourUp(li)};
    li.appendChild(upButton)

    let downButton = document.createElement('button');
    downButton.textContent = 'Down';
    downButton.onclick = () => {moveColourDown(li)};
    li.append(downButton);

    ul.appendChild(li);

    update();
}

function getCanvas(){
    let canvasElements = document.getElementsByTagName('canvas');
    if(!canvasElements) return;
    return canvasElements[0];
}

window.onload = function(){
    let canvas = getCanvas();
    if(!canvas) return;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.width;
    update();
}

function sample(num1, num2, progress){
    return num1 + (num2 - num1) * progress;
}

function sampleColour(colour1, colour2, progress){
    return {
        r: sample(colour1.r, colour2.r, progress),
        g: sample(colour1.g, colour2.g, progress),
        b: sample(colour1.b, colour2.b, progress)
    };
}

function hexToColour(hex){
    return {
        r: parseInt(`0x${hex.slice(1, 3)}`, 16),
        g: parseInt(`0x${hex.slice(3, 5)}`, 16),
        b: parseInt(`0x${hex.slice(5, 7)}`, 16)
    };
}

function colourToHex(colour){
    let r = Math.floor(colour.r).toString(16).padStart(2, "0");
    let g = Math.floor(colour.g).toString(16).padStart(2, "0");
    let b = Math.floor(colour.b).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`
}

function sampleColours(samples){
    let gradient = [];

    let progressPoints = [];
    for(let i = 0; i < samples + 1; i++) progressPoints.push(i * (1.0 / (samples)));

    let colourBoundaries = [];
    for(let i = 0; i < colours.length; i++) colourBoundaries.push(i * (1.0 / (colours.length - 1)));

    for(let i = 0; i < progressPoints.length; i++){
        let progress = progressPoints[i];
        let colourIdx = 1;
        while(progress > colourBoundaries[colourIdx]) colourIdx++;
        gradient.push(
            colourToHex(
                sampleColour(
                    hexToColour(colours[colourIdx-1]), 
                    hexToColour(colours[colourIdx]),
                    (progress - colourBoundaries[colourIdx-1]) / (colourBoundaries[colourIdx] - colourBoundaries[colourIdx-1])
            )));
    }

    return gradient;
}

function updateColours(){
    let ul = document.getElementById('coloursList');
    if(!ul) return;
    colours = [];
    for(let li of ul.getElementsByTagName('li')){
        let inputs = li.getElementsByTagName('input');
        if(!inputs) continue;
        colours.push(inputs[0].value);
    }
}

function updateSteps(){
    let stepsInput = document.getElementById('stepsInput');
    if(!stepsInput) return;
    steps = parseInt(stepsInput.value);
    let stepsOutput = document.getElementById('stepsOutput');
    if(!stepsOutput) return;
    stepsOutput.textContent = steps.toString();
}

function updateRadius(){
    let radiusInput = document.getElementById('radiusInput');
    if(!radiusInput) return;
    radius = parseInt(radiusInput.value);
    let radiusOutput = document.getElementById('radiusOutput');
    if(!radiusOutput) return;
    radiusOutput.textContent = radius.toString();
}

function draw(){

    let canvas = getCanvas();
    if(!canvas) return;
    let context = canvas.getContext('2d');
    if(!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if(colours.length == 0) return;
    if(colours.length == 1){
        context.fillStyle = colours[0];
        context.beginPath();
        context.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            canvas.height / 2,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
        return;
    }

    let gradient = sampleColours(steps);

    let innerRadius = (radius / 100) * canvas.width / 2;
    let radiusStep = (canvas.width / 2 - innerRadius) / (gradient.length - 1);

    for(let i = gradient.length - 1; i >= 0; i--){
        context.fillStyle = gradient[i];
        context.beginPath();
        context.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            innerRadius + radiusStep * i,
            innerRadius + radiusStep * i,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
    }
}

function update(){
    updateColours();
    updateSteps();
    updateRadius();
    draw();
}