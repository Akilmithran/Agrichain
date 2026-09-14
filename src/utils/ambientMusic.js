// Web Audio API Ambient Indian Rural / Flute & Nature Soundscape
class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.intervalId = null;
    this.windSource = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play serene pentatonic flute tone
  playFluteTone(freq, duration = 3.5) {
    if (!this.ctx || !this.isPlaying) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Warm bamboo flute acoustic filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2.2, this.ctx.currentTime);

      // Smooth flute envelope (soft attack & gentle decay)
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  // Soft breeze / wind ambient noise
  playWindAmbiance() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02; // Pink/Brown noise
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      this.windSource = noise;
    } catch (e) {
      console.warn(e);
    }
  }

  start() {
    this.init();
    this.isPlaying = true;
    this.playWindAmbiance();

    // Raag Bhupali / Desh peaceful pentatonic frequencies (Indian Flute scale: Sa, Re, Ga, Pa, Dha)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
    let noteIdx = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      const melody = [0, 1, 2, 4, 3, 2, 4, 5, 4, 2, 1, 0];
      const freq = notes[melody[noteIdx % melody.length]];
      this.playFluteTone(freq, 3.2);
      noteIdx++;
      
      const nextDelay = 2200 + Math.random() * 1200;
      this.intervalId = setTimeout(playNext, nextDelay);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    if (this.windSource) {
      try { this.windSource.stop(); } catch (e) {}
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try { this.ctx.suspend(); } catch (e) {}
    }
  }

  setVolume(vol) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }
}

export const ambientSound = new AmbientSoundscape();
