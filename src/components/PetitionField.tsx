import {
  useRef,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { playKeyClick } from '../lib/playKeyClick'
import {
  applyPetitionKey,
  createInitialTrickState,
  type TrickState,
} from '../lib/trickInput'

type Props = {
  state: TrickState
  onChange: (next: TrickState) => void
  muted?: boolean
  disabled?: boolean
  error?: string | null
}

function applyChars(state: TrickState, chars: string): TrickState {
  let next = state
  for (const ch of chars) {
    const applied = applyPetitionKey(next, ch)
    if (applied) next = applied
  }
  return next
}

export function PetitionField({
  state,
  onChange,
  muted = false,
  disabled,
  error,
}: Props) {
  const stateRef = useRef(state)
  stateRef.current = state
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  /** keydown / beforeinput já aplicaram — ignora onChange nativo. */
  const ignoreNativeChange = useRef(false)

  function clickForKey(key: string) {
    playKeyClick(mutedRef.current, key === 'Backspace' ? 'backspace' : 'key')
  }

  function commit(next: TrickState, keyHint?: string) {
    const prev = stateRef.current
    if (
      next.display === prev.display &&
      next.secret === prev.secret &&
      next.capturing === prev.capturing &&
      next.maskIndex === prev.maskIndex
    ) {
      return
    }
    if (keyHint) clickForKey(keyHint)
    ignoreNativeChange.current = true
    onChange(next)
    queueMicrotask(() => {
      ignoreNativeChange.current = false
    })
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return
    if (e.ctrlKey || e.metaKey || e.altKey) return

    if (e.key === 'Enter') {
      e.preventDefault()
      return
    }

    if (e.key === 'Unidentified' || e.key === 'Process') return

    if (e.key === 'Backspace' || e.key.length === 1) {
      e.preventDefault()
      const next = applyPetitionKey(stateRef.current, e.key)
      if (next) commit(next, e.key)
    }
  }

  function handleBeforeInput(e: FormEvent<HTMLInputElement>) {
    if (disabled) return

    const ne = e.nativeEvent as InputEvent
    const type = ne.inputType ?? ''

    if (ignoreNativeChange.current) {
      e.preventDefault()
      return
    }

    if (type === 'insertText' || type === 'insertCompositionText') {
      if (!ne.data) return
      e.preventDefault()
      const next = applyChars(stateRef.current, ne.data)
      commit(next, ne.data[0] ?? 'k')
      return
    }

    if (
      type === 'deleteContentBackward' ||
      type === 'deleteContent' ||
      type === 'deleteByCut'
    ) {
      e.preventDefault()
      const next = applyPetitionKey(stateRef.current, 'Backspace')
      if (next) commit(next, 'Backspace')
      return
    }

    if (type.startsWith('insert') || type.startsWith('delete')) {
      e.preventDefault()
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (disabled || ignoreNativeChange.current) return

    const incoming = e.target.value
    const current = stateRef.current.display
    if (incoming === current) return

    if (incoming.length < current.length && current.startsWith(incoming)) {
      let next = stateRef.current
      for (let i = 0; i < current.length - incoming.length; i++) {
        next = applyPetitionKey(next, 'Backspace') ?? next
      }
      commit(next, 'Backspace')
      return
    }

    if (incoming.startsWith(current)) {
      const added = incoming.slice(current.length)
      commit(applyChars(stateRef.current, added), added[0] ?? 'k')
      return
    }

    commit(applyChars(createInitialTrickState(), incoming), 'k')
  }

  return (
    <div className="field">
      <label htmlFor="pedido">[ PEDIDO ]</label>
      <input
        id="pedido"
        name="pedido"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="text"
        placeholder="> Cassandra, favor responder"
        value={state.display}
        onChange={handleChange}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'pedido-error' : 'pedido-hint'}
      />
      {error ? (
        <p id="pedido-error" className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <p id="pedido-hint" className="field-hint">
          // cortesia obrigatória · protocolo doméstico
        </p>
      )}
    </div>
  )
}
