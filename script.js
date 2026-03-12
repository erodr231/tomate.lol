console.log("testing");

// grabbing all my elements i need to control
const timer = document.getElementById("timer")

const startBtn = document.getElementById("startBtn");
const timerMode = document.getElementById("mode");

const timerBtns = document.getElementById("timerBtns");
const settingsBtn = document.getElementById("settingsBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

// EVENT LISTENERS
startBtn.addEventListener("click", ()=>{
    timerMode.classList.add("shrink");
    timerBtns.hidden = false
    timer.hidden = false;
    startBtn.hidden = true;
})


