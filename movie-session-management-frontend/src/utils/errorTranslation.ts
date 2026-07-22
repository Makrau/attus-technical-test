interface ErrorTranslationMap {
  [field: string]: {
    [pattern: string]: string
  }
}

const errorTranslations: ErrorTranslationMap = {
  title: {
    "can't be blank": 'não pode ficar em branco',
    'is too short': 'é muito curto',
    'is too long': 'é muito longo',
    'has already been taken': 'já está em uso',
  },

  director: {
    "can't be blank": 'não pode ficar em branco',
    'is too short': 'é muito curto',
    'is too long': 'é muito longo',
  },

  duration: {
    "can't be blank": 'não pode ficar em branco',
    'is not a number': 'deve ser um número',
    'must be greater than 0': 'deve ser maior que 0',
    'must be greater than or equal to 1': 'deve ser maior ou igual a 1',
  },

  synopsis: {
    'is too long': 'é muito longa',
  },

  number: {
    "can't be blank": 'não pode ficar em branco',
    'is not a number': 'deve ser um número',
    'must be greater than 0': 'deve ser maior que 0',
    'has already been taken': 'já está em uso',
    'must be unique': 'já existe uma sala com este número',
  },

  room_id: {
    "can't be blank": 'não pode ficar em branco',
    'must exist': 'sala não encontrada',
    'already has a session scheduled at this time': 'já possui uma sessão agendada neste horário',
  },

  movie_id: {
    "can't be blank": 'não pode ficar em branco',
    'must exist': 'filme não encontrado',
  },

  starts_at: {
    "can't be blank": 'não pode ficar em branco',
    'cannot be in the past': 'não pode ser no passado',
    'must be at least 30 minutes from now': 'deve ser pelo menos 30 minutos a partir de agora',
    'conflicts with an existing session in this room': 'conflita com uma sessão existente nesta sala',
    'is not a valid datetime': 'não é uma data/hora válida',
  },

  base: {
    'There is already a session in this room at that time': 'Já existe uma sessão nesta sala neste horário',
  },
}

const genericPatterns: { [pattern: string]: string } = {
  'is required': 'é obrigatório',
  'is invalid': 'é inválido',
  'not found': 'não encontrado',
}

/**
 * Traduz uma mensagem de erro do backend para português
 *
 * @param field - Nome do campo (ex: 'title', 'starts_at')
 * @param message - Mensagem em inglês do backend
 * @returns Mensagem traduzida em português
 *
 * @example
 * translateError('title', "can't be blank") // => "não pode ficar em branco"
 * translateError('starts_at', 'cannot be in the past') // => "não pode ser no passado"
 */
export function translateError(field: string, message: string): string {
  if (errorTranslations[field]) {
    const fieldTranslations = errorTranslations[field]

    if (fieldTranslations[message]) {
      return fieldTranslations[message]
    }
  }

  const lowerMessage = message?.toLowerCase()
  for (const [pattern, translation] of Object.entries(genericPatterns)) {
    if (lowerMessage.includes(pattern.toLowerCase())) {
      return translation
    }
  }

  console.warn(`Translation not found for field "${field}" with message "${message}"`)
  return message
}

/**
 * Traduz um objeto de erros do backend
 *
 * @param errors - Objeto de erros do ValidationError
 * @returns Objeto com as mesmas chaves mas mensagens traduzidas
 *
 * @example
 * const backendErrors = {
 *   title: ["can't be blank"],
 *   duration: ["must be greater than 0"]
 * }
 *
 * const translated = translateErrors(backendErrors)
 * // => {
 * //   title: ["não pode ficar em branco"],
 * //   duration: ["deve ser maior que 0"]
 * // }
 */
export function translateErrors(errors: Record<string, string[]>): Record<string, string[]> {
  const translated: Record<string, string[]> = {}

  for (const [field, messages] of Object.entries(errors)) {
    translated[field] = messages.map(message => translateError(field, message))
  }

  return translated
}

/**
 * Traduz e formata a primeira mensagem de erro de um campo
 *
 * @param field - Nome do campo
 * @param messages - Array de mensagens de erro
 * @returns Primeira mensagem traduzida ou string vazia
 *
 * @example
 * translateFieldError('title', ["can't be blank", "is too short"])
 * // => "não pode ficar em branco"
 */
export function translateFieldError(field: string, messages: string[]): string {
  if (!messages || messages.length === 0) {
    return ''
  }

  return translateError(field, messages[0])
}
