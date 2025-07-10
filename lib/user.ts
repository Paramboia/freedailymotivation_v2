import { supabase } from './supabase'
import { UserResource } from '@clerk/types'

export async function getOrCreateSupabaseUser(clerkUser: UserResource) {
  const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
  console.log('Creating or getting user:', { clerkUserId: clerkUser.id, email: userEmail })

  try {
    // First, try to find user by Clerk ID (normal case)
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUser.id)
      .single()

    if (!fetchError && existingUser) {
      console.log('User found by Clerk ID:', existingUser)
      return existingUser
    }

    // If not found by Clerk ID, try to find by email (migration case)
    if (userEmail) {
      const { data: emailUser, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single()

      if (!emailError && emailUser) {
        console.log('User found by email - updating Clerk ID for production migration:', emailUser)
        
        // Update the existing user with the new production Clerk ID
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ clerk_user_id: clerkUser.id })
          .eq('id', emailUser.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating user Clerk ID:', updateError)
          throw updateError
        }

        console.log('User migrated to production Clerk ID:', updatedUser)
        return updatedUser
      }
    }

    // User doesn't exist at all, create a new one
    const newUser = {
      clerk_user_id: clerkUser.id,
      email: userEmail ?? null,
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
