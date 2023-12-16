let brewingMethods;
fetch('brewing-methods.json')
    .then(response => response.json())
    .then(data => brewingMethods = data);

let timerInterval;
let timeRemaining;
let currentStage = 0;
let isPaused = true;

document.getElementById("start-pause-timer").addEventListener("click", function() {
    if (isPaused) {
        this.textContent = "暫停";
        if (!timerInterval) {
            startBrewingTimer(brewingMethods[document.getElementById("brewing-method").value].沖泡階段);
        } else {
            resumeTimer();
        }
    } else {
        this.textContent = "開始";
        pauseTimer();
    }
    isPaused = !isPaused;
});

document.getElementById("reset-timer").addEventListener("click", function() {
    resetTimer();
});

function startBrewingTimer(stages) {
    currentStage = 0;
    nextStage(stages);
}

function nextStage(stages) {
    if (currentStage < stages.length) {
        setTimer(stages[currentStage].時間, () => nextStage(stages));
        currentStage++;
    } else {
        document.getElementById("timer-display").innerHTML = "沖泡完成！";
        resetTimer();
    }
}

function setTimer(duration, callback) {
    timeRemaining = duration;
    timerInterval = setInterval(function() {
        document.getElementById("timer-display").innerHTML = `剩餘時間：${timeRemaining} 秒`;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById("ding-sound").play();
            callback();
        }
        timeRemaining--;
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resumeTimer() {
    setTimer(timeRemaining, () => nextStage(brewingMethods[document.getElementById("brewing-method").value].沖泡階段));
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("timer-display").innerHTML = "";
    document.getElementById("start-pause-timer").textContent = "開始";
    timerInterval = null;
    currentStage = 0;
    isPaused = true;
}
