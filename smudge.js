/* jshint ignore:start*/
const ctx = canvas.getContext("2d");
const background = createCanvas(canvas.width,canvas.height);
const brushSize = 64;
const bs = brushSize;
const bsh = bs / 2;
const smudgeAmount = 0.25; // values from 0 none to 1 full

// simple mouse
const mouse  = {x : 0, y : 0, button : false}
function mouseEvents(e){
	mouse.x = e.pageX;
	mouse.y = e.pageY;
	mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
}
["down","up","move"].forEach(name => document.addEventListener("mouse"+name,mouseEvents));


// brush gradient for feather
const grad = ctx.createRadialGradient(bsh,bsh,0,bsh,bsh,bsh);
grad.addColorStop(0,"black");
grad.addColorStop(1,"rgba(0,0,0,0)");
const brush = createCanvas(brushSize)

// creates an offscreen canvas
function createCanvas(w,h = w){
  var c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.ctx = c.getContext("2d");
  return c;
}

// get the brush from source ctx at x,y
function brushFrom(ctx,x,y){
  brush.ctx.globalCompositeOperation = "source-over";
  brush.ctx.globalAlpha = 1;
  brush.ctx.drawImage(ctx.canvas,-(x - bsh),-(y - bsh));
  brush.ctx.globalCompositeOperation = "destination-in";
  brush.ctx.globalAlpha = 1;
  brush.ctx.fillStyle = grad;
  brush.ctx.fillRect(0,0,bs,bs);
}
  
  



				
// short cut vars 
var w = canvas.width;
var h = canvas.height;
var cw = w / 2;  // center 
var ch = h / 2;
var globalTime;
var lastX;
var lastY;

// update background is size changed
function createBackground(){
  background.width = w;
  background.height = h;
  background.ctx.fillStyle = "white";
  background.ctx.fillRect(0,0,w,h);
  doFor(64,()=>{
    background.ctx.fillStyle = `rgb(${randI(255)},${randI(255)},${randI(255)}`;
    background.ctx.fillRect(randI(w),randI(h),randI(10,100),randI(10,100));
  });
}



// main update function
function update(timer){
    globalTime = timer;
    ctx.setTransform(1,0,0,1,0,0); // reset transform
    ctx.globalAlpha = 1;           // reset alpha
	if(w !== innerWidth || h !== innerHeight){
		cw = (w = canvas.width = innerWidth) / 2;
		ch = (h = canvas.height = innerHeight) / 2;
    createBackground();
	}else{
		ctx.clearRect(0,0,w,h);
	}
  ctx.drawImage(background,0,0);


  // if mouse down then do the smudge for all pixels between last mouse and mouse now
  if(mouse.button){
    brush.ctx.globalAlpha = smudgeAmount;
    var dx = mouse.x - lastX;
    var dy = mouse.y - lastY;
    var dist = Math.sqrt(dx*dx+dy*dy);
    for(var i = 0;i < dist; i += 1){
      var ni = i / dist;
      brushFrom(background.ctx,lastX + dx * ni,lastY + dy * ni);
      ni = (i+1) / dist;
      background.ctx.drawImage(brush,lastX + dx * ni - bsh,lastY + dy * ni - bsh);
    }
    
  }else{
     brush.ctx.clearRect(0,0,bs,bs); /// clear brush if not used
  }
	
	lastX = mouse.x;
	lastY = mouse.y;
	
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
