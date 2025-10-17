import { useState } from "react";
import Layout from "@/components/Layout";
import LessonForm from "@/components/lesson-planner/LessonForm";
import GeneratedPlanViewer from "@/components/lesson-planner/GeneratedPlanViewer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LessonPlanner = () => {
  const [step, setStep] = useState<"form" | "generated">("form");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlan = async (formData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: formData,
      });

      if (error) throw error;

      setGeneratedPlan({ ...data, ...formData });
      setStep("generated");
      toast({ title: "Lesson plan generated successfully!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (plan: any) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("lesson_plans").insert({
        user_id: user.data.user.id,
        ...plan,
      });

      if (error) throw error;

      toast({ title: "Lesson plan saved successfully!" });
      setStep("form");
      setGeneratedPlan(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Lesson Planner
          </h1>
          <p className="text-muted-foreground">
            Generate comprehensive lesson plans powered by AI
          </p>
        </div>

        {step === "form" ? (
          <LessonForm onGenerate={handleGeneratePlan} loading={loading} />
        ) : (
          <GeneratedPlanViewer plan={generatedPlan} onSave={handleSavePlan} onBack={() => setStep("form")} />
        )}
      </div>
    </Layout>
  );
};

export default LessonPlanner;