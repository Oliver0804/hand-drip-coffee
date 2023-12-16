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

// Previous JavaScript code...

document.getElementById("start-timer").addEventListener("click", function() {
    const coffeeGrams = document.getElementById("coffee-grams").value;
    const brewingMethod = document.getElementById("brewing-method").value;
    const stages = brewingMethods[brewingMethod].沖泡階段;
    const totalWater = coffeeGrams * (brewingMethod === "一刀流" ? 16 : 15); // 16:1 or 15:1 ratio
    startBrewingTimer(stages, totalWater);
});

function startBrewingTimer(stages, totalWater) {
    // ...rest of the function...
    function nextStage() {
        if (currentStage < stages.length) {
            const stageWater = totalWater * (stages[currentStage].水量 / stages.reduce((acc, stage) => acc + stage.水量, 0));
            setTimer(stages[currentStage].時間, stageWater, nextStage);
            currentStage++;
        } else {
            document.getElementById("timer-display").innerHTML = "沖泡完成！";
            resetTimer();
        }
    }
    nextStage();
}

function setTimer(duration, water, callback) {
    let time = 0;
    timerInterval = setInterval(function() {
        document.getElementById("timer-display").innerHTML = `計時：${time} / ${duration} 秒`;
        document.getElementById("water-display").innerHTML = `注水量：${((time / duration) * water).toFixed(2)} ml`;
        if (time >= duration) {
            clearInterval(timerInterval);
            document.getElementById("ding-sound").play();
            callback();
        }
        time++;
    }, 1000);
}


