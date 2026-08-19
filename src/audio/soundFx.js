// ════════════════════════════════════════════════════════════════
// KRIS SHEDRACH PORTFOLIO OS — SYNTHESIZED WEB AUDIO SFX ENGINE
// Pure procedural audio synthesis. Zero external audio file assets needed.
// ════════════════════════════════════════════════════════════════

class SoundFxEngine {
  constructor() {
    this.ctx = null
    this.muted = false
    this.volume = 0.4
    this.initialized = false
  }

  init() {
    if (this.ctx) return
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
        this.initialized = true
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e)
    }
  }

  ensureContext() {
    if (!this.ctx) this.init()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx && !this.muted
  }

  setMuted(mute) {
    this.muted = mute
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  // 1. Subtle futuristic click
  playClick() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, t)
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04)

    gain.gain.setValueAtTime(this.volume * 0.25, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(t)
    osc.stop(t + 0.04)
  }

  // 2. Window Open Sweep
  playWindowOpen() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, t)
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.12)

    gain.gain.setValueAtTime(0.01, t)
    gain.gain.linearRampToValueAtTime(this.volume * 0.2, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(t)
    osc.stop(t + 0.15)
  }

  // 3. Window Close Soft Fade
  playWindowClose() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, t)
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.1)

    gain.gain.setValueAtTime(this.volume * 0.2, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(t)
    osc.stop(t + 0.11)
  }

  // 4. Terminal Keystroke Clack
  playTypeKey() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    const freq = 600 + Math.random() * 500
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.025)

    gain.gain.setValueAtTime(this.volume * 0.15, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(t)
    osc.stop(t + 0.03)
  }

  // 5. System Boot Chime (Rich Sci-Fi Polyphonic Synthesizer)
  playBootChime() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25] // C maj 7 / 9
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, t + i * 0.07)

      gain.gain.setValueAtTime(0.001, t + i * 0.07)
      gain.gain.linearRampToValueAtTime(this.volume * 0.18, t + i * 0.07 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 1.2)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(t + i * 0.07)
      osc.stop(t + i * 0.07 + 1.3)
    })
  }

  // 6. Notification Beep
  playNotification() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const chord = [587.33, 880.00] // D5, A5
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t + idx * 0.06)
      gain.gain.setValueAtTime(this.volume * 0.18, t + idx * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.25)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t + idx * 0.06)
      osc.stop(t + idx * 0.06 + 0.3)
    })
  }

  // 7. Success / Mission Accomplished
  playSuccess() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const notes = [440, 554.37, 659.25, 880]
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t + idx * 0.08)
      gain.gain.setValueAtTime(this.volume * 0.18, t + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t + idx * 0.08)
      osc.stop(t + idx * 0.08 + 0.4)
    })
  }

  // 8. Laser Blast for Game
  playLaser() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.12)

    gain.gain.setValueAtTime(this.volume * 0.22, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(t)
    osc.stop(t + 0.13)
  }

  // 9. Explosion for Game
  playExplosion() {
    if (!this.ensureContext()) return
    const t = this.ctx.currentTime
    const bufferSize = this.ctx.sampleRate * 0.3
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, t)
    filter.frequency.exponentialRampToValueAtTime(40, t + 0.3)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(this.volume * 0.35, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(t)
    noise.stop(t + 0.31)
  }
}

export const soundFx = new SoundFxEngine()
