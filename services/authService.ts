import { supabase } from '../lib/supabaseClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
}

/**
 * Sign up dengan email & password
 */
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: window.location.origin,
    }
  })
  
  if (error) throw error
  return data
}

/**
 * Sign in dengan email & password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

/**
 * Sign in dengan Google OAuth
 */
export const signInWithGoogle = async () => {
  // Get the correct redirect URL (works on mobile & desktop)
  const redirectUrl = window.location.origin + window.location.pathname;
  
  console.log('🔐 Starting Google OAuth with redirect:', redirectUrl);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      skipBrowserRedirect: false, // Ensure redirect happens
    }
  })
  
  if (error) {
    console.error('❌ Google OAuth error:', error);
    throw error;
  }
  
  console.log('✅ OAuth initiated:', data);
  return data
}

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Reset password - kirim email
 */
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) throw error
}

/**
 * Update password (setelah reset)
 */
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) throw error
}

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata.avatar_url,
  }
}

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email)
    
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
        avatar: session.user.user_metadata.avatar_url,
      })
    } else {
      callback(null)
    }
  })
  
  return data.subscription
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}
