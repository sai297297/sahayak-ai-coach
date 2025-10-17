import Layout from "@/components/Layout";
<<<<<<< HEAD

const AdaptiveStudio = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Adaptive Studio
        </h1>
        <p className="text-muted-foreground mb-8">Create differentiated learning materials</p>
        <p className="text-center text-muted-foreground py-20">Coming soon...</p>
=======
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdaptiveForm from "@/components/adaptive/AdaptiveForm";
import MaterialsList from "@/components/adaptive/MaterialsList";
import MaterialViewer from "@/components/adaptive/MaterialViewer";
import { Plus } from "lucide-react";

const AdaptiveStudio = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const materialsQuery = useQuery({
    queryKey: ["adaptive_materials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("adaptive_materials").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const lessonPlansQuery = useQuery({
    queryKey: ["lesson_plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lesson_plans").select("id,title").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (payload: any) => {
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase.from("adaptive_materials").insert({ ...payload, user_id: user?.id }).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adaptive_materials"] });
    }
  });

  async function handleGenerateMaterial(formData: any) {
    setError(null);
    setIsGenerating(true);
    try {
      let lessonPlanDetails: any = null;
      if (formData.lesson_plan_id) {
        const { data: lp } = await supabase.from("lesson_plans").select("*").eq("id", formData.lesson_plan_id).maybeSingle();
        lessonPlanDetails = lp ?? null;
      }

      const { data: generated, error: genError } = await supabase.functions.invoke("generate-material", {
        body: {
          title: formData.title,
          content_type: formData.content_type,
          difficulty_level: formData.difficulty_level,
          topic: formData.title,
          lesson_plan: lessonPlanDetails,
        },
      });
      if (genError) throw genError;

      const materialData = {
        ...formData,
        content: generated.content ?? "",
        questions: generated.questions ?? [],
        instructions: generated.instructions ?? "",
        duration: typeof generated.duration === "number" ? generated.duration : Number(generated.duration) || null,
      };

      await createMaterialMutation.mutateAsync(materialData);
      setShowForm(false);
    } catch (e: any) {
      setError(e.message ?? "Failed to generate material");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">Adaptive Content Studio</h1>
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" /> New Material
          </Button>
        </div>

        {error ? <div className="text-red-600 mb-4">{error}</div> : null}

        {showForm ? (
          <AdaptiveForm
            onGenerate={handleGenerateMaterial}
            onCancel={() => setShowForm(false)}
            isGenerating={isGenerating}
            lessonPlans={lessonPlansQuery.data}
          />
        ) : selectedMaterial ? (
          <MaterialViewer material={selectedMaterial} onBack={() => setSelectedMaterial(null)} />
        ) : (
          <MaterialsList materials={materialsQuery.data} isLoading={materialsQuery.isLoading} onSelectMaterial={setSelectedMaterial} />
        )}
>>>>>>> c7de362 (Initial commit from cursor)
      </div>
    </Layout>
  );
};

export default AdaptiveStudio;