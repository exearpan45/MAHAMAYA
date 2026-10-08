/**
 * Devotional background music player.
 * Uses the local devotional MP3 supplied for the Pinrra Durga Mandir website.
 * OFF by default. Starts only after the visitor explicitly enables music.
 */

class DevotionalAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  private getAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio('/devotional-music.mp3');
      this.audio.loop = true;
      this.audio.preload = 'none';
      this.audio.volume = 0.28;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
      });

      this.audio.addEventListener('error', () => {
        this.isPlaying = false;
      });
    }

    return this.audio;
  }

  public init() {
    // Audio is intentionally not started automatically.
    // Browser autoplay restrictions are respected.
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }

    this.start();
    return this.isPlaying;
  }

  public start() {
    try {
      const audio = this.getAudio();

      // Update the UI immediately after the user explicitly enables music.
      this.isPlaying = true;

      const playPromise = audio.play();

      if (playPromise) {
        playPromise.catch(() => {
          this.isPlaying = false;
        });
      }
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.audio) {
      this.isPlaying = false;
      return;
    }

    this.audio.pause();
    this.isPlaying = false;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const devotionalAudio = new DevotionalAudioEngine();
