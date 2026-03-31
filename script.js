console.log("testing");

// grabbing all my elements i need to control

// audio
const alarmSound = new Audio('sounds/alarm.mp3');

//html elements
const body = document.getElementById("body");
const timer = document.getElementById("timer")

const startBtn = document.getElementById("startBtn");
const timerMode = document.getElementById("mode");
const tagline = document.getElementById("tagline")

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

//session counter
const sessionCounter = document.getElementById("sessionCounter"); // html
const sessionToggle = document.getElementById("sessionToggle"); // checkbox
let showSessionCounter = true; // toggle
let count = 0;
let totalMinutes = 0;

//timer elements
let isPaused = false; // pause svg switch
let isBreak = false; // focus and break timer

let timerInterval = null;
let startTime = null;
let remainingTime = null; // in seconds, tracks time when left paused
let totalDuration = null; // in seconds

let pauseImg = pauseBtn.querySelector('img');

// user inputs
let focusTime = 25;
let breakTime = 5;



// FUNCTIONS
function startTimer(){
    tagline.hidden = true;
    timerMode.classList.add("shrink");
    timerBtns.hidden = false
    timer.hidden = false;
    startBtn.hidden = true;
    sessionCounter.hidden = !showSessionCounter;

    totalDuration = focusTime * 60;
    remainingTime = totalDuration;
    startTime = Date.now();

    timerInterval = setInterval(tick, 500);
}

function tick(){ // timer logic
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = remainingTime - elapsed;

    if (remaining <= 0){ // timer over
        alarmSound.play();
        clearInterval(timerInterval);
        isPaused = true;
        pauseImg.src = 'images/resume-button.svg';

        if (isBreak){ // if break is over, back to 25 min
            remainingTime = focusTime * 60;
            
            timerMode.textContent = `lets focus!`;
            timer.textContent = `${focusTime}:00`;
            isBreak = false;

        } else { // focus is over, 5 min break
            body.classList.add("breakMode")
            remainingTime = breakTime * 60;

            timerMode.textContent = `take a break!`;
            timer.textContent = `${breakTime}:00`;
            isBreak = true;

            count++;
            totalMinutes = count*focusTime;

            if(showSessionCounter){
                sessionCounter.hidden = false;
                if (totalMinutes >= 60){
                    let sessionHrs = Math.floor(totalMinutes / 60);
                    let sessionMin = totalMinutes % 60;

                    if (sessionHrs == 1 && sessionMin == 0){
                        sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${sessionHrs} hour!`;
                    } else if (sessionHrs == 1){
                        sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${sessionHrs} hour and ${sessionMin} minutes!`;
                    } else if (sessionMin == 0){
                        sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${sessionHrs} hour!`;
                    } else{
                        sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${sessionHrs} hours and ${sessionMin} minutes!`;
                    }
                    
                } else{
                    sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${totalMinutes} minutes!`;
                }
                
            }else{
                sessionCounter.hidden = true;
            }
            
        }
        startTime = null;
        return;
    }
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    timer.textContent = `${minutes}:${seconds < 10 ? '0' :''}${seconds}`; // display countdown on the screen, 0 remains in place if less than 10
}

function toggleTimer(){ // function to toggle resume/pause timer
    if (isPaused){ 
        // switch icons
        pauseImg.src = 'images/pauseButton.svg';
        
        //resume -- record new start time based on remaining time
        startTime = Date.now();
        timerInterval = setInterval(tick, 500);
        isPaused = false;
        console.log("I am resuming")
    } else {
        // switch icons
        pauseImg.src = 'images/resume-button.svg';

        // pause , save how much time is left
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        remainingTime = remainingTime - elapsed;
        clearInterval(timerInterval);
        isPaused = true;
        console.log("I am paused")
    }
} 

function restartTimer(){ // restart entire timer to default or to the user's input 
    console.log("restart");
    
    clearInterval(timerInterval); // clear

    remainingTime = isBreak ? breakTime * 60: focusTime * 60;
    startTime = null;

    const mins = isBreak ? breakTime : focusTime; // determines if its break or focus time
    timer.textContent = `${mins}:00`;
    
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
    
    const newFocus = Number(focusInput.value);
    const newBreak = Number(breakInput.value);
    
    if(newFocus <= 0 || newBreak <= 0){ // validation
        alert("Please enter a valid number in minutes.");
        return;
    }

    const timesChanged = newFocus !== focusTime || newBreak !== breakTime;
    console.log("newFocus:", newFocus, "focusTime:", focusTime, "timesChanged:", timesChanged);

    focusTime = newFocus;
    breakTime = newBreak;
    
    // checkbox state
    showSessionCounter = sessionToggle.checked; // if true, showSessions
    sessionCounter.hidden = !showSessionCounter;

    if(timesChanged){ // when setting apply, only resets timer if user inputs times.
        restartTimer(); // restarts timer from beginning
    }

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
