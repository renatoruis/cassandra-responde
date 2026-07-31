const cache = new Map<string, HTMLAudioElement>()

/** Toca um efeito sonoro one-shot (respeita mute). */
export function playSfx(src: string, muted = false, volume = 0.7) {
  if (muted) return

  let audio = cache.get(src)
  if (!audio) {
    audio = new Audio(src)
    audio.preload = 'auto'
    cache.set(src, audio)
  }

  audio.pause()
  audio.currentTime = 0
  audio.volume = volume
  audio.muted = false
  void audio.play().catch(() => {})
}
