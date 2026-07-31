import { useRef, type ChangeEvent } from 'react'
import { playKeyClick } from '../lib/playKeyClick'

type Props = {
  value: string
  onChange: (value: string) => void
  muted?: boolean
  disabled?: boolean
  error?: string | null
}

export function QuestionField({
  value,
  onChange,
  muted = false,
  disabled,
  error,
}: Props) {
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const valueRef = useRef(value)
  valueRef.current = value

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    const prev = valueRef.current
    if (next.length > prev.length) {
      playKeyClick(mutedRef.current, 'key')
    } else if (next.length < prev.length) {
      playKeyClick(mutedRef.current, 'backspace')
    }
    onChange(next)
  }

  return (
    <div className="field">
      <label htmlFor="pergunta">[ PERGUNTA ]</label>
      <textarea
        id="pergunta"
        name="pergunta"
        rows={3}
        autoComplete="off"
        spellCheck={false}
        placeholder="> o que você quer saber?"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'pergunta-error' : 'pergunta-hint'}
      />
      {error ? (
        <p id="pergunta-error" className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <p id="pergunta-hint" className="field-hint">
          // finalize com ? · ENTER via botão
        </p>
      )}
    </div>
  )
}
