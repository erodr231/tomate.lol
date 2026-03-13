console.log("testing");

// grabbing all my elements i need to control
//html elements
const timer = document.getElementById("timer")

const startBtn = document.getElementById("startBtn");
const timerMode = document.getElementById("mode");

const timerBtns = document.getElementById("timerBtns");
const settingsBtn = document.getElementById("settingsBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

//timer elements
let isPaused = false;
let timerInterval = null;
let minutes = 25;
let seconds = 0;

// FUNCTIONS
function startTimer(){
    timerMode.classList.add("shrink");
    timerBtns.hidden = false
    timer.hidden = false;
    startBtn.hidden = true;

    timerInterval = setInterval(tick, 1000);
}

function tick(){
    if (seconds === 0){ //counting the minutes and seconds
        minutes--;
        seconds = 59;
    } else{
        seconds--;
    }

    timer.textContent = `${minutes}:${seconds < 10 ? '0' :''}${seconds}`; //display this on the screen
}

function toggleTimer(){ // function to toggle resume/pause timer
    let pauseImg = pauseBtn.querySelector('img');

    if (isPaused){ 
        // switch icons
        pauseImg.src = 'images/pauseButton.svg';
        
        //resume 
        timerInterval = setInterval(tick, 1000);
        isPaused = false;
        console.log("I am resuming")
    } else {
        // switch icons
        pauseImg.src = 'images/resume-button.svg';

        clearInterval(timerInterval);
        isPaused = true;
        console.log("I am paused")
    }
} 

// EVENT LISTENERS
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", toggleTimer);