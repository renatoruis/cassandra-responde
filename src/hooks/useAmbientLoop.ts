import { useCallback, useEffect, useRef, useState } from 'react'

const SRC = '/audio-loop.mp3'

/**
 * Loop de ambiente: tenta tocar ao abrir; se o browser bloquear autoplay,
 * arranca no primeiro gesto do utilizador.
 */
export function useAmbientLoop() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)
  const mutedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.45
    audio.muted = mutedRef.current
    audioRef.current = audio

    let unlocked = false

    const tryPlay = async () => {
      try {
        await audio.play()
        unlocked = true
        return true
      } catch {
        return false
      }
    }

    void tryPlay()

    const unlock = () => {
      if (unlocked && !audio.paused) {
        removeUnlockListeners()
        return
      }
      void tryPlay().then((ok) => {
        if (ok) removeUnlockListeners()
      })
    }

    const removeUnlockListeners = () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }

    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock)

    return () => {
      removeUnlockListeners()
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      mutedRef.current = next
      const audio = audioRef.current
      if (audio) {
        audio.muted = next
        if (!next && audio.paused) void audio.play().catch(() => {})
      }
      return next
    })
  }, [])

  return { muted, toggleMute }
}
