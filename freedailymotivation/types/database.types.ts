export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string | null
          created_at: string
        }
        Insert: {
          clerk_user_id: string
          email?: string | null
          created_at?: string
        }
        Update: {
          clerk_user_id?: string
          email?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          quote_id: strings
          created_at: string
        }
        Insert: {
          user_id: string
          quote_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          quote_id?: string
          created_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          name: string
          created_at?: string
        }
        Update: {
          name?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          name: string
          created_at?: string
        }
        Update: {
          name?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'] 