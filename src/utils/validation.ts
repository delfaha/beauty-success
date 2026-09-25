export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

export const isPhone = (value: string) => value.replace(/[^\d+]/g, '').replace(/^\+/, '').length >= 9

export const isPostalCode = (value: string) => /^\d{4,5}$/.test(value.trim())

export const digitsOnly = (value: string) => value.replace(/\D/g, '')

/** Contrôle de Luhn — vérifie la cohérence d'un numéro de carte. */
export function isCardNumber(value: string): boolean {
  const digits = digitsOnly(value)
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i])
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }
  return sum % 10 === 0
}

export function isExpiry(value: string, now = new Date()): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)
  return endOfMonth >= now
}

export const isCvc = (value: string) => /^\d{3,4}$/.test(value.trim())

export const formatCardNumber = (value: string) =>
  digitsOnly(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}
