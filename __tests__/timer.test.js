const { createTimer, tick, formatTime } = require('../timer');

describe('createTimer', () => {
  test('指定した秒数でタイマーを作成する', () => {
    const t = createTimer(90);
    expect(t.remaining).toBe(90);
    expect(t.running).toBe(false);
  });

  test('負の値は0になる', () => {
    const t = createTimer(-5);
    expect(t.remaining).toBe(0);
  });
});

describe('tick', () => {
  test('残り秒数を1減らす', () => {
    const t = createTimer(10);
    const next = tick(t);
    expect(next.remaining).toBe(9);
  });

  test('0のときにticしても0のまま', () => {
    const t = createTimer(0);
    const next = tick(t);
    expect(next.remaining).toBe(0);
  });

  test('1のときにticすると0になる', () => {
    const t = createTimer(1);
    const next = tick(t);
    expect(next.remaining).toBe(0);
  });

  test('元のタイマーは変更しない（immutable）', () => {
    const t = createTimer(5);
    tick(t);
    expect(t.remaining).toBe(5);
  });
});

describe('formatTime', () => {
  test('00:00 を返す（0秒）', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  test('01:00 を返す（60秒）', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  test('01:30 を返す（90秒）', () => {
    expect(formatTime(90)).toBe('01:30');
  });

  test('10:00 を返す（600秒）', () => {
    expect(formatTime(600)).toBe('10:00');
  });

  test('00:09 を返す（9秒）', () => {
    expect(formatTime(9)).toBe('00:09');
  });

  test('負の値は00:00を返す', () => {
    expect(formatTime(-1)).toBe('00:00');
  });
});
