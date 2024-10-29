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