function createTimer(seconds) {
  return { remaining: Math.max(0, seconds), running: false };
}

function tick(timer) {
  if (timer.remaining <= 0) return { ...timer, remaining: 0 };
  return { ...timer, remaining: timer.remaining - 1 };
}

function formatTime(seconds) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

module.exports = { createTimer, tick, formatTime };
