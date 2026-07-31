type ClickKind = 'key' | 'backspace'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  return ctx
}

/** Beep curto estilo terminal 80s. Respeita mute. */
export function playKeyClick(muted = false, kind: ClickKind = 'key') {
  if (muted) return

  const audio = getCtx()
  if (!audio) return

  if (audio.state === 'suspended') {
    void audio.resume().catch(() => {})
  }

  const now = audio.currentTime
  const osc = audio.createOscillator()
  const gain = audio.createGain()

  osc.type = 'square'
  osc.frequency.value = kind === 'backspace' ? 420 : 820

  const peak = kind === 'backspace' ? 0.035 : 0.05
  const dur = kind === 'backspace' ? 0.014 : 0.016

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start(now)
  osc.stop(now + dur + 0.01)
}
