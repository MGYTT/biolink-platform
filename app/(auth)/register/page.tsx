'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterSchema } from '@/lib/validations/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Miernik siły hasła
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Minimum 8 znaków',    pass: password.length >= 8       },
    { label: 'Wielka litera',        pass: /[A-Z]/.test(password)     },
    { label: 'Cyfra',                pass: /[0-9]/.test(password)     },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']

  if (!password) return null

  return (
    <div className="space-y-2 mt-1">
      <Progress value={(score / 3) * 100} className="h-1.5" />
      <div className="flex flex-col gap-1">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-1.5">
            {c.pass
              ? <CheckCircle2 className="h-3 w-3 text-green-500" />
              : <XCircle className="h-3 w-3 text-muted-foreground/40" />
            }
            <span className={cn('text-[11px]', c.pass ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  async function onSubmit(data: RegisterSchema) {
    setServerError(null)

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setServerError(error.message)
      return
    }

    setSuccess(true)
  }

  async function handleGoogleRegister() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold">Sprawdź swoją skrzynkę!</h2>
            <p className="text-sm text-muted-foreground">
              Wysłaliśmy link aktywacyjny na <strong>{watch('email')}</strong>.
              Kliknij go aby aktywować konto.
            </p>
            <Button variant="outline" asChild className="mt-2">
              <Link href="/login">Przejdź do logowania</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Stwórz konto za darmo</CardTitle>
          <CardDescription>Bez karty kredytowej · gotowe w 30 sekund</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Google OAuth */}
          <Button variant="outline" className="w-full mb-4" onClick={handleGoogleRegister}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Zarejestruj się przez Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-neutral-900 px-2 text-muted-foreground">lub emailem</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Imię */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Imię i nazwisko</Label>
              <Input
                id="fullName"
                placeholder="Jan Kowalski"
                {...register('fullName')}
                className={cn(errors.fullName && 'border-red-500')}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ty@przykład.pl"
                {...register('email')}
                className={cn(errors.email && 'border-red-500')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Hasło */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 znaków..."
                  {...register('password')}
                  className={cn('pr-10', errors.password && 'border-red-500')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Potwierdź hasło */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Powtórz hasło..."
                {...register('confirmPassword')}
                className={cn(errors.confirmPassword && 'border-red-500')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Tworzenie konta...' : 'Stwórz konto za darmo →'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Masz już konto?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Zaloguj się
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
