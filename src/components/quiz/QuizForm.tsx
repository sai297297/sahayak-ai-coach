import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type LessonPlan = {
  id: string;
  title: string;
};

export function QuizForm({ onGenerate, onCancel, isGenerating, lessonPlans }: {
  onGenerate: (formData: any) => void;
  onCancel: () => void;
  isGenerating: boolean;
  lessonPlans: LessonPlan[] | undefined;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [lessonPlanId, setLessonPlanId] = useState<string | undefined>(undefined);

  const canSubmit = title && subject && grade && !isGenerating;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({
      title,
      description,
      subject,
      grade_level: grade,
      lesson_plan_id: lessonPlanId ?? null,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Social Studies">Social Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((g) => (
                    <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                  ))}
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
            <Button type="submit" disabled={!canSubmit}>
              {isGenerating ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Generating Quiz...</span>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default QuizForm;


