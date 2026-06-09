/** Procedural ambient audio — subtle, premium, no external files required */

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private windGain: GainNode | null = null;
  private forestGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private insectGain: GainNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private waterNode: AudioBufferSourceNode | null = null;
  private birdTimer: ReturnType<typeof setInterval> | null = null;
  private insectTimer: ReturnType<typeof setInterval> | null = null;
  private started = false;

  async start(): Promise<void> {
    if (this.started || typeof window === "undefined") return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.12;
    this.windGain.connect(this.master);

    this.forestGain = this.ctx.createGain();
    this.forestGain.gain.value = 0.08;
    this.forestGain.connect(this.master);

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.value = 0;
    this.waterGain.connect(this.master);

    this.insectGain = this.ctx.createGain();
    this.insectGain.gain.value = 0;
    this.insectGain.connect(this.master);

    this.startWind();
    this.startWater();
    this.scheduleBirds();
    this.scheduleInsects();
    this.started = true;
  }

  stop(): void {
    this.windNode?.stop();
    this.waterNode?.stop();
    if (this.birdTimer) clearInterval(this.birdTimer);
    if (this.insectTimer) clearInterval(this.insectTimer);
    this.ctx?.close();
    this.started = false;
  }

  setEnabled(enabled: boolean): void {
    if (this.master) {
      this.master.gain.linearRampToValueAtTime(
        enabled ? 0.35 : 0,
        this.ctx!.currentTime + 1.5
      );
    }
  }

  updateMix(scrollProgress: number): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + 0.5;
    const water = Math.max(0, (scrollProgress - 0.55) / 0.25) * 0.15;
    const insects = Math.max(0, (scrollProgress - 0.72) / 0.28) * 0.1;
    const wind = 0.12 - scrollProgress * 0.04;

    this.waterGain?.gain.linearRampToValueAtTime(Math.min(0.15, water), t);
    this.insectGain?.gain.linearRampToValueAtTime(Math.min(0.1, insects), t);
    this.windGain?.gain.linearRampToValueAtTime(Math.max(0.04, wind), t);
  }

  private createNoiseBuffer(duration: number): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const buffer = this.ctx!.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.98 + white * 0.02;
      data[i] = last;
    }
    return buffer;
  }

  private startWind(): void {
    const buffer = this.createNoiseBuffer(4);
    this.windNode = this.ctx!.createBufferSource();
    this.windNode.buffer = buffer;
    this.windNode.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    this.windNode.connect(filter);
    filter.connect(this.windGain!);
    this.windNode.start();
  }

  private startWater(): void {
    const buffer = this.createNoiseBuffer(3);
    this.waterNode = this.ctx!.createBufferSource();
    this.waterNode.buffer = buffer;
    this.waterNode.loop = true;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 2;
    this.waterNode.connect(filter);
    filter.connect(this.waterGain!);
    this.waterNode.start();
  }

  private chirp(
    gain: GainNode,
    freq: number,
    duration: number,
    volume: number
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.05);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    osc.connect(g);
    g.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.05);
  }

  private scheduleBirds(): void {
    this.birdTimer = setInterval(() => {
      if (!this.forestGain || !this.ctx) return;
      const base = 1800 + Math.random() * 2200;
      this.chirp(this.forestGain, base, 0.12, 0.04);
      setTimeout(() => {
        this.chirp(this.forestGain!, base * 1.2, 0.08, 0.025);
      }, 120);
    }, 4000 + Math.random() * 3000);
  }

  private scheduleInsects(): void {
    this.insectTimer = setInterval(() => {
      if (!this.insectGain || !this.ctx) return;
      this.chirp(
        this.insectGain,
        6000 + Math.random() * 3000,
        0.06,
        0.015
      );
    }, 800 + Math.random() * 1200);
  }
}

let engine: AmbientAudioEngine | null = null;

export function getAmbientEngine(): AmbientAudioEngine {
  if (!engine) engine = new AmbientAudioEngine();
  return engine;
}
