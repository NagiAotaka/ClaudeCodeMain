(function () {
  const display   = document.getElementById('display');
  const startBtn  = document.getElementById('startBtn');
  const pauseBtn  = document.getElementById('pauseBtn');
  const resetBtn  = document.getElementById('resetBtn');
  const minInput  = document.getElementById('minutes');
  const secInput  = document.getElementById('seconds');

  let remaining = 0;
  let intervalId = null;

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
  }

  function setRunning(running) {
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
  }

  startBtn.addEventListener('click', function () {
    const m = parseInt(minInput.value, 10) || 0;
    const s = parseInt(secInput.value, 10) || 0;
    if (intervalId === null) {
      remaining = m * 60 + s;
    }
    if (remaining <= 0) return;
    setRunning(true);
    intervalId = setInterval(function () {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        setRunning(false);
      }
    }, 1000);
  });

  pauseBtn.addEventListener('click', function () {
    clearInterval(intervalId);
    intervalId = null;
    setRunning(false);
  });

  resetBtn.addEventListener('click', function () {
    clearInterval(intervalId);
    intervalId = null;
    remaining = 0;
    updateDisplay();
    setRunning(false);
  });

  updateDisplay();
})();
