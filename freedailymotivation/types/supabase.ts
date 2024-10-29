import { Database as GeneratedDatabase } from './supabase-generated.types'

export type Database = GeneratedDatabase

export type DbTables = Database['public']['Tables']
export type DbUser = DbTables['users']['Row']
export type DbUserInsert = DbTables['users']['Insert'] 