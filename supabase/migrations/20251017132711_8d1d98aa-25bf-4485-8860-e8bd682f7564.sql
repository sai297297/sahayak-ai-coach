-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE content_type AS ENUM ('worksheet', 'quiz', 'reading', 'video', 'activity');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Lesson Plans table
CREATE TABLE lesson_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  objectives TEXT[] DEFAULT '{}',
  materials_needed TEXT[] DEFAULT '{}',
  introduction TEXT,
  main_activities JSONB DEFAULT '[]',
  assessment TEXT,
  differentiation TEXT,
  closure TEXT,
  homework TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adaptive Materials table
CREATE TABLE adaptive_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content_type content_type NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  content TEXT NOT NULL,
  questions JSONB DEFAULT '[]',
  duration INTEGER, -- in minutes
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  duration INTEGER, -- in minutes
  mcq_questions JSONB DEFAULT '[]',
  descriptive_questions JSONB DEFAULT '[]',
  total_points INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  quiz_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Responses table
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  student_roll TEXT,
  mcq_answers JSONB DEFAULT '[]',
  descriptive_answers JSONB DEFAULT '[]',
  total_score NUMERIC DEFAULT 0,
  time_taken INTEGER, -- in seconds
  feedback JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback Notes table
CREATE TABLE feedback_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  what_worked TEXT,
  what_to_improve TEXT,
  student_engagement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_plans
CREATE POLICY "Users can view their own lesson plans"
  ON lesson_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson plans"
  ON lesson_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson plans"
  ON lesson_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson plans"
  ON lesson_plans FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for adaptive_materials
CREATE POLICY "Users can view their own materials"
  ON adaptive_materials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own materials"
  ON adaptive_materials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials"
  ON adaptive_materials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials"
  ON adaptive_materials FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quizzes
CREATE POLICY "Users can view their own quizzes"
  ON quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes"
  ON quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quiz_responses (public can submit, teachers can view their quiz responses)
CREATE POLICY "Anyone can submit quiz responses"
  ON quiz_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Teachers can view responses to their quizzes"
  ON quiz_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_responses.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

-- RLS Policies for feedback_notes
CREATE POLICY "Users can view their own feedback"
  ON feedback_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
  ON feedback_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON feedback_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON feedback_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_lesson_plans_updated_at
  BEFORE UPDATE ON lesson_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adaptive_materials_updated_at
  BEFORE UPDATE ON adaptive_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();