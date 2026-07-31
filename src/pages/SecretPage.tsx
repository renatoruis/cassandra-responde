export function SecretPage() {
  return (
    <div className="app">
      <div className="bg" />
      <div className="shell secret-shell">
        <header className="brand">
          <h1>SEGREDO</h1>
          <p>SYS · ARQUIVO RESTRITO</p>
        </header>

        <article className="secret-panel">
          <div className="form-chrome" aria-hidden="true">
            <span className="form-chrome-title">CASSANDRA.OS // spoilers</span>
            <span className="form-chrome-leds">
              <i data-on="true" />
              <i />
              <i />
            </span>
          </div>

          <div className="secret-body">
            <p className="form-prompt">{'>'} como o Pedro Responde — e a Cassandra</p>

            <p>
              Não tem espírito. Não tem IA lendo a sua mente. Tem um truque de
              digitação, igual ao clássico Pedro Responde.
            </p>

            <h2>[ PROTOCOLO ]</h2>
            <ol>
              <li>
                No campo <strong>Pedido</strong>, digite um ponto:{' '}
                <code>.</code>
              </li>
              <li>
                Em seguida digite a <strong>resposta secreta</strong> que você
                quer que apareça (ex.: <code>azul</code>).
              </li>
              <li>
                Feche com outro ponto: <code>.</code>
              </li>
              <li>
                Enquanto isso, o ecrã mostra a frase cortês:{' '}
                <em>Cassandra, favor responder…</em>
              </li>
              <li>
                No campo <strong>Pergunta</strong>, escreva a pergunta de verdade
                e termine com <code>?</code>
              </li>
              <li>
                Clique em <strong>EXECUTAR</strong>. A casa “adivinha” o que você
                plantou.
              </li>
            </ol>

            <h2>[ EXEMPLO ]</h2>
            <pre className="secret-code">{`.azul.
Cassandra, favor responder
Qual a cor da minha blusa?`}</pre>

            <p className="secret-note">
              // sem o truque, a Cassandra improvisa uma frase aleatória no tom
              da personagem. a magia é mostrar pra alguém que não sabe.
            </p>

            <a className="btn-primary secret-back" href="/">
              ◄ VOLTAR À CASA
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
