let faceapi;
let video;
let detections;

// defult model options
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function setup() {
    let canvas = createCanvas(window.innerWidth * 0.4, window.innerWidth * 0.3);
    canvas.parent('fdcontainer');
    video = createCapture(VIDEO);
    video.size(width, height);
    video.parent('fdcontainer');
    faceapi = ml5.faceApi(video, detection_options, modelReady);
}

 // start to detect
function modelReady() {
    //loade model details in console
    console.log(faceapi);
    // put results into gotResults function
    faceapi.detect(gotResults);
    // loading
    select('#status').html('Model Loaded');
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
    }

   // fill webcam in canvas
image(video, 0,0, width, height);
filter(THRESHOLD);

   // put results in variable detections
    detections = result;
    if (detections) {

        // pass result to 2 functions - drawBox/drawLandmark
        if (detections.length > 0) {
            drawBox(detections);
            drawLeftEye (detections);
            drawRightEye (detections);
            drawMouth(detections);
            drawLandmarks(detections);
            drawLandmarksTwo(detections); 
        }
    }

    // loop detection
    faceapi.detect(gotResults);
}

// draw the face !!!
function drawBox(detections){
    for(let i = 0; i < detections.length; i++){
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight  = alignedRect._box._height
        
        // define face . XYWH
        let faceX = x+boxWidth/16;
        let faceY = y-boxHeight/4;
        let faceW = boxWidth-boxWidth/8;
        let faceH = boxHeight*5/4

        // define face2 . XYWH
        let faceH2 = 0.75*faceH
        let faceW2 = 0.65*faceW
        let x2 = faceX + 2*(faceW-faceW2)/3
        let y2 = faceY + 4*(faceH-faceH2)/5

        // draw face 
        stroke(248,0,148);
        fill(0,20,123);
        strokeWeight(8);
        rect(faceX-0.1*faceW, faceY-0.05*faceH, 1.2*faceW, 1.1*faceH,160);
        // draw face - upper layer
        fill(0, 230,210);
        stroke(248,0,148);
        strokeWeight(4);
        rect(faceX, faceY, faceW, faceH,160);

        // draw yellow rect  
        fill(249,247,0);
        noStroke();
        rect(faceX-faceW/8, faceY+faceH/1.4, faceW/2, faceH/9);

        // draw  face 2
        fill(255);
        stroke(249,247,0);
        rect(x2, y2, faceW2, faceH2,100);

        // draw blue rect  
        fill(42,60,213);
        noStroke();
        rect(faceX+faceW/14, y2+faceH/8, faceW/8, faceH/6);

    }   
}

// Left Eye 
function drawLeftEye(detections){   
    //shape  definition
    fill(59,255,26,150);
    noStroke();
    //strokeWeight(8);
    for(let z = 0; z < detections.length; z++){ 
        const leftEye = detections[z].parts.leftEye;    
        drawPartLeftEye(leftEye, true); 
    } 
}

//draw left Eye shape
function drawPartLeftEye(feature, closed){  
    let z = 0;
        const x = feature[z]._x;
        const y = feature[z]._y;
        const alignedRect = detections[z].alignedRect; 
        const boxWidth = alignedRect._box._width; 
        const boxHeight  = alignedRect._box._height;

        // draw green ellipse
        ellipseMode(CENTER);
        ellipse(x+0.2*boxWidth, y, 0.7*boxWidth, 0.55*boxHeight);  
        
        // draw red circle
        fill(248,0,148);
        ellipse(x+0.1*boxWidth, y-0.1/4*boxHeight, 0.4*boxWidth); 
}

// Right Eye !!!
function drawRightEye(detections){   
    //shape  definition
    noStroke();
    //strokeWeight(8);
    for(let z = 0; z < detections.length; z++){ 
        const rightEye = detections[z].parts.rightEye;    
        drawPartRightEye(rightEye, true); 
    } 
}
//draw right Eye shape
function drawPartRightEye(feature, closed){  
    let z = 0;
        const x = feature[z]._x;
        const y = feature[z]._y;
        const alignedRect = detections[z].alignedRect; 
        const boxWidth = alignedRect._box._width; 
        const boxHeight  = alignedRect._box._height;

        // draw blue ellipse
        fill(255,0,0);
        ellipse(x+0.1*boxWidth, y, 0.24*boxWidth); 

        // draw pink rect
        fill(255,0,127);
        let x2 = x+0.1*boxWidth - 0.12*boxWidth
        rect(x2, y, 0.3*boxWidth, 0.08*boxWidth); 

        // draw yellow rect near lipe
        fill(249,247,0);
        rect(0.9*x, y+0.55*boxHeight, boxWidth/4, boxHeight/7,100);
}


// Mouth !!!
function drawMouth(detections){
    fill(255,0,0);
    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        drawPartMouth(mouth,true );   
    }
}
//draw mouth shape
function drawPartMouth(feature, closed){
    fill(255,0,0);
    stroke(248,0,148);
    strokeWeight(12);
    strokeJoin(ROUND);

    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        curveVertex(x-0.04*x, y+0.04*y);  
    }
    if(closed === true){
        endShape(CLOSE);
    } else {
        endShape();
    }   
}


// Landmarks line work !!!
function drawLandmarks(detections){ 
    fill(0);
    stroke(0);
    strokeWeight(4);
    strokeJoin(BEVEL);
    for(let i = 0; i < detections.length; i++){      
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;
        const nose = detections[i].parts.nose;
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, true);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, true);
        drawPartTwo(nose, true);
    }
}
//draw lanmark line work
function drawPart(feature, closed){    
    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        curveVertex(x, y);
    }    
    if(closed === true){
        endShape(CLOSE);
    } else {
        endShape();    }   
}


// Mouth landmark line work
function drawLandmarksTwo(detections){
    noFill();
    stroke(0);
    strokeWeight(4);
    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        drawPartTwo(mouth,true );  
    }
}
//draw mouth landmark line work
function drawPartTwo(feature, closed){
    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        curveVertex(x, y);
    }    
    if(closed === true){
        endShape(CLOSE);
    } else {
        endShape();
    }   
}



