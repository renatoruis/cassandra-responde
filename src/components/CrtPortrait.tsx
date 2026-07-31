import { useEffect, useState } from 'react'

export type CrtState = 'idle' | 'thinking' | 'glitch' | 'reveal'

type IdleAnim = '' | 'blink' | 'look'

type Props = {
  state: CrtState
}

function nextDelayMs() {
  return 4000 + Math.random() * 4000
}

export function CrtPortrait({ state }: Props) {
  const [idle, setIdle] = useState<IdleAnim>('')

  useEffect(() => {
    if (state !== 'idle') {
      setIdle('')
      return
    }

    let cancelled = false
    let timeoutId = 0

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        const pick: IdleAnim = Math.random() < 0.55 ? 'blink' : 'look'
        setIdle(pick)
        const hold = pick === 'blink' ? 140 : 420
        timeoutId = window.setTimeout(() => {
          if (cancelled) return
          setIdle('')
          schedule()
        }, hold)
      }, nextDelayMs())
    }

    schedule()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [state])

  return (
    <div
      className="crt"
      data-state={state}
      data-idle={idle || undefined}
      aria-hidden="true"
    >
      <div className="crt-screen">
        <img
          className="crt-img crt-img-base"
          src="/cassandra-1.webp"
          alt=""
          draggable={false}
        />
        <img
          className="crt-img crt-img-r"
          src="/cassandra-1.webp"
          alt=""
          draggable={false}
        />
        <img
          className="crt-img crt-img-b"
          src="/cassandra-1.webp"
          alt=""
          draggable={false}
        />
      </div>
      <div className="crt-lids" />
      <div className="crt-tear" />
      <div className="crt-static" />
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-glow" />
    </div>
  )
}
