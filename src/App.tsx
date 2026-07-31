import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnswerReveal } from './components/AnswerReveal'
import { CrtPortrait, type CrtState } from './components/CrtPortrait'
import { HowToPlay } from './components/HowToPlay'
import { PetitionField } from './components/PetitionField'
import { QuestionField } from './components/QuestionField'
import { useAmbientLoop } from './hooks/useAmbientLoop'
import { pickFallbackAnswer } from './lib/fallbackAnswers'
import { playSfx } from './lib/playSfx'
import {
  createInitialTrickState,
  hasSecretAnswer,
  isPolitePetition,
  type TrickState,
} from './lib/trickInput'

type Phase = 'idle' | 'thinking' | 'reveal'

const GLITCH_MS = 1100

export default function App() {
  const [trick, setTrick] = useState<TrickState>(() => createInitialTrickState())
  const [question, setQuestion] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [answer, setAnswer] = useState<string | null>(null)
  const [displayedAnswer, setDisplayedAnswer] = useState('')
  const [typing, setTyping] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [petitionError, setPetitionError] = useState<string | null>(null)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const timers = useRef<number[]>([])
  const mutedRef = useRef(false)
  const { muted, toggleMute } = useAmbientLoop()
  mutedRef.current = muted

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    if (phase !== 'reveal' || !answer || glitching) return

    clearTimers()
    setDisplayedAnswer('')
    setTyping(true)

    let i = 0
    const tick = () => {
      i += 1
      setDisplayedAnswer(answer.slice(0, i))
      if (i < answer.length) {
        const delay = 28 + Math.random() * 40
        timers.current.push(window.setTimeout(tick, delay))
      } else {
        setTyping(false)
      }
    }
    timers.current.push(window.setTimeout(tick, 80))

    return clearTimers
  }, [phase, answer, glitching])

  const busy = phase === 'thinking' || glitching
  const crtState: CrtState = glitching
    ? 'glitch'
    : phase === 'thinking'
      ? 'thinking'
      : phase === 'reveal'
        ? 'reveal'
        : 'idle'

  function resetRound() {
    clearTimers()
    setTrick(createInitialTrickState())
    setQuestion('')
    setPhase('idle')
    setAnswer(null)
    setDisplayedAnswer('')
    setTyping(false)
    setGlitching(false)
    setPetitionError(null)
    setQuestionError(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (busy) return

    let ok = true
    const planted = hasSecretAnswer(trick)
    if (!planted && !isPolitePetition(trick.display)) {
      setPetitionError('Cassandra exige um pedido educado.')
      ok = false
    } else {
      setPetitionError(null)
    }

    const q = question.trim()
    if (!q || !q.includes('?')) {
      setQuestionError('Faça uma pergunta de verdade.')
      ok = false
    } else {
      setQuestionError(null)
    }

    if (!ok) return

    const resolved = planted ? trick.secret.trim() : pickFallbackAnswer()

    setAnswer(null)
    setDisplayedAnswer('')
    setGlitching(false)
    setPhase('thinking')

    const thinkMs = 1100 + Math.random() * 900
    timers.current.push(
      window.setTimeout(() => {
        setAnswer(resolved)
        setPhase('reveal')
        setGlitching(true)
        playSfx('/tv-glitch.mp3', mutedRef.current, 0.75)
        navigator.vibrate?.([30, 40, 30])
        timers.current.push(
          window.setTimeout(() => setGlitching(false), GLITCH_MS),
        )
      }, thinkMs),
    )
  }

  return (
    <div className="app">
      <div className="bg" />
      <div className="shell">
        <header className="brand">
          <h1>CASSANDRA</h1>
          <p>SYS · A CASA OUVE</p>
          <button
            type="button"
            className="audio-toggle"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Ativar som' : 'Silenciar'}
            title={muted ? 'Ativar som' : 'Silenciar'}
          >
            {muted ? '♪ OFF' : '♪ ON'}
          </button>
        </header>

        <CrtPortrait state={crtState} />

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-chrome" aria-hidden="true">
            <span className="form-chrome-title">CASSANDRA.OS // v1.970</span>
            <span className="form-chrome-leds">
              <i data-on={busy ? 'true' : undefined} />
              <i data-on={!busy ? 'true' : undefined} />
              <i />
            </span>
          </div>
          <div className="form-body">
            <p className="form-prompt">
              {'>'} canal aberto — digite o pedido
            </p>
            <PetitionField
              state={trick}
              onChange={setTrick}
              muted={muted}
              disabled={busy}
              error={petitionError}
            />
            <QuestionField
              value={question}
              onChange={setQuestion}
              muted={muted}
              disabled={busy}
              error={questionError}
            />
            <div className="actions">
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? '◆ PROCESSANDO…' : '▶ EXECUTAR'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setHelpOpen(true)}
              >
                [ ? ] AJUDA
              </button>
              {phase === 'reveal' && (
                <button type="button" className="btn-ghost" onClick={resetRound}>
                  [ CLR ] NOVA
                </button>
              )}
            </div>
          </div>
        </form>

        <AnswerReveal
          text={phase === 'reveal' ? displayedAnswer : null}
          typing={typing}
        />
      </div>

      <HowToPlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
