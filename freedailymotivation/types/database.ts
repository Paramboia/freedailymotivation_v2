import { Database as DatabaseGenerated } from './supabase.types';

export type Database = DatabaseGenerated;

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type User = Tables<'users'>;

export interface DbUser {
  id: string;
  clerk_user_id: string;
  email: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, 'id' | 'created_at'>;
        Update: Partial<Omit<DbUser, 'id'>>;
      };
    };
  };
}; 