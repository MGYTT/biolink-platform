import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Łączenie klas Tailwind bez konfliktów
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatowanie daty po polsku
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(date))
}

// Sprawdzanie czy użytkownik jest na planie Pro
export function isPro(plan: string) {
  return plan === 'pro'
}

// Generowanie initiali z nazwy
export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
