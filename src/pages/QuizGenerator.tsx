import Layout from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import QuizList from "@/components/quiz/QuizList";
import QuizForm from "@/components/quiz/QuizForm";
import QuizEditor from "@/components/quiz/QuizEditor";

type Step = "list" | "form" | "editor";

function generateQuizCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) code += letters[Math.floor(Math.random() * letters.length)];
  return code;
}

const QuizGenerator = () => {
  const qc = useQueryClient();
  const [step, setStep] = useState<Step>("list");
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quizzesQuery = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const lessonPlansQuery = useQuery({
    queryKey: ["lesson_plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lesson_plans").select("id,title").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: async (quiz: any) => {
      const user = (await supabase.auth.getUser()).data.user;
      const payload = { ...quiz, user_id: user?.id };
      const { data, error } = await supabase.from("quizzes").insert(payload).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      setStep("list");
      setGeneratedQuiz(null);
    }
  });

  const updateQuizMutation = useMutation({
    mutationFn: async (quiz: any) => {
      if (!quiz.id) throw new Error("Missing quiz id for update");
      const { id, ...rest } = quiz;
      const { data, error } = await supabase
        .from("quizzes")
        .update(rest)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      setStep("list");
      setGeneratedQuiz(null);
    }
  });

  async function handleGenerateQuiz(formData: any) {
    setError(null);
    setIsGenerating(true);
    try {
      let lessonPlanDetails: any = null;
      if (formData.lesson_plan_id) {
        const { data: lp } = await supabase.from("lesson_plans").select("*").eq("id", formData.lesson_plan_id).maybeSingle();
        lessonPlanDetails = lp ?? null;
      }

      const { data: generated, error: genError } = await supabase.functions.invoke("generate-quiz", {
        body: {
          title: formData.title,
          subject: formData.subject,
          grade_level: formData.grade_level,
          description: formData.description ?? "",
          lesson_plan: lessonPlanDetails,
        },
      });
      if (genError) throw genError;

      const total_points = [...(generated.mcq_questions ?? []), ...(generated.descriptive_questions ?? [])]
        .reduce((sum: number, q: any) => sum + (Number(q.points) || 0), 0);
      const quiz_code = generateQuizCode();

      const fullQuiz = {
        ...formData,
        mcq_questions: generated.mcq_questions ?? [],
        descriptive_questions: generated.descriptive_questions ?? [],
        total_points,
        quiz_code,
        is_published: false,
      };

      setGeneratedQuiz(fullQuiz);
      setStep("editor");
    } catch (e: any) {
      setError(e.message ?? "Failed to generate quiz");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleEditQuiz(quiz: any) {
    setGeneratedQuiz(quiz);
    setStep("editor");
  }

  function handleTogglePublish(quiz: any) {
    const next = { ...quiz, is_published: !quiz.is_published };
    updateQuizMutation.mutate(next);
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {step !== "list" && (
              <Button variant="ghost" size="icon" onClick={() => setStep("list")}> 
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Quiz Generator
            </h1>
          </div>

          {step === "list" && (
            <Button onClick={() => setStep("form")}>
              <Plus className="h-4 w-4 mr-2" /> Generate New Quiz
            </Button>
          )}
        </div>

        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : null}

        {step === "list" && (
          <QuizList
            quizzes={quizzesQuery.data}
            isLoading={quizzesQuery.isLoading}
            onCreateNew={() => setStep("form")}
            onEdit={handleEditQuiz}
            onTogglePublish={handleTogglePublish}
          />
        )}

        {step === "form" && (
          <QuizForm
            onGenerate={handleGenerateQuiz}
            onCancel={() => setStep("list")}
            isGenerating={isGenerating}
            lessonPlans={lessonPlansQuery.data}
          />
        )}

        {step === "editor" && generatedQuiz && (
          <QuizEditor
            quiz={generatedQuiz}
            isSaving={createQuizMutation.isPending || updateQuizMutation.isPending}
            onCancel={() => setStep("list")}
            onSave={(draft) => {
              if (draft.id) {
                updateQuizMutation.mutate(draft);
              } else {
                createQuizMutation.mutate(draft);
              }
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default QuizGenerator;