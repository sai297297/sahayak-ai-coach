export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      adaptive_materials: {
        Row: {
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          duration: number | null
          id: string
          instructions: string | null
          lesson_plan_id: string | null
          questions: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          duration?: number | null
          id?: string
          instructions?: string | null
          lesson_plan_id?: string | null
          questions?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          duration?: number | null
          id?: string
          instructions?: string | null
          lesson_plan_id?: string | null
          questions?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adaptive_materials_lesson_plan_id_fkey"
            columns: ["lesson_plan_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_notes: {
        Row: {
          created_at: string | null
          id: string
          lesson_plan_id: string
          rating: number | null
          student_engagement: string | null
          user_id: string
          what_to_improve: string | null
          what_worked: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_plan_id: string
          rating?: number | null
          student_engagement?: string | null
          user_id: string
          what_to_improve?: string | null
          what_worked?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_plan_id?: string
          rating?: number | null
          student_engagement?: string | null
          user_id?: string
          what_to_improve?: string | null
          what_worked?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_notes_lesson_plan_id_fkey"
            columns: ["lesson_plan_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          assessment: string | null
          closure: string | null
          created_at: string | null
          differentiation: string | null
          duration: number
          grade_level: string
          homework: string | null
          id: string
          introduction: string | null
          is_favorite: boolean | null
          main_activities: Json | null
          materials_needed: string[] | null
          objectives: string[] | null
          subject: string
          title: string
          topic: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assessment?: string | null
          closure?: string | null
          created_at?: string | null
          differentiation?: string | null
          duration: number
          grade_level: string
          homework?: string | null
          id?: string
          introduction?: string | null
          is_favorite?: boolean | null
          main_activities?: Json | null
          materials_needed?: string[] | null
          objectives?: string[] | null
          subject: string
          title: string
          topic: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assessment?: string | null
          closure?: string | null
          created_at?: string | null
          differentiation?: string | null
          duration?: number
          grade_level?: string
          homework?: string | null
          id?: string
          introduction?: string | null
          is_favorite?: boolean | null
          main_activities?: Json | null
          materials_needed?: string[] | null
          objectives?: string[] | null
          subject?: string
          title?: string
          topic?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          descriptive_answers: Json | null
          feedback: Json | null
          id: string
          mcq_answers: Json | null
          quiz_id: string
          student_name: string
          student_roll: string | null
          submitted_at: string | null
          time_taken: number | null
          total_score: number | null
        }
        Insert: {
          descriptive_answers?: Json | null
          feedback?: Json | null
          id?: string
          mcq_answers?: Json | null
          quiz_id: string
          student_name: string
          student_roll?: string | null
          submitted_at?: string | null
          time_taken?: number | null
          total_score?: number | null
        }
        Update: {
          descriptive_answers?: Json | null
          feedback?: Json | null
          id?: string
          mcq_answers?: Json | null
          quiz_id?: string
          student_name?: string
          student_roll?: string | null
          submitted_at?: string | null
          time_taken?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          descriptive_questions: Json | null
          duration: number | null
          grade_level: string
          id: string
          is_published: boolean | null
          lesson_plan_id: string | null
          mcq_questions: Json | null
          quiz_code: string | null
          subject: string
          title: string
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          descriptive_questions?: Json | null
          duration?: number | null
          grade_level: string
          id?: string
          is_published?: boolean | null
          lesson_plan_id?: string | null
          mcq_questions?: Json | null
          quiz_code?: string | null
          subject: string
          title: string
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          descriptive_questions?: Json | null
          duration?: number | null
          grade_level?: string
          id?: string
          is_published?: boolean | null
          lesson_plan_id?: string | null
          mcq_questions?: Json | null
          quiz_code?: string | null
          subject?: string
          title?: string
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_plan_id_fkey"
            columns: ["lesson_plan_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: "worksheet" | "quiz" | "reading" | "video" | "activity"
      difficulty_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type: ["worksheet", "quiz", "reading", "video", "activity"],
      difficulty_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
