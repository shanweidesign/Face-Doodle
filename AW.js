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
    // define model, use webcam in model
    faceapi = ml5.faceApi(video, detection_options, modelReady);

}

 // start to detect
function modelReady() {
    //loade model details in console
    console.log(faceapi);
    // put results into gotResults function
    faceapi.detect(gotResults);
    // loading
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
    }

   // fill webcam in canvas
image(video, 0,0, width, height);
filter(GRAY);

   // put results in variable detections
    detections = result;
    if (detections) {

        // pass result to 2 functions - drawBox/drawLandmark
        if (detections.length > 0) {
            drawBox(detections);
            drawEyes(detections);
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

        rectMode(CENTER);
        ellipseMode(CENTER);

        // define nude face . XYWH
        let faceW = 0.85 * boxWidth;
        let faceH = 1.24 * boxHeight;
        let faceX = x + boxWidth/2 
        let faceY = y + 0.3 * boxHeight

        // define yellow face  . XYWH
        let faceH2 = 1.15*faceH
        let faceW2 = 1.12*faceW
        let x2 = faceX - 0.55*(faceW2-faceW);
        let y2 = faceY - 0.55*(faceH2-faceH);

        // draw pink face 
        fill(255,0,122);
        noStroke();
        ellipse(faceX, faceY-0.25*faceH/2, 1.25*faceH, 1.25*faceH);
        
        // draw  yellow face 
        fill(255,266,4);
        noStroke();
        rect(x2, y2, faceW2, faceH2,300);

        // draw nude face 
        fill(255, 209, 190);
        stroke(0);
        strokeWeight(4);
        rect(faceX, faceY, faceW, faceH,160);

         // draw hair
        fill(255,266,4);
        noStroke();
        rect(faceX-0.18*faceW, faceY-0.36*faceH, 0.7*faceW, faceH/3, 160,8,160,16);

    }   
}

// Left Eye !!!
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

        // draw pink eye shadow
        fill(255,0,122);
        rect(x+boxWidth/20, y-boxHeight/20, 0.25*boxWidth, 0.08*boxWidth,0,100,0,100);
}

// Right Eye !!!
function drawRightEye(detections){   
    //shape  definition
    fill(59,255,26,150);
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
        // draw pink eye shadow
        fill(255,0,122);
        rect(x+boxWidth/9, y-boxHeight/20, 0.22*boxWidth, 0.08*boxWidth,100,0,100,0); 
        // draw yellow dot
        fill(0);
        stroke(249,247,0);
        strokeWeight(3);
        ellipse(x+boxWidth/6, y+0.3*boxHeight, boxWidth/24, boxWidth/24);
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
    fill(255,0,122);
    stroke(255,16,142);
    strokeWeight(8);
    strokeJoin(ROUND);

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

// Eyes !!!  Yellow eye shadow !!!
function drawEyes(detections){
    for(let i = 0; i < detections.length; i++){
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        drawPartEyes(leftEye,true);  
        drawPartEyes(rightEye,true);  
    }
}
//draw yelloe eye shadow shape
function drawPartEyes(feature, closed){
    noFill();
    stroke(255,266,4);
    strokeWeight(20);
    strokeJoin(ROUND);

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
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, true);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, true);
        
    }
}
//draw landmark line work eyes & brows
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


// Mouth landmark mouth & nose
function drawLandmarksTwo(detections){
    fill(255,0,122);
    stroke(0);
    strokeWeight(4);
    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        const nose = detections[i].parts.nose;
        drawPartTwo(mouth,true ); 
        drawPartTwo(nose, true); 
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



