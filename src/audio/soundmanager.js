// SoundManager — Web Audio API synthesized sounds + procedural Doom-style music
// No asset loading needed — everything generated on the fly.

export class SoundManager {
  constructor() {
    this._ctx = null;
    this._musicGain = null;
    this._sfxGain = null;
    this._musicPlaying = false;
    this._musicTimeout = null;

    this.musicEnabled = true;
    this.sfxEnabled = true;
  }

  // Must be called after a user gesture (Chrome autoplay policy)
  init() {
    if (this._ctx) return;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();

      const comp = this._ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 8;
      comp.connect(this._ctx.destination);

      this._musicGain = this._ctx.createGain();
      this._musicGain.gain.value = 0.22;
      this._musicGain.connect(comp);

      this._sfxGain = this._ctx.createGain();
      this._sfxGain.gain.value = 0.45;
      this._sfxGain.connect(comp);
    } catch (e) {
      console.warn('Web Audio not available:', e);
    }
  }

  get _ready() { return !!this._ctx; }

  // ── Music toggles ─────────────────────────────────────────────────────────

  toggleMusic() {
    if (!this._ready) return this.musicEnabled;
    this.musicEnabled = !this.musicEnabled;
    this._musicGain.gain.value = this.musicEnabled ? 0.22 : 0;
    if (this.musicEnabled) this.startMusic();
    else this.stopMusic();
    return this.musicEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    if (this._ready) this._sfxGain.gain.value = this.sfxEnabled ? 0.45 : 0;
    return this.sfxEnabled;
  }

  // ── Music ─────────────────────────────────────────────────────────────────

  startMusic() {
    if (!this._ready || this._musicPlaying || !this.musicEnabled) return;
    this._musicPlaying = true;
    this._loopRiff();
  }

  stopMusic() {
    this._musicPlaying = false;
    clearTimeout(this._musicTimeout);
  }

  _loopRiff() {
    if (!this._ready || !this._musicPlaying || !this.musicEnabled) return;
    const duration = this._scheduleRiff(this._ctx.currentTime);
    this._musicTimeout = setTimeout(() => this._loopRiff(), (duration - 0.05) * 1000);
  }

  // Upbeat D-major cartoon adventure theme — 126 BPM, 8-bar loop
  _scheduleRiff(t) {
    const BPM = 126;
    const Q   = 60 / BPM;       // quarter note  ≈ 0.476 s
    const E   = Q * 0.5;        // eighth  note
    const H   = Q * 2;          // half    note

    // D major frequencies
    const D3=146.83, A3=220.00, B3=246.94, FS3=185.00, G3=196.00;
    const D4=293.66, E4=329.63, FS4=369.99, G4=392.00, A4=440.00, B4=493.88;
    const CS5=554.37, D5=587.33, E5=659.25, FS5=739.99, G5=783.99, A5=880.00, B5=987.77, D6=1174.66;

    // ---- Lead melody (square-wave, NES style) -------------------------
    // [freq, duration, gain]  (gain 1.0 = normal, 0 = rest)
    const MELODY = [
      // Bar 1-2: Joyful ascent
      [D5,E,1],[FS5,E,1],[A5,E,1],[D6,E,1],[B5,E,1],[A5,E,0.8],[G5,E,0.7],[FS5,E,0.7],
      [E5,Q,0.9],[FS5,Q,1],[E5,Q,0.8],[D5,Q,0.9],
      // Bar 3-4: Playful bounce
      [A5,E,1],[G5,E,0.8],[FS5,E,0.8],[E5,E,0.8],[D5,E,0.7],[E5,E,0.8],[FS5,E,0.9],[A5,E,1],
      [G5,Q,0.9],[FS5,Q,0.9],[D5,H,1],
      // Bar 5-6: Mid energy
      [FS5,E,1],[G5,E,0.9],[A5,E,1],[B5,E,1],[A5,E,0.9],[G5,E,0.8],[FS5,Q,1],
      [B5,E,1],[A5,E,0.9],[G5,E,0.8],[FS5,E,0.8],[E5,Q,0.8],[FS5,Q,1],
      // Bar 7-8: Climax + resolve
      [D6,E,1],[B5,E,1],[A5,E,0.9],[G5,E,0.8],[FS5,E,0.8],[E5,E,0.7],[D5,E,0.7],[E5,E,0.8],
      [FS5,Q,0.9],[A5,Q,1],[D5,H,1],
    ];

    // ---- Harmony (triangle, a major-3rd below) ------------------------
    const HARMONY = [
      [B4,E,0.4],[D5,E,0.4],[FS5,E,0.4],[B5,E,0.4],[G5,E,0.35],[FS5,E,0.3],[E5,E,0.3],[D5,E,0.3],
      [CS5,Q,0.35],[D5,Q,0.4],[CS5,Q,0.35],[B4,Q,0.4],
      [FS5,E,0.4],[E5,E,0.35],[D5,E,0.35],[CS5,E,0.35],[B4,E,0.3],[CS5,E,0.35],[D5,E,0.4],[FS5,E,0.4],
      [E5,Q,0.4],[D5,Q,0.4],[B4,H,0.4],
      [D5,E,0.4],[E5,E,0.4],[FS5,E,0.4],[G5,E,0.4],[FS5,E,0.35],[E5,E,0.3],[D5,Q,0.4],
      [G5,E,0.4],[FS5,E,0.35],[E5,E,0.3],[D5,E,0.3],[CS5,Q,0.3],[D5,Q,0.4],
      [B5,E,0.4],[G5,E,0.35],[FS5,E,0.35],[E5,E,0.3],[D5,E,0.3],[CS5,E,0.3],[B4,E,0.3],[CS5,E,0.3],
      [D5,Q,0.4],[FS5,Q,0.4],[B4,H,0.4],
    ];

    // ---- Bass line (sine, follows chord roots) ------------------------
    const BASS = [
      [D3,Q],[A3,Q],[D3,Q],[A3,Q],   // D
      [D3,Q],[A3,Q],[D3,Q],[A3,Q],
      [G3,Q],[D4,Q],[G3,Q],[D4,Q],   // G
      [A3,Q],[E4,Q],[D3,H],           // A → D
      [B3,Q],[FS4,Q],[B3,Q],[FS4,Q], // Bm
      [G3,Q],[D4,Q],[G3,Q],[D4,Q],   // G
      [A3,Q],[E4,Q],[A3,Q],[E4,Q],   // A
      [D3,Q],[A3,Q],[D3,H],           // D resolve
    ];

    // Schedule melody (square wave, no distortion)
    let off = 0;
    for (const [freq, dur, g] of MELODY) {
      if (freq > 0) this._melodNote('square', freq, t + off, dur * 0.82, 0.07 * g);
      off += dur;
    }

    // Schedule harmony (triangle, softer)
    off = 0;
    for (const [freq, dur, g] of HARMONY) {
      if (freq > 0) this._melodNote('triangle', freq, t + off, dur * 0.78, 0.04 * g);
      off += dur;
    }

    // Schedule bass (sine, gentle)
    off = 0;
    for (const [freq, dur] of BASS) {
      if (freq > 0) this._melodNote('sine', freq, t + off, dur * 0.88, 0.11);
      off += dur;
    }

    // Light drums
    const totalBeats = Math.ceil(off / Q);
    for (let i = 0; i < totalBeats * 2; i++) {   // every 8th
      const bt = t + i * E;
      if (i % 8 === 0 || i % 8 === 4) this._kick(bt);       // kick on 1 & 3
      if (i % 8 === 2 || i % 8 === 6) this._snare(bt);      // snare on 2 & 4
      this._hihat(bt);                                         // 8th-note hihat
    }

    return off;
  }

  // Generic melodic note — no distortion, clean attack/release
  _melodNote(type, freq, startTime, dur, amp) {
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(amp, startTime + 0.012);
    g.gain.setValueAtTime(amp, startTime + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(g); g.connect(this._musicGain);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.02);
  }

  _kick(t) {
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.10);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(g); g.connect(this._musicGain);
    osc.start(t); osc.stop(t + 0.16);
  }

  _snare(t) {
    const ctx = this._ctx;
    const bufLen = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass'; hpf.frequency.value = 2000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    src.connect(hpf); hpf.connect(g); g.connect(this._musicGain);
    src.start(t); src.stop(t + 0.10);
  }

  _hihat(t) {
    const ctx = this._ctx;
    const bufLen = Math.floor(ctx.sampleRate * 0.04);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass'; hpf.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    src.connect(hpf); hpf.connect(g); g.connect(this._musicGain);
    src.start(t); src.stop(t + 0.05);
  }

  // ── SFX ──────────────────────────────────────────────────────────────────

  playShoot(weapon = 'gumgun') {
    if (!this._ready || !this.sfxEnabled) return;
    switch (weapon) {
      case 'gumgun':  return this._sfxPop();
      case 'icer':    return this._sfxIce();
      case 'plushie': return this._sfxThud();
      case 'stinker': return this._sfxStink();
      default:        return this._sfxPop();
    }
  }

  playPlayerHit()  { if (this._ready && this.sfxEnabled) this._sfxPlayerHit(); }
  playEnemyHit()   { if (this._ready && this.sfxEnabled) this._sfxSqueak(); }
  playEnemyDeath() { if (this._ready && this.sfxEnabled) this._sfxWah(); }
  playPickup()     { if (this._ready && this.sfxEnabled) this._sfxChime(); }

  // 🎈 Balloon gun — short pop + tone click
  _sfxPop() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hpf = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 1400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    src.connect(hpf); hpf.connect(g); g.connect(this._sfxGain);
    src.start(t); src.stop(t + 0.08);

    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(240, t); osc.frequency.exponentialRampToValueAtTime(70, t + 0.1);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.35, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(g2); g2.connect(this._sfxGain); osc.start(t); osc.stop(t + 0.12);
  }

  // 🍦 Ice blaster — high→low sweep, icy shimmer
  _sfxIce() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, t); osc.frequency.exponentialRampToValueAtTime(220, t + 0.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    const delay = ctx.createDelay(0.1); delay.delayTime.value = 0.035;
    const dg = ctx.createGain(); dg.gain.value = 0.28;
    osc.connect(g); g.connect(this._sfxGain); g.connect(delay); delay.connect(dg); dg.connect(this._sfxGain);
    osc.start(t); osc.stop(t + 0.35);
  }

  // 🧸 Plushie — soft thud
  _sfxThud() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t); osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(g); g.connect(this._sfxGain); osc.start(t); osc.stop(t + 0.12);
  }

  // 💨 Stink spray — descending "pfffffft"
  _sfxStink() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const dur = 0.4;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.exp(-i/(d.length*0.35));
    const src = ctx.createBufferSource(); src.buffer = buf;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(1200, t); lpf.frequency.exponentialRampToValueAtTime(300, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.65, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(lpf); lpf.connect(g); g.connect(this._sfxGain); src.start(t); src.stop(t + dur + 0.05);
  }

  // 💥 Player hit — heavy distorted thud
  _sfxPlayerHit() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const osc = ctx.createOscillator(); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t); osc.frequency.exponentialRampToValueAtTime(35, t + 0.28);
    const n = 256; const c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i*2)/n-1; c[i] = ((Math.PI+400)*x)/(Math.PI+400*Math.abs(x)); }
    const ws = ctx.createWaveShaper(); ws.curve = c;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(ws); ws.connect(g); g.connect(this._sfxGain); osc.start(t); osc.stop(t + 0.3);
  }

  // 🎯 Enemy hit — short cartoon squeak
  _sfxSqueak() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const osc = ctx.createOscillator(); osc.type = 'square';
    osc.frequency.setValueAtTime(700, t); osc.frequency.exponentialRampToValueAtTime(350, t + 0.07);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(g); g.connect(this._sfxGain); osc.start(t); osc.stop(t + 0.09);
  }

  // 💀 Enemy death — descending wah cartoon
  _sfxWah() {
    const ctx = this._ctx; const t = ctx.currentTime;
    const osc = ctx.createOscillator(); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, t); osc.frequency.exponentialRampToValueAtTime(55, t + 0.55);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, t); filter.frequency.exponentialRampToValueAtTime(120, t + 0.55);
    filter.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.connect(filter); filter.connect(g); g.connect(this._sfxGain); osc.start(t); osc.stop(t + 0.6);
  }

  // ⭐ Pickup — ascending 4-note chime
  _sfxChime() {
    const ctx = this._ctx; const t = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      const g = ctx.createGain(); const s = t + i * 0.09;
      g.gain.setValueAtTime(0.42, s); g.gain.exponentialRampToValueAtTime(0.001, s + 0.22);
      osc.connect(g); g.connect(this._sfxGain); osc.start(s); osc.stop(s + 0.25);
    });
  }
}
