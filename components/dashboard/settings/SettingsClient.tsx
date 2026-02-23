'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { profileSchema, type ProfileSchema } from '@/lib/validations/auth'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Camera, Loader2, AlertTriangle, Mail, AtSign, User } from 'lucide-react'
import { getInitials, cn } from '@/lib/utils'
import type { Profile } from '@/types'

export function SettingsClient({
  profile,
  userEmail,
}: {
  profile: Profile | null
  userEmail: string
}) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name ?? '',
      username: profile?.username ?? '',
      bio: profile?.bio ?? '',
    },
  })

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Plik za duży', { description: 'Maksymalny rozmiar to 2 MB.' })
      return
    }

    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${profile.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      setAvatarUrl(publicUrl)
      toast.success('Avatar zaktualizowany!')
    } catch {
      toast.error('Błąd uploadu avatara')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function onSubmit(data: ProfileSchema) {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', data.username)
        .neq('id', profile!.id)
        .single()

      if (existing) {
        toast.error('Username zajęty', { description: 'Wybierz inną nazwę użytkownika.' })
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name:  data.fullName,
          username:   data.username,
          bio:        data.bio || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile!.id)

      if (error) throw error
      toast.success('Profil zaktualizowany!')
    } catch {
      toast.error('Błąd zapisu profilu')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" /> Zdjęcie profilowe
          </CardTitle>
          <CardDescription>Widoczne na Twojej publicznej stronie. Maks. 2 MB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="w-20 h-20 border-2 border-border">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {getInitials(profile?.full_name ?? profile?.username ?? 'U')}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                {uploadingAvatar
                  ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                  : <Camera className="h-5 w-5 text-white" />
                }
              </button>
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
                {uploadingAvatar ? 'Wysyłanie...' : 'Zmień zdjęcie'}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG, WebP · maks. 2 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dane profilu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AtSign className="h-4 w-4" /> Dane profilu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Imię i nazwisko</Label>
              <Input
                placeholder="Jan Kowalski"
                {...register('fullName')}
                className={cn(errors.fullName && 'border-red-500')}
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Nazwa użytkownika</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <Input
                  placeholder="twoja-nazwa"
                  className={cn('pl-7', errors.username && 'border-red-500')}
                  {...register('username')}
                />
              </div>
              {errors.username
                ? <p className="text-xs text-red-500">{errors.username.message}</p>
                : <p className="text-xs text-muted-foreground">Tylko małe litery, cyfry i podkreślniki</p>
              }
            </div>

            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea
                placeholder="Napisz coś o sobie... (maks. 160 znaków)"
                rows={3}
                maxLength={160}
                {...register('bio')}
                className={cn('resize-none', errors.bio && 'border-red-500')}
              />
              {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Zapisywanie...</>
                : 'Zapisz zmiany'
              }
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Konto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" /> Konto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
            <Badge variant="secondary">Zweryfikowany</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Plan</p>
              <p className="text-sm text-muted-foreground">
                {profile?.plan === 'pro' ? 'Plan Pro — pełny dostęp' : 'Plan Free'}
              </p>
            </div>
            <Badge className={profile?.plan === 'pro' ? 'bg-amber-500' : ''}>
              {profile?.plan === 'pro' ? '⭐ PRO' : 'FREE'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Strefa niebezpieczna */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-base text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Strefa niebezpieczna
          </CardTitle>
          <CardDescription>Tych działań nie można cofnąć.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
            <div>
              <p className="text-sm font-medium">Usuń konto</p>
              <p className="text-xs text-muted-foreground">Trwale usuwa konto i wszystkie Twoje strony</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error('Skontaktuj się z supportem aby usunąć konto.')}
            >
              Usuń konto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
