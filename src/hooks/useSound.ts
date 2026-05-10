import { useRef, useCallback } from "react";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }, []);

  const playCoin = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4200, ctx.currentTime + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.5);
  }, [getCtx]);

  const playSplash = useCallback(() => {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + 0.8);
  }, [getCtx]);

  const playMagic = useCallback(() => {
    const ctx = getCtx();
    [0, 0.1, 0.2].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      const baseFreq = 400 + i * 200;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, ctx.currentTime + delay + 0.8);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.2);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.2);
    });
  }, [getCtx]);

  const playStarAppear = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      [0, 0.12, 0.28, 0.48].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        const freqs = [1800, 2400, 3000, 2200];
        osc.frequency.setValueAtTime(freqs[i], ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(freqs[i] * 1.3, ctx.currentTime + delay + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.5);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 1.5);
      });
    } catch (_) { /* silent */ }
  }, []);

  return { playCoin, playSplash, playMagic, playStarAppear };
}
