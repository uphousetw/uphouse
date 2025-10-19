import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

export type UserRole = 'admin' | 'editor'

interface Profile {
  user_id: string
  role: UserRole
  full_name: string | null
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    let isMounted = true

    const getInitialSession = async () => {
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase!.auth.getSession()

      if (!isMounted) {
        return
      }

      if (sessionError) {
        setError(sessionError.message)
      }

      setSession(currentSession ?? null)
      setLoading(false)
    }

    void getInitialSession()

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      if (!session?.user) {
        setProfile(null)
        return
      }

      const { data, error: profileError } = await supabase!
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (profileError) {
        setError(profileError.message)
        setProfile(null)
        return
      }

      setProfile(data ?? null)
      setError(null)
    }

    void fetchProfile()
  }, [session])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      error,
      signOut: async () => {
        if (isSupabaseConfigured && supabase) {
          await supabase!.auth.signOut()
        }
        setProfile(null)
      },
    }),
    [session, profile, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
