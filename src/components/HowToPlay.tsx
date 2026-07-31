type Props = {
  open: boolean
  onClose: () => void
}

export function HowToPlay({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="help-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      onClick={onClose}
    >
      <div className="help-panel" onClick={(e) => e.stopPropagation()}>
        <h2 id="help-title">MANUAL // COMO JOGAR</h2>
        <ol>
          <li>
            <strong>Pedido:</strong> escreva com educação pedindo que Cassandra
            responda — por exemplo{' '}
            <em>Cassandra, favor responder</em>.
          </li>
          <li>
            <strong>Pergunta:</strong> digite o que quer saber e termine com{' '}
            <em>?</em>.
          </li>
          <li>
            <strong>Enviar:</strong> a casa consulta a tela. Cassandra responde.
          </li>
          <li>
            Melhor jogar com alguém ao lado. A casa gosta de testemunhas.
          </li>
        </ol>
        <button type="button" className="help-close" onClick={onClose}>
          [ ESC ] FECHAR
        </button>
      </div>
    </div>
  )
}
