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
        }
        Update: {
          clerk_user_id?: string
          email?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          quote_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          quote_id: string
        }
        Update: {
          user_id?: string
          quote_id?: string
        }
      }
      quotes: {
        Row: {
          id: string
          quote_text: string
          author_id: string
          category_id: string | null
          created_at: string
        }
        Insert: {
          quote_text: string
          author_id: string
          category_id?: string | null
        }
        Update: {
          quote_text?: string
          author_id?: string
          category_id?: string | null
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
        }
        Update: {
          name?: string
        }
      }
      categories: {
        Row: {
          id: string
          category_name: string
          created_at: string
        }
        Insert: {
          category_name: string
        }
        Update: {
          category_name?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'] 
  Database['public']['Tables'][T]['Update'] 