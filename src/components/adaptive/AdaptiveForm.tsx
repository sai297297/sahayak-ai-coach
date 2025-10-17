import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LessonPlan = { id: string; title: string };

export function AdaptiveForm({ onGenerate, onCancel, isGenerating, lessonPlans }: {
  onGenerate: (formData: any) => void;
  onCancel: () => void;
  isGenerating: boolean;
  lessonPlans: LessonPlan[] | undefined;
}) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [lessonPlanId, setLessonPlanId] = useState<string | undefined>(undefined);

  const canSubmit = title && contentType && difficulty && !isGenerating;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({
      title,
      content_type: contentType,
      difficulty_level: difficulty,
      lesson_plan_id: lessonPlanId ?? null,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Adaptive Material</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worksheet">Worksheet</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Link Lesson Plan (optional)</Label>
            <Select value={lessonPlanId} onValueChange={(v) => setLessonPlanId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select lesson plan" />
              </SelectTrigger>
              <SelectContent>
                {(lessonPlans ?? []).map((lp) => (
                  <SelectItem key={lp.id} value={lp.id}>{lp.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={!canSubmit}>{isGenerating ? "Generating..." : "Generate"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AdaptiveForm;


