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
    // load webcam
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
    select('#status').html('Model Loaded');
}

function gotResults(err, result) {
    if (err) {
        console.log(err);
        return
    }

   // fill webcam in canvas
image(video, 0,0, width, height);
   // put results in variable detections
    detections = result;
    if (detections) {
        // pass result to 2 functions - drawBox/drawLandmark
        if (detections.length > 0) {
            drawBox(detections);
            drawLandmarksMouth (detections);
            drawLandmarksLeftEye (detections);
            drawLandmarksRightEye (detections);
            drawLandmarks(detections);
        }
    }
    // loop detection
    faceapi.detect(gotResults);
}

// draw the face !!!
function drawBox(detections){
    for(let i = 0; i < detections.length; i++){
        const alignedRect = detections[i].alignedRect
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight  = alignedRect._box._height
        // define face . XYWH
        let faceX = x+boxWidth/12
        let faceY = y-boxHeight/4
        let faceW = boxWidth-boxWidth/6
        let faceH = (boxHeight*5)/4
        // draw face 
        fill(255);
        stroke(0);
        strokeWeight(8);
        rect(faceX, faceY, faceW, faceH); 
        // draw grid lines 
        fill(0);
        noStroke(255,228,0);
        rect (faceX+0.15*faceW,faceY,8,faceH);
        rect (faceX+0.3*faceW,faceY,8,faceH);
        rect (faceX,faceY+0.2*faceH,faceW,10);
        rect (faceX,faceY+0.85*faceH,faceW,10);
        // draw yellow decro rect chin
        fill(255,228,0);
        noStroke(255,228,0);
        rect (faceX+4,faceY+4,0.15*faceW-4,0.2*faceH-4);
        rect (faceX+0.3*faceW+8,faceY+0.85*faceH+10,0.7*faceW-10,0.15*faceH-14);
    }   
}

// get mouth data
function drawLandmarksMouth(detections){   
    // mouth shape  definition
    fill(255,0,0,200);
    noStroke(255,0,0);
    //strokeWeight(8);
    for(let z = 0; z < detections.length; z++){
        const mouth = detections[z].parts.mouth;  
        drawPartMouth(mouth, true);     
    }
}

//draw mouth shape
function drawPartMouth(feature, closed){  
    let z = 0;
        const x = feature[z]._x;
        const y = feature[z]._y;
        const alignedRect = detections[z].alignedRect; 
        const boxWidth = alignedRect._box._width; 
        const boxHeight  = alignedRect._box._height;    
        //upper lip
        quad(x-boxWidth/15, y, x+boxWidth/50, y-20, x+3*boxWidth/10, y-20, x+3.5*boxWidth/10, y);  
        //lower lip
        quad(x, y, x+boxWidth/20, y+20, x+2.5*boxWidth/10, y+20, x+3*boxWidth/10, y);                  
}

// get LeftEye data
function drawLandmarksLeftEye(detections){   
    //shape  definition
    fill(255,0,0,200);
    noStroke(255,0,0);
    //strokeWeight(8);
    for(let z = 0; z < detections.length; z++){
        const leftEye = detections[z].parts.leftEye;       
        drawPartLeftEye(leftEye, true);     
    }
}

//draw leftEye shape
function drawPartLeftEye(feature, closed){  
    let z = 0;
        const x = feature[z]._x;
        const y = feature[z]._y;
        const alignedRect = detections[z].alignedRect; 
        const boxWidth = alignedRect._box._width; 
        const boxHeight  = alignedRect._box._height;
        // draw 1/2 circle
        rect(x-boxWidth/6, y-boxHeight/4, boxWidth/2.5, boxWidth/2.5,0); 
        //arc(x-boxWidth/40, y, boxWidth/2.5, boxWidth/2.5, PI, 0);  
}

// get rightEye data
function drawLandmarksRightEye(detections){   
    for(let z = 0; z < detections.length; z++){
        const rightEye = detections[z].parts.rightEye;         
        drawPartRightEye(rightEye, true);     
    }
}

//draw rightEye shape
function drawPartRightEye(feature, closed){
    let z = 0;
        const x = feature[z]._x;
        const y = feature[z]._y;
        const alignedRect = detections[z].alignedRect; 
        const boxWidth = alignedRect._box._width; 
        const boxHeight  = alignedRect._box._height;
        // draw right eye 1/2 circle
        fill(18,83,246,200);
        noStroke();
        rect(x-boxWidth/20, y-boxHeight/10, boxWidth/4, boxWidth/12,0); 
        //arc(x+boxWidth/20, y-boxWidth/10, boxWidth/4, boxWidth/4, 0, PI);   
}

// get landmark line work  data
function drawLandmarks(detections){
    // landmark line definition
    noFill(); // Make fill transparent
    stroke(0);
    strokeWeight(6);
    // get landmark points
    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

        drawPart(mouth, true);
        drawPart(nose, true);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, true);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, true);
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
        endShape();
    }    
}



