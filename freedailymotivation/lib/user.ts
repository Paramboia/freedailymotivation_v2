import { supabase } from './supabase'
import { User } from '@clerk/nextjs/server'

export async function getOrCreateSupabaseUser(clerkUser: User) {
  console.log('Creating or getting user:', { clerkUserId: clerkUser.id, email: clerkUser.emailAddresses[0]?.emailAddress })

  try {
    // First, try to get the existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUser.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError)
      throw fetchError
    }

    if (existingUser) {
      console.log('Existing user found:', existingUser)
      return existingUser
    }

    // User doesn't exist, create a new one
    const newUser = {
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
      created_at: new Date().toISOString(),
    }

    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      throw insertError
    }

    console.log('New user created:', insertedUser)
    return insertedUser
  } catch (error) {
    console.error('Unexpected error in getOrCreateSupabaseUser:', error)
    throw error
  }
}
