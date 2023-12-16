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
        displayBrewingTime(); // 初始時顯示第一個沖泡法的時間
        initializeBrewingMethodSelector();
    })
    .catch(error => console.error('Error loading brewing methods:', error));

function displayBrewingTime() {
    const method = document.getElementById("brewing-method").value;
    const stages = brewingMethods[method].沖泡階段;
    const totalTime = stages.reduce((sum, stage) => sum + stage.時間, 0);
    document.getElementById("brewing-time-display").textContent = `總沖泡時間：${totalTime} 秒`;
}
// 初始化沖泡方法選擇器
function initializeBrewingMethodSelector() {
    const selector = document.getElementById("brewing-method");
    selector.innerHTML = ''; // 清空現有的選項

    for (const method in brewingMethods) {
        const option = document.createElement("option");
        option.value = method;
        option.textContent = brewingMethods[method].沖泡法;
        selector.appendChild(option);
    }

    // 綁定 onChange 事件以更新沖泡時間
    selector.onchange = displayBrewingTime;
}

function displayBrewingTime() {
    const method = document.getElementById("brewing-method").value;
    const stages = brewingMethods[method].沖泡階段;
    const totalTime = stages.reduce((sum, stage) => sum + stage.時間, 0);
    document.getElementById("brewing-time-display").textContent = `總沖泡時間：${totalTime} 秒`;
}



// 這個函數計算在當前階段之前的所有階段中已經經過的總時間
function getTotalElapsed(stages, currentStage) {
    return stages.slice(0, currentStage).reduce((sum, stage) => sum + stage.時間, 0);
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

    timeElapsed = 1; // 從 1 秒開始計時
    const totalTime = stages.reduce((sum, stage) => sum + stage.時間, 0); // 計算總時間

    timerInterval = setInterval(() => {
        if (timeElapsed <= stageTime) {
            document.getElementById("timer-display").textContent = `計時：${timeElapsed} / ${stageTime} 秒`;
            updateProgressBar(timeElapsed + getTotalElapsed(stages, currentStage) - 1, totalTime);
            timeElapsed++;
        } else {
            // 階段結束時更新進度條到當前階段的終點
            updateProgressBar(getTotalElapsed(stages, currentStage + 1), totalTime);

            clearInterval(timerInterval);
            if (currentStage === stages.length - 1) {
                playDingSound(true); // 最後一階段結束，播放三次聲音
                document.getElementById("timer-display").textContent = "沖泡完成！";
                updateProgressBar(totalTime, totalTime); // 確保進度條達到 100%
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

function updateProgressBar(elapsed, total) {
    const progressPercentage = (elapsed / total) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercentage}%`;
}

function getTotalElapsed(stages, currentStage) {
    return stages.slice(0, currentStage).reduce((sum, stage) => sum + stage.時間, 0);
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

// 更新計時顯示的函數
function updateTimerDisplay(elapsed, total) {
    document.getElementById("timer-display").textContent = `計時：${elapsed} / ${total} 秒`;
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


document.getElementById("calculate-ratio").addEventListener("click", function() {
    const coffeeGrams = document.getElementById("coffee-grams").value;
    const waterVolume = document.getElementById("water-volume").value;
    if (coffeeGrams > 0) {
        const ratio = waterVolume / coffeeGrams;
        document.getElementById("ratio-display").textContent = `粉水比: 1:${ratio.toFixed(2)}`;
    } else {
        document.getElementById("ratio-display").textContent = "請輸入有效的咖啡粉重量";
    }
});