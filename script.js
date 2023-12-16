let brewingMethods;
let timerInterval;
let timeElapsed;
let currentStage = 0;
let isTimerRunning = false;

document.getElementById("start-timer").addEventListener("click", function() {
    if (!isTimerRunning) {
        this.textContent = "暫停";
        startBrewingTimer();
    } else {
        this.textContent = "開始";
        pauseTimer();
    }
    isTimerRunning = !isTimerRunning;
});

document.getElementById("reset-timer").addEventListener("click", resetTimer);

fetch('https://raw.githubusercontent.com/Oliver0804/hand-drip-coffee/main/Coffee_Brewing_Methods.json')
    .then(response => response.json())
    .then(data => {
        brewingMethods = data;
        displayBrewingTime();
    })
    .catch(error => console.error('Error loading brewing methods:', error));

function displayBrewingTime() {
    const method = document.getElementById("brewing-method").value;
    const stages = brewingMethods[method].沖泡階段;
    const totalTime = stages.reduce((sum, stage) => sum + stage.時間, 0);
    document.getElementById("brewing-time-display").textContent = `總沖泡時間：${totalTime} 秒`;
}

function startBrewingTimer() {
    const method = document.getElementById("brewing-method").value;
    const stages = brewingMethods[method].沖泡階段;
    const stageTime = stages[currentStage].時間;

    timeElapsed = 0;
    timerInterval = setInterval(() => {
        if (timeElapsed < stageTime) {
            document.getElementById("timer-display").textContent = `計時：${timeElapsed} / ${stageTime} 秒`;
            timeElapsed++;
        } else {
            clearInterval(timerInterval);
            if (currentStage < stages.length - 1) {
                currentStage++;
                startBrewingTimer();
            } else {
                document.getElementById("timer-display").textContent = "沖泡完成！";
                resetTimer();
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("timer-display").textContent = "";
    document.getElementById("start-timer").textContent = "開始";
    currentStage = 0;
    isTimerRunning = false;
}
