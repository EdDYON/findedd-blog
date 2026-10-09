'use client'

export type VoidSound = 'hover' | 'click' | 'terminal' | 'achievement' | 'gate' | 'core'

let audioContext: AudioContext | null = null

function getAudioContext() {
  if (typeof window === 'undefined')
    return null

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextCtor)
    return null

  audioContext ??= new AudioContextCtor()
  return audioContext
}

const soundMap: Record<VoidSound, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  hover: { frequency: 720, duration: 0.035, type: 'sine', gain: 0.018 },
  click: { frequency: 280, duration: 0.055, type: 'square', gain: 0.028 },
  terminal: { frequency: 920, duration: 0.04, type: 'triangle', gain: 0.018 },
  achievement: { frequency: 540, duration: 0.18, type: 'sine', gain: 0.035 },
  gate: { frequency: 96, duration: 0.34, type: 'sawtooth', gain: 0.045 },
  core: { frequency: 160, duration: 0.22, type: 'triangle', gain: 0.04 },
}

export function playVoidSound(kind: VoidSound, enabled: boolean) {
  if (!enabled)
    return

  const context = getAudioContext()
  if (!context)
    return
  if (context.state === 'suspended')
    void context.resume()

  const config = soundMap[kind]
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime

  oscillator.type = config.type
  oscillator.frequency.setValueAtTime(config.frequency, now)
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, config.frequency * 1.82), now + config.duration)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(config.gain, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + config.duration + 0.02)
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
