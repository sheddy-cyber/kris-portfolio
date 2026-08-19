// ════════════════════════════════════════════════════════════════
// KRIS SHEDRACH PORTFOLIO OS — PROCEDURAL SYNTHWAVE RADIO ENGINE
// Generates infinite chill cyberpunk music and feeds real-time FFT
// frequency data into spectrum visualizer canvas.
// ════════════════════════════════════════════════════════════════

class ProceduralSynthRadio {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.analyser = null
    this.isPlaying = false
    this.currentTrackIndex = 0
    this.timerId = null
    this.step = 0
    this.volume = 0.35

    this.tracks = [
      {
        id: 'track-1',
        title: 'Quantum Drift',
        artist: 'Kris Shedrach (Procedural AI Synth)',
        genre: 'Cyber Ambient / Lo-Fi',
        bpm: 78,
        root: 220, // A3
        scale: [0, 3, 5, 7, 10, 12, 15, 17], // Minor pentatonic
        chords: [
          [220.00, 261.63, 329.63, 392.00], // Am7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [196.00, 246.94, 293.66, 349.23], // G7
          [130.81, 164.81, 196.00, 246.94], // Cmaj7
        ]
      },
      {
        id: 'track-2',
        title: 'Neon Horizon',
        artist: 'Kris Shedrach (Procedural AI Synth)',
        genre: 'Synthwave / Chillwave',
        bpm: 96,
        root: 293.66, // D4
        scale: [0, 2, 4, 7, 9, 12, 14, 16], // Major pentatonic
        chords: [
          [146.83, 220.00, 293.66, 369.99], // Dmaj7
          [196.00, 246.94, 293.66, 392.00], // Gmaj7
          [220.00, 277.18, 329.63, 440.00], // A
          [164.81, 220.00, 261.63, 329.63], // F#m7
        ]
      },
      {
        id: 'track-3',
        title: 'Obsidian Protocol',
        artist: 'Kris Shedrach (Procedural AI Synth)',
        genre: 'Cyberpunk Dystopia / Deep Ambient',
        bpm: 64,
        root: 164.81, // E3
        scale: [0, 2, 3, 5, 7, 8, 10, 12], // Aeolian
        chords: [
          [82.41, 123.47, 164.81, 196.00], // Em
          [110.00, 146.83, 174.61, 220.00], // Am
          [98.00, 146.83, 196.00, 246.94], // G
          [73.42, 110.00, 146.83, 174.61], // Dm
        ]
      }
    ]
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    this.ctx = new AudioContext()

    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime)

    // Analyser node for rendering visualizer bars
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 64
    this.analyser.smoothingTimeConstant = 0.8

    // Stereo Delay effect
    this.delay = this.ctx.createDelay()
    this.delay.delayTime.value = 0.35
    this.feedback = this.ctx.createGain()
    this.feedback.gain.value = 0.35
    this.delayFilter = this.ctx.createBiquadFilter()
    this.delayFilter.type = 'lowpass'
    this.delayFilter.frequency.value = 1800

    this.delay.connect(this.feedback)
    this.feedback.connect(this.delayFilter)
    this.delayFilter.connect(this.delay)
    this.delay.connect(this.masterGain)

    this.masterGain.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)
  }

  get currentTrack() {
    return this.tracks[this.currentTrackIndex]
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05)
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop()
    } else {
      this.play()
    }
    return this.isPlaying
  }

  play() {
    this.init()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    this.isPlaying = true
    this.step = 0
    this.scheduleNextBeat()
  }

  stop() {
    this.isPlaying = false
    if (this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length
    if (this.isPlaying) {
      this.step = 0
    }
    return this.currentTrack
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length
    if (this.isPlaying) {
      this.step = 0
    }
    return this.currentTrack
  }

  scheduleNextBeat() {
    if (!this.isPlaying) return

    const track = this.currentTrack
    const beatInterval = (60 / track.bpm) * 1000 / 2 // eighth notes
    const chordIndex = Math.floor((this.step / 8) % track.chords.length)
    const chord = track.chords[chordIndex]

    // Play pad chord swell on measure start
    if (this.step % 8 === 0) {
      this.playPadChord(chord)
    }

    // Play pulsing bass on every quarter note
    if (this.step % 2 === 0) {
      const rootFreq = chord[0] * 0.5
      this.playBassNote(rootFreq)
    }

    // Play arpeggio melody
    if (Math.random() > 0.15) {
      const arpNote = chord[Math.floor(Math.random() * chord.length)] * (Math.random() > 0.5 ? 2 : 1)
      this.playPluckNote(arpNote)
    }

    this.step++
    this.timerId = setTimeout(() => this.scheduleNextBeat(), beatInterval)
  }

  playPadChord(chord) {
    if (!this.ctx || !this.isPlaying) return
    const t = this.ctx.currentTime

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq + (idx % 2 === 0 ? 0.8 : -0.8), t)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, t)
      filter.frequency.linearRampToValueAtTime(1400, t + 1.2)
      filter.frequency.linearRampToValueAtTime(500, t + 3.8)

      gain.gain.setValueAtTime(0.001, t)
      gain.gain.linearRampToValueAtTime(0.045, t + 0.8)
      gain.gain.linearRampToValueAtTime(0.001, t + 3.9)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      osc.start(t)
      osc.stop(t + 4.0)
    })
  }

  playBassNote(freq) {
    if (!this.ctx || !this.isPlaying) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(280, t)

    gain.gain.setValueAtTime(0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(t)
    osc.stop(t + 0.48)
  }

  playPluckNote(freq) {
    if (!this.ctx || !this.isPlaying) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)

    gain.gain.setValueAtTime(0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

    osc.connect(gain)
    gain.connect(this.masterGain)
    gain.connect(this.delay) // Send melody into delay

    osc.start(t)
    osc.stop(t + 0.55)
  }

  getFrequencyData(array) {
    if (!this.analyser) return false
    this.analyser.getByteFrequencyData(array)
    return true
  }
}

export const synthRadio = new ProceduralSynthRadio()
