var trex, trex_collided;
var trex_running;
var ground; 
var groundImage; 
var invisibleGround; 
var cloudImage; 
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6; 

var score; 

var PLAY = 1; 
var END = 0; 
var gameState = PLAY; 

var cloudsGroup, obstaclesGroup; 
var gameOverImg, restarImg; 
var gameOver, restart; 
var jumpSound, checkPointSound, dieSound; 

function preload(){
  trex_running = loadAnimation("charm1.png", "charm2.png", "charm3.png"); 
  trex_collided = loadAnimation("charmCollided.png");
  
  groundImage = loadImage("ground2.png"); 
  cloudImage = loadImage("nube.png"); 

  obstacle1 = loadImage("obstacle1.png");   
  obstacle2 = loadImage("obstacle2.png"); 
  obstacle3 = loadImage("obstacle3.png"); 
  obstacle4 = loadImage("obstacle4.png"); 
  obstacle5 = loadImage("obstacle5.png"); 
  obstacle6 = loadImage("obstacle6.png"); 

  gameOverImg = loadImage("gameOver.png"); 
  restarImg = loadImage("restart.png"); 

  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3"); 
  checkPointSound = loadSound("checkPoint.mp3"); 
}

function setup(){
  createCanvas(600,400);
  
  //crear sprite de Trex
  trex = createSprite(50, 170, 50, 20); 
  trex.addAnimation("running", trex_running); 
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.15; 
  
  ground = createSprite(300, 230, 500, 10); 
  ground.addImage("suelo", groundImage); 
  

  invisibleGround = createSprite(100, 230, 500, 20); 
  invisibleGround.visible = false; 

  gameOver = createSprite(250, 200); 
  gameOver.addImage("gameOver", gameOverImg); 
  gameOver.scale = 0.5; 

  restart = createSprite(250, 150); 
  restart.addImage("restart_Img", restarImg); 
  restart.scale = 0.5; 
  //cloudsGroup = createGroup(); 
  cloudsGroup = new Group(); 
  //obstaclesGroup = createGroup(); 
  obstaclesGroup = new Group(); 

  score = 0;
  trex.setCollider("rectangle",0,0,40,10);
  //trex.debug = true;  
      
}

function draw(){
  background("white");   
  // console.log(frameCount); 
  text("Puntuación: "+ score, 500,50);  

  if(gameState === PLAY){

    gameOver.visible = false; 
    restart.visible = false; 

    ground.velocityX = -(4+3 * score/100); 
    score = score + Math.round(frameCount/60);

    if(score > 0 && score % 100 === 0){
      checkPointSound.play(); 
    }

    if(keyDown("space") && trex.y >= 100){
      trex.velocityY = -7; 
      jumpSound.play(); 
    }
  
    trex.velocityY = trex.velocityY + 0.8; 
  
    spawnClouds(); 
    spawnObstacles(); 

    if(ground.x < 0){
      ground.x = ground.width/2;     
    }

    if(obstaclesGroup.isTouching(trex)){
      gameState = END; 
    }
  
  }else if(gameState === END){   
    
    gameOver.visible = true; 
    restart.visible = true;

    obstaclesGroup.setVelocityXEach(0); 
    cloudsGroup.setVelocityXEach(0);
    
    ground.velocityX = 0; 
    trex.velocityX = 0; 
    trex.velocityY = 0;

    trex.changeAnimation("collided", trex_collided);
    trex.scale= 0.20; 

    obstaclesGroup.depth = trex.depth; 
    trex.depth = trex.depth +1; 
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }  
  
  trex.collide(invisibleGround);  
  drawSprites(); 
}


function spawnClouds(){
  if(frameCount % 60 === 0){
    var aleatorio = Math.round(random(10, 150)); 
    var cloud = createSprite(600, aleatorio, 40, 10); 
    cloud.velocityX = -(3 + score/100); 
    cloud.addImage(cloudImage); 
    cloud.scale = 0.12; 

    cloud.lifetime = 200; 

    cloud.depth = trex.depth; 
    trex.depth = trex.depth +1; 
    cloudsGroup.add(cloud); 
  }  
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    var randY = Math.round(random(230, 250));
    var obstacle = createSprite(400, randY, 10, 40); 
    obstacle.velocityX = -(6 + score/100); 
    
    var rand = Math.round(random(1, 6));
  
    switch(rand){
      case 1: obstacle.addImage(obstacle1); 
        break; 
      case 2: obstacle.addImage(obstacle2); 
        break; 
      case 3: obstacle.addImage(obstacle3); 
        break; 
      case 4: obstacle.addImage(obstacle4); 
        break; 
      case 5: obstacle.addImage(obstacle5); 
        break; 
      case 6: obstacle.addImage(obstacle6); 
        break;       
      default: break; 
    }
    obstacle.scale = 0.7; 
    obstacle.lifetime = 300; 
    obstaclesGroup.add(obstacle); 
  }
}
