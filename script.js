let startTime, elapsedTime = 0, timerInterval;
let laps = [];

function formatTime(time) {
    const date = new Date(time);
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
    return `${minutes}:${seconds}.${milliseconds}`;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        document.getElementById("time").textContent = formatTime(elapsedTime);
    }, 10);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById("time").textContent = "00:00:00.000";
    laps = [];
    renderLaps();
}

function lapTimer() {
    laps.push({ label: `Lap ${laps.length + 1}`, time: elapsedTime });
    renderLaps();
}

function updateLapStats() {
    let total = laps.reduce((acc, lap) => acc + lap.time, 0);
    let avg = laps.length > 0 ? total / laps.length : 0;

    document.getElementById('avg-lap-time').textContent = formatTime(avg);
    document.getElementById('total-time').textContent = formatTime(total);
}

function highlightFastestAndSlowest() {
    if (laps.length > 1) {
        const fastestLapIndex = laps.reduce((minIndex, lap, index, arr) => lap.time < arr[minIndex].time ? index : minIndex, 0);
        const slowestLapIndex = laps.reduce((maxIndex, lap, index, arr) => lap.time > arr[maxIndex].time ? index : maxIndex, 0);

        laps.forEach((lap, index) => {
            const lapElement = document.getElementById(`lap-${index}`);
            lapElement.classList.remove('fastest', 'slowest');

            if (index === fastestLapIndex) {
                lapElement.classList.add('fastest');
            } else if (index === slowestLapIndex) {
                lapElement.classList.add('slowest');
            }
        });
    }
}

function renderLaps() {
    const lapList = document.getElementById('lap-list');
    lapList.innerHTML = ''; // Clear current list

    laps.forEach((lap, index) => {
        const li = document.createElement('li');
        li.id = `lap-${index}`;
        li.innerHTML = `${lap.label}: ${formatTime(lap.time)}`;
        lapList.appendChild(li);
    });

    updateLapStats();
    highlightFastestAndSlowest();
}

// Sort Laps by time
document.getElementById('sort-asc').addEventListener('click', () => {
    laps.sort((a, b) => a.time - b.time);
    renderLaps();
});

document.getElementById('sort-desc').addEventListener('click', () => {
    laps.sort((a, b) => b.time - a.time);
    renderLaps();
});

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("lap").addEventListener("click", lapTimer);
