// variables to control the rate of generation
let isFocusingLeft = false;
let startTime = Date.now();

// function to generate stars with more of a focus on the left side (to replace ones exiting the right side)
function generateStars() {
  const numStars = isFocusingLeft ? 3 : 1; // more stars after 3 seconds, less before
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // more stars on the left side
    let isLeftSide;
    if (isFocusingLeft) {
      isLeftSide = Math.random() < 0.9; // 90% chance for left side after 3s
    } 
    else {
      isLeftSide = Math.random() < 0.7; // 70% before
    }
    
    let x;
    if (isLeftSide) {
      x = Math.random() * window.innerWidth * 0.5; // random x position on the left half (0 - 50% of width)
    } 
    else {
      x = Math.random() * window.innerWidth * 0.5 + window.innerWidth * 0.5; // random x position on the right half (50% - 100% of width)
    }
    
    const y = Math.random() * window.innerHeight; // random y position within window
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    
    // randomize star size and speed
    const size = Math.random() * 2 + 1; // size between 1 and 3px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${Math.random() * 30 + 20}s`; // random speed
    
    document.body.appendChild(star);
  }
}

// function to create the shooting stars
function createShootingStar() {
  const shootingStar = document.createElement('div');
  shootingStar.classList.add('shooting-star');
  
  // randomize shooting star starting position
  const xStart = Math.random() * window.innerWidth;
  const yStart = Math.random() * window.innerHeight / 2;
  shootingStar.style.left = `${xStart}px`;
  shootingStar.style.top = `${yStart}px`;
  
  // randomize the shooting star direction and speed
  shootingStar.style.animationDuration = `${Math.random() * 1 + 1}s`; // speed between 1-2s
  shootingStar.style.animationDelay = `${Math.random() * 2}s`; // random delay before animation
  
  document.body.appendChild(shootingStar);
  
  // remove shooting star after animation
  setTimeout(() => {
    shootingStar.remove();
  }, 3000); // 3s after being added
}

// function to control the timing of star generation and left-focus switch
function adjustGenerationRate() {
  const elapsed = Date.now() - startTime;
  if (elapsed > 3000) {
    isFocusingLeft = true; // focus left side after 3 seconds
  }
}

// generate stars at a slower pace, every 300 milliseconds so it doesn't get overcrowded
setInterval(generateStars, 300); 
setInterval(adjustGenerationRate, 100); 

// create shooting stars periodically, every 2 seconds
setInterval(createShootingStar, 2000); 

// for the rocket to follow the cursor with lag effect
const rocket = document.getElementById('rocket');

let rocketPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // the initial position of the rocket (top left corner)
let currentRotation = 0;    // to store the current rotation of the rocket
const followSpeed = 0.1;    // adjust this variable for the "looseness" of the follow effect (lower for more lag)
const rotationSpeed = 0.5;  // a slower pivot speed to make transition smoother 
const maxRotationStep = 50; // maximum rotation per frame for smoother transition

// function to smoothly interpolate between the current and target values (lerp)
function lerp(current, target, speed) {
  return current + (target - current) * speed;
}

document.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // calculate the difference between the current position and the cursor position
  const diffX = mouseX - rocketPos.x;
  const diffY = mouseY - rocketPos.y;

  // move the rocket gradually towards the cursor with lag
  rocketPos.x = lerp(rocketPos.x, mouseX, followSpeed);
  rocketPos.y = lerp(rocketPos.y, mouseY, followSpeed);

  // set the new position of the rocket with a lag effect
  rocket.style.left = `${rocketPos.x - rocket.width / 2}px`;
  rocket.style.top = `${rocketPos.y - rocket.height / 2}px`;

  // calculate the target angle to rotate the rocket based on cursor position
  let targetAngle = Math.atan2(mouseY - rocketPos.y, mouseX - rocketPos.x) * 180 / Math.PI;

  // normalize the angle to avoid that weird flipping thing (smooth transition through 90° and -90°)
  let angleDiff = targetAngle - currentRotation;

  // if the angle difference is greater than 180 degrees, normalize it
  if (Math.abs(angleDiff) > 180) {
    if (angleDiff > 0) {
      angleDiff -= 360;
    } 
    else {
      angleDiff += 360;
    }
  }

  // limit the maximum rotation step for a smooth rotation
  const rotationStep = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxRotationStep);

  // update the current rotation
  currentRotation += rotationStep * rotationSpeed;

  // apply the rotation to the rocket to make the top face the cursor
  rocket.style.transformOrigin = 'center top'; 
  rocket.style.transform = `rotate(${currentRotation}deg)`; 
});
