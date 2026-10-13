import { supabase } from '../lib/supabase'

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export const getProfile = async (): Promise<Profile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as Profile | null
}

export const saveProfile = async (
  fullName: string,
): Promise<Profile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User is not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: fullName,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Profile
}