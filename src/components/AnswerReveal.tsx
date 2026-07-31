type Props = {
  text: string | null
  typing: boolean
}

export function AnswerReveal({ text, typing }: Props) {
  return (
    <section className="answer" aria-live="polite" aria-atomic="true">
      <div className="answer-chrome" aria-hidden="true">
        <span>OUT :: RESPOSTA</span>
        <span>PHOSPHOR</span>
      </div>
      <p className="answer-label">CASSANDRA &gt;</p>
      {text ? (
        <p className="answer-text" data-typing={typing ? 'true' : 'false'}>
          {text}
        </p>
      ) : (
        <p className="answer-text answer-placeholder">_ aguardando sinal _</p>
      )}
    </section>
  )
}
