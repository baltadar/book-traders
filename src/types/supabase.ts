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
      books: {
        Row: {
          id: string
          created_at: string
          title: string
          author: string
          description: string
          condition: string
          image_url: string
          user_id: string
          is_available: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          author: string
          description: string
          condition: string
          image_url: string
          user_id: string
          is_available?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          author?: string
          description?: string
          condition?: string
          image_url?: string
          user_id?: string
          is_available?: boolean
        }
      }
      book_requests: {
        Row: {
          id: string
          created_at: string
          title: string
          author: string
          description: string
          user_id: string
          is_fulfilled: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          author?: string
          description: string
          user_id: string
          is_fulfilled?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          author?: string
          description?: string
          user_id?: string
          is_fulfilled?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          location: string
          contact: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          location?: string
          contact?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          location?: string
          contact?: string
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