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

    if (currentStage >= stages.length) {
        currentStage = 0; // 重置為第一階段
    }

    const stageDetails = stages[currentStage];
    const stageTime = stageDetails.時間;

    updateStageInfo(stageDetails, currentStage, stages.length);

    timeElapsed = 0;
    timerInterval = setInterval(() => {
        if (timeElapsed < stageTime) {
            document.getElementById("timer-display").textContent = `計時：${timeElapsed} / ${stageTime} 秒`;
            timeElapsed++;
        } else {
            clearInterval(timerInterval);
            if (currentStage === stages.length - 1) {
                playDingSound(true); // 最後一階段結束，播放三次聲音
                document.getElementById("timer-display").textContent = "沖泡完成！";
                isTimerRunning = false;
                document.getElementById("start-timer").textContent = "開始";
                currentStage = 0; // 重置為第一階段
            } else {
                playDingSound(false); // 非最後一階段結束，播放一次聲音
                currentStage++;
                startBrewingTimer(); // 開始下一階段
            }
        }
    }, 1000);
}

function playDingSound(isFinalStage) {
    const dingSound = document.getElementById("ding-sound");
    dingSound.play();
    if (isFinalStage) {
        setTimeout(() => { dingSound.play(); }, 500);
        setTimeout(() => { dingSound.play(); }, 1000);
    }
}


function updateStageDisplay(currentStage, totalStages) {
    const stageNumber = currentStage + 1; // 人類可讀的階段數（從1開始）
    document.getElementById("stage-display").textContent = `第${stageNumber}階段 [${stageNumber}/${totalStages}]`;
}

function updateStageInfo(stageDetails, currentStage, totalStages) {
    const stageNumber = currentStage + 1; // 人類可讀的階段數（從1開始）
    document.getElementById("stage-display").textContent = `第${stageNumber}階段 [${stageNumber}/${totalStages}]`;
    document.getElementById("stage-name").textContent = stageDetails.階段;
    document.getElementById("water-amount").textContent = `水量: ${stageDetails.水量}`;
    document.getElementById("flow-rate").textContent = `流速大小: ${stageDetails.流速大小}`;
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


document.getElementById("test-sound").addEventListener("click", function() {
    document.getElementById("ding-sound").play();
});