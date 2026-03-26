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
const stickyBtn = document.getElementById("sticky");
const stickyTextArea = document.querySelector('.stickyNote');
const stickyClose = document.getElementById("closeBtn");

const settingsWin = document.querySelector(".settings");
const settingsClose = document.getElementById("closeSettingsBtn");
const settingsSave = document.getElementById("saveSettings");
const focusInput = document.getElementById("focusTime");
const breakInput = document.getElementById("breakTime");

//timer elements
let isPaused = false; // pause svg switch
let isBreak = false; // focus and break timer

let timerInterval = null;

let seconds = 0;
let pauseImg = pauseBtn.querySelector('img');

// user inputs
let focusTime = 25;
let breakTime = 5;

let minutes = focusTime;

// FUNCTIONS
function startTimer(){
    timerMode.classList.add("shrink");
    timerBtns.hidden = false
    timer.hidden = false;
    startBtn.hidden = true;

    timerInterval = setInterval(tick, 1000);
}

function tick(){ // timer logic
    if (seconds === 0 && minutes === 0){ // 25 min timer over
        
        clearInterval(timerInterval);
        isPaused = true;
        pauseImg.src = 'images/resume-button.svg';

        if (isBreak){ // if break is over, back to 25 min
            minutes = focusTime;
            seconds = 0;
            
            timer.textContent = `${focusTime}:00`;
            isBreak = false;
        } else { // focus is over, 5 min break
            minutes = breakTime;
            seconds = 0;

            timer.textContent = `${breakTime}:00`
            isBreak = true;
        }
        return;
    }

    if (seconds === 0){ // countdown to 0 
        minutes--;
        seconds = 59;
    } else{
        seconds--;
    }

    timer.textContent = `${minutes}:${seconds < 10 ? '0' :''}${seconds}`; // display countdown on the screen, 0 remains in place if less than 10
}

function toggleTimer(){ // function to toggle resume/pause timer
    

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

function restartTimer(){ // restart entire timer to default or to the user's input 
    console.log("restart");
    
    clearInterval(timerInterval); // clear

    minutes = isBreak ? breakTime : focusTime; // determines if its break or focus time
    seconds = 0;
    
    timer.textContent = `${minutes}:${seconds < 10 ? '0' :''}${seconds}`;
    
    
    isPaused = true;
    pauseBtn.querySelector('img').src = 'images/resume-button.svg';
}

function showSticky(){
    stickyTextArea.toggleAttribute("hidden"); // toggle hides the notepad
}

function showSettings(){
    settingsWin.toggleAttribute("hidden");
}

function saveSettings(){
    // grab input values, update focusTime and breakTime with those values, reset timer with new times
    focusTime = Number(focusInput.value);
    breakTime = Number(breakInput.value);

    restartTimer(); // restarts timer
}

// EVENT LISTENERS
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", toggleTimer);
restartBtn.addEventListener("click", restartTimer);

stickyBtn.addEventListener("click", showSticky);
stickyClose.addEventListener("click", showSticky);

settingsBtn.addEventListener("click", showSettings);
settingsClose.addEventListener("click", showSettings);
settingsSave.addEventListener("click", saveSettings);
