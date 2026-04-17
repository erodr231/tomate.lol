
// grabbing all my elements i need to control

// audio
const alarmSound = new Audio('sounds/alarm.mp3');
let volumeSlider = document.getElementById("volumeSlider");

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

// user input
const focusInput = document.getElementById("focusTime");
const breakInput = document.getElementById("breakTime");
const longBreakInput = document.getElementById("longBreakTime");

//session counter
const sessionCounter = document.getElementById("sessionCounter"); // html
const sessionToggle = document.getElementById("sessionToggle"); // checkbox
let showSessionCounter = true; // toggle
let count = 0;
let totalMinutes = 0;

// dark mode
const darkModeToggle = document.getElementById("darkModeToggle"); // checkbox

//timer elements
let isPaused = false; // pause svg switch
let isBreak = false; // focus and break timer

let timerInterval = null;
let startTime = null;
let remainingTime = null; // in seconds, tracks time when left paused

const svgPause = document.getElementById("pauseIcon");
const svgResume = document.getElementById("resumeIcon");

// default times
let focusTime = 25;
let breakTime = 5;
let longBreakTime = 15;
let currentBreak = breakTime; // this will update depending on count
let isLongBreak = false; // determines if in long break mode, will change



// FUNCTIONS
function startTimer(){
    tagline.hidden = true;
    timerMode.classList.add("shrink");
    timerBtns.hidden = false
    timer.hidden = false;
    startBtn.hidden = true;
    sessionCounter.hidden = !showSessionCounter;

    let totalDuration = focusTime * 60;
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
        svgPause.setAttribute('hidden', '');
        svgResume.removeAttribute('hidden');

        if (isBreak){ // if break is over, back to 25 min
            body.classList.remove("breakMode");
            remainingTime = focusTime * 60;
            
            timerMode.textContent = `let's focus!`;
            timer.textContent = `${focusTime}:00`;
            isBreak = false;

        } else { // focus is over, 5 min break or 15 minute long break if count == 4 sessions
            count++; // first thing, increment count
            
            // next check if count is 4
            isLongBreak = count % 4 === 0 && count > 0;
            currentBreak = isLongBreak ? longBreakTime : breakTime; // currentBreak determine if it's a long or default break

            // if not, 5 min break.
            body.classList.add("breakMode");
            remainingTime = currentBreak * 60;

            timerMode.textContent = `take a break!`;
            timer.textContent = `${currentBreak}:00`; // replace breakTime with currentBreak to reflect what break user is on
            isBreak = true;

            
            totalMinutes = count*focusTime;

            if(showSessionCounter){ // displays minutes user has focused
                sessionCounter.hidden = false;
                if (totalMinutes >= 60){
                    let sessionHrs = Math.floor(totalMinutes / 60); // converting to hrs
                    let sessionMin = totalMinutes % 60; // converting the remaining minutes
                    let timeString;

                    if(sessionHrs === 1 && sessionMin === 0){
                        timeString = `1 hour`;
                    } else if (sessionHrs > 1 && sessionMin === 0){
                        timeString = `${sessionHrs} hours`;
                    } else if (sessionHrs === 1 && sessionMin === 1){
                        timeString = `1 hour and 1 minute`;
                    } else if (sessionHrs === 1){
                        timeString = `1 hour and ${sessionMin} minutes`;
                    } else if (sessionMin === 1){
                        timeString = `${sessionHrs} hours and 1 minute`;
                    } else {
                        timeString = `${sessionHrs} hours and ${sessionMin} minutes`;
                    }
                    sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${timeString}!`;
                    
                } else if (totalMinutes === 1){
                    sessionCounter.innerHTML = `focus sessions complete: ${count}</br> that's ${totalMinutes} minute!`;
                } else {
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
        //switch icons
        svgResume.setAttribute('hidden', '');
        svgPause.removeAttribute('hidden');

        //resume -- record new start time based on remaining time
        startTime = Date.now();
        timerInterval = setInterval(tick, 500);
        isPaused = false;
        console.log("I am resuming")
    } else {
        // switch icons
        console.log("I am paused");

        svgPause.setAttribute('hidden', '');
        svgResume.removeAttribute('hidden');

        // pause , save how much time is left
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        remainingTime = remainingTime - elapsed;
        clearInterval(timerInterval);
        isPaused = true;
    }
} 

function restartTimer(){ // restart entire timer to default or to the user's input 
    console.log("restart");
    
    clearInterval(timerInterval); // clear

    remainingTime = isBreak ? currentBreak * 60: focusTime * 60;
    startTime = null;

    const mins = isBreak ? currentBreak : focusTime; // determines if its break or focus time
    timer.textContent = `${mins}:00`;
    
    isPaused = true;
    svgPause.setAttribute('hidden', '');
    svgResume.removeAttribute('hidden');
}

function showSticky(){
    stickyTextArea.toggleAttribute("hidden"); // toggle hides the notepad
}

function showSettings(){
    settingsWin.classList.toggle("open");
}

function saveSettings(){
    // read input values
    const newFocus = Number(focusInput.value);
    const newBreak = Number(breakInput.value);
    const newLongBreak = Number(longBreakInput.value);
    
    // 2. validation for negatives / "0"
    if(newFocus <= 0 || newBreak <= 0 || newLongBreak <= 0){ // commented out for TESTING
        alert("Please enter a valid number in minutes.");
        return;
    }

    // 3. determine what changed
    const focusChange = newFocus != focusTime; 
    const shortBreakChange = newBreak != breakTime;
    const longBreakChange = newLongBreak != longBreakTime;
    
    // 4. update values
    focusTime = newFocus;
    breakTime = newBreak;
    longBreakTime = newLongBreak;
    currentBreak = isLongBreak ? longBreakTime : breakTime;

    // 5. restart if needed
    if (!isBreak && focusChange){
        restartTimer();
    } else if (isBreak && !isLongBreak && shortBreakChange){
        restartTimer()
    } else if (isBreak && isLongBreak && longBreakChange){
        restartTimer();
    }
    // toggle checkbox states
    showSessionCounter = sessionToggle.checked; // if true, showSessions
    sessionCounter.hidden = !showSessionCounter;

    if (darkModeToggle.checked){
        body.classList.add("darkMode");
    } else{
        body.classList.remove("darkMode");
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

volumeSlider.addEventListener()