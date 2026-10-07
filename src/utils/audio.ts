/**
 * Devotional Indian ambient sound synthesizer using standard Web Audio API.
 * Creates an authentic, gentle Tanpura drone (Sa-Pa fundamental + overtones)
 * with soft reverent bells and ambient temple warmth.
 * 100% royalty-free, zero bandwidth cost, zero copyright risk.
 */

class DevotionalAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;

  public init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Audio context may not be supported or allowed yet
    }
  }

  public toggle(): boolean {
    try {
      if (this.isPlaying) {
        this.stop();
        return false;
      } else {
        this.start();
        return this.isPlaying;
      }
    } catch {
      return false;
    }
  }

  public start() {
    try {
      this.init();
      if (!this.ctx) return;

      if (this.isPlaying) return;
      this.isPlaying = true;

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

    // Fundamental frequencies for Tanpura in C# (Sa = 138.59 Hz, Pa = 207.65 Hz)
    const baseFreqs = [138.59, 207.65, 277.18, 415.3];

    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle slow vibrato / tremolo
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.005, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
    });

    // Gentle occasional temple bell / ghanta harmonic chime every ~12 seconds
    const chimeNotes = [554.37, 659.25, 830.61]; // C#5, E5, G#5
    let chimeIdx = 0;

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = chimeNotes[chimeIdx % chimeNotes.length];
      chimeIdx++;

      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(note, this.ctx.currentTime);

      bellGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);

      bellOsc.connect(bellGain);
      bellGain.connect(this.masterGain);

      bellOsc.start();
      bellOsc.stop(this.ctx.currentTime + 4.6);
    }, 11000);
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          if (this.ctx && !this.isPlaying) {
            this.ctx.close();
            this.ctx = null;
          }
        }, 1300);
      } catch {
        // fallback
      }
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const devotionalAudio = new DevotionalAudioEngine();
