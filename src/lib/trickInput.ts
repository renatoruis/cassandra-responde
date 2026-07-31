/** Frase mascarada que aparece enquanto a resposta secreta é digitada. */
export const MASK_PHRASE = 'Cassandra, favor responder'

export type TrickState = {
  /** Texto visível no campo Pedido */
  display: string
  /** Resposta plantada via `.resposta.` */
  secret: string
  /** Se estamos capturando a resposta secreta */
  capturing: boolean
  /** Quantos chars da máscara já foram "revelados" durante a captura */
  maskIndex: number
  /** Texto digitado fora do modo captura (antes/depois) */
  plainPrefix: string
  plainSuffix: string
}

export function createInitialTrickState(): TrickState {
  return {
    display: '',
    secret: '',
    capturing: false,
    maskIndex: 0,
    plainPrefix: '',
    plainSuffix: '',
  }
}

function rebuildDisplay(state: TrickState): string {
  const masked = MASK_PHRASE.slice(0, state.maskIndex)
  if (state.capturing) {
    return state.plainPrefix + masked
  }
  return state.plainPrefix + masked + state.plainSuffix
}

/**
 * Processa uma tecla no campo Pedido (estilo Pedro Responde).
 * Retorna o novo estado ou null se a tecla deve ser ignorada pelo handler custom.
 */
export function applyPetitionKey(
  state: TrickState,
  key: string,
): TrickState | null {
  // Printable single char
  if (key.length === 1) {
    if (key === '.') {
      if (!state.capturing && state.secret.length === 0 && state.maskIndex === 0) {
        // Abre captura
        const next: TrickState = {
          ...state,
          capturing: true,
          maskIndex: 0,
        }
        return { ...next, display: rebuildDisplay(next) }
      }
      if (state.capturing) {
        // Fecha captura
        const next: TrickState = {
          ...state,
          capturing: false,
        }
        return { ...next, display: rebuildDisplay(next) }
      }
      // Ponto normal fora do truque
      if (state.maskIndex === 0) {
        const next = {
          ...state,
          plainPrefix: state.plainPrefix + '.',
        }
        return { ...next, display: rebuildDisplay(next) }
      }
      const next = {
        ...state,
        plainSuffix: state.plainSuffix + '.',
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    if (state.capturing) {
      const nextMask = Math.min(state.maskIndex + 1, MASK_PHRASE.length)
      const next: TrickState = {
        ...state,
        secret: state.secret + key,
        maskIndex: nextMask,
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    // Fora da captura
    if (state.secret.length > 0 || state.maskIndex > 0) {
      // Já usou o truque — completar/continuar após a máscara
      const next = {
        ...state,
        plainSuffix: state.plainSuffix + key,
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    const next = {
      ...state,
      plainPrefix: state.plainPrefix + key,
    }
    return { ...next, display: rebuildDisplay(next) }
  }

  if (key === 'Backspace') {
    if (state.capturing) {
      if (state.secret.length === 0) {
        // Cancela o modo captura (volta do '.')
        const next: TrickState = {
          ...state,
          capturing: false,
          maskIndex: 0,
        }
        return { ...next, display: rebuildDisplay(next) }
      }
      const next: TrickState = {
        ...state,
        secret: state.secret.slice(0, -1),
        maskIndex: Math.max(0, state.maskIndex - 1),
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    if (state.plainSuffix.length > 0) {
      const next = {
        ...state,
        plainSuffix: state.plainSuffix.slice(0, -1),
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    // Apagar a máscara revelada (e o segredo associado)
    if (state.maskIndex > 0 || state.secret.length > 0) {
      const next: TrickState = {
        ...state,
        secret: '',
        maskIndex: 0,
        capturing: false,
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    if (state.plainPrefix.length > 0) {
      const next = {
        ...state,
        plainPrefix: state.plainPrefix.slice(0, -1),
      }
      return { ...next, display: rebuildDisplay(next) }
    }

    return state
  }

  // Enter e outras teclas de controlo — deixar o React/default
  return null
}

/** Pedido parece cortês o suficiente (contém "cassandra" + "respond"). */
export function isPolitePetition(display: string): boolean {
  const n = display
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
  return n.includes('cassandra') && n.includes('respond')
}

export function hasSecretAnswer(state: TrickState): boolean {
  return state.secret.trim().length > 0
}
