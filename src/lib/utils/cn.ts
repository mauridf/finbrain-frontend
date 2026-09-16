import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes condicionais (clsx) e resolve conflitos do Tailwind
 * (tailwind-merge). Ex.: cn('p-2', condition && 'p-4') → 'p-4'.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}