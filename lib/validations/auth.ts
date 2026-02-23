import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(50, 'Imię może mieć maksymalnie 50 znaków'),
  email: z
    .string()
    .email('Podaj poprawny adres email'),
  password: z
    .string()
    .min(8, 'Hasło musi mieć minimum 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const profileSchema = z.object({
  fullName: z.string().min(2).max(50),
  username: z
    .string()
    .min(3, 'Username musi mieć minimum 3 znaki')
    .max(30, 'Username może mieć maksymalnie 30 znaków')
    .regex(/^[a-z0-9_]+$/, 'Tylko małe litery, cyfry i podkreślniki'),
  bio: z.string().max(160, 'Bio może mieć maksymalnie 160 znaków').optional(),
})

export type ProfileSchema = z.infer<typeof profileSchema>
