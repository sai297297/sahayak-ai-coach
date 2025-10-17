import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import LessonForm from "@/components/lesson-planner/LessonForm";
import GeneratedPlanViewer from "@/components/lesson-planner/GeneratedPlanViewer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LessonPlanner = () => {
  const [step, setStep] = useState<"form" | "generated">("form");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [myPlans, setMyPlans] = useState<any[]>([]);
  const [localPlans, setLocalPlans] = useState<any[]>([]);

  const LOCAL_STORAGE_KEY = "sahayak_local_lesson_plans";

  function planToMarkdown(plan: any) {
    const lines: string[] = [];
    lines.push(`# ${plan.title ?? `${plan.subject} - ${plan.topic}`}\n`);
    lines.push(`Subject: ${plan.subject}`);
    lines.push(`Grade: ${plan.grade_level}`);
    if (plan.topic) lines.push(`Topic: ${plan.topic}`);
    if (plan.duration) lines.push(`Duration: ${plan.duration} minutes`);
    lines.push("");
    if (Array.isArray(plan.objectives) && plan.objectives.length) {
      lines.push("## Objectives");
      plan.objectives.forEach((o: string) => lines.push(`- ${o}`));
      lines.push("");
    }
    if (Array.isArray(plan.materials_needed) && plan.materials_needed.length) {
      lines.push("## Materials Needed");
      plan.materials_needed.forEach((m: string) => lines.push(`- ${m}`));
      lines.push("");
    }
    if (plan.introduction) {
      lines.push("## Introduction");
      lines.push(plan.introduction);
      lines.push("");
    }
    if (Array.isArray(plan.main_activities) && plan.main_activities.length) {
      lines.push("## Main Activities");
      plan.main_activities.forEach((a: any, i: number) => {
        lines.push(`### Activity ${i + 1}: ${a.activity ?? "Activity"}`);
        if (a.time) lines.push(`Time: ${a.time} min`);
        if (a.description) lines.push(a.description);
        lines.push("");
      });
    }
    if (plan.assessment) {
      lines.push("## Assessment");
      lines.push(plan.assessment);
      lines.push("");
    }
    if (plan.differentiation) {
      lines.push("## Differentiation");
      lines.push(plan.differentiation);
      lines.push("");
    }
    if (plan.closure) {
      lines.push("## Closure");
      lines.push(plan.closure);
      lines.push("");
    }
    if (plan.homework) {
      lines.push("## Homework");
      lines.push(plan.homework);
      lines.push("");
    }
    return lines.join("\n");
  }

  function downloadLessonPlan(plan: any) {
    const fileName = `${(plan.title ?? `${plan.subject}-${plan.topic}` ?? "lesson-plan").replace(/\s+/g, "-")}.md`;
    const content = planToMarkdown(plan);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function storeLocalLessonPlan(plan: any) {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      const toStore = { id: crypto.randomUUID(), created_at: new Date().toISOString(), plan };
      const updated = [toStore, ...existing].slice(0, 50);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setLocalPlans(updated);
    } catch {}
  }

  async function refreshMyPlans() {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;
      const { data } = await supabase
        .from("lesson_plans")
        .select("id,title,subject,grade_level,topic,created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      setMyPlans(data ?? []);
    } catch {}
  }

  function loadLocalPlans() {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      setLocalPlans(existing);
    } catch {
      setLocalPlans([]);
    }
  }

  useEffect(() => {
    refreshMyPlans();
    loadLocalPlans();
  }, []);

  const handleGeneratePlan = async (formData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: formData,
      });

      if (error) throw error;

      const fullPlan = { ...data, ...formData };
      setGeneratedPlan(fullPlan);
      setStep("generated");
      toast({ title: "Lesson plan generated successfully!" });

      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");
      const insertPayload = { ...fullPlan, user_id: user.data.user.id };
      const { error: saveError } = await supabase.from("lesson_plans").insert(insertPayload);
      if (saveError) throw saveError;
      toast({ title: "Lesson plan saved to your dashboard." });
      downloadLessonPlan(fullPlan);
      storeLocalLessonPlan(fullPlan);
      refreshMyPlans();
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
      refreshMyPlans();
      storeLocalLessonPlan(plan);
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

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Saved on your device</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {localPlans.length === 0 ? (
                <div className="text-muted-foreground">No local plans yet. Generate one to auto-download.</div>
              ) : (
                localPlans.map((entry: any) => (
                  <div key={entry.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{entry.plan?.title ?? `${entry.plan?.subject} - ${entry.plan?.topic}`}</div>
                      <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</div>
                    </div>
                    <Button variant="outline" onClick={() => downloadLessonPlan(entry.plan)}>Download</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved to your account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myPlans.length === 0 ? (
                <div className="text-muted-foreground">No saved plans yet.</div>
              ) : (
                myPlans.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.title ?? `${p.subject} - ${p.topic}`}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                    <Button variant="outline" onClick={() => downloadLessonPlan(p)}>Download</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LessonPlanner;