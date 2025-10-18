import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type MCQ = {
  question: string;
  options: string[];
  correct_answer: string | number; // accept string for display, number for index compatibility
  points: number;
};

type Descriptive = {
  question: string;
  suggested_answer: string;
  points: number;
};

type QuizDraft = {
  id?: string;
  title: string;
  subject: string;
  grade_level: string;
  duration?: number | null;
  mcq_questions: MCQ[];
  descriptive_questions: Descriptive[];
  total_points: number;
  is_published?: boolean;
  quiz_code?: string;
};

export function QuizEditor({ quiz, onSave, onCancel, isSaving }: {
  quiz: QuizDraft;
  onSave: (quiz: QuizDraft) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [draft, setDraft] = useState<QuizDraft>(quiz);
  const [isPublished, setIsPublished] = useState<boolean>(quiz.is_published ?? false);

  function updateTitle(value: string) {
    setDraft((d) => ({ ...d, title: value }));
  }

  function updateMCQ(index: number, patch: Partial<MCQ>) {
    setDraft((d) => {
      const copy = [...d.mcq_questions];
      copy[index] = { ...copy[index], ...patch } as MCQ;
      return { ...d, mcq_questions: copy };
    });
  }

  function updateMCQOption(qIndex: number, optIndex: number, value: string) {
    setDraft((d) => {
      const questions = [...d.mcq_questions];
      const opts = [...questions[qIndex].options];
      opts[optIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options: opts };
      return { ...d, mcq_questions: questions };
    });
  }

  function updateDesc(index: number, patch: Partial<Descriptive>) {
    setDraft((d) => {
      const copy = [...d.descriptive_questions];
      copy[index] = { ...copy[index], ...patch } as Descriptive;
      return { ...d, descriptive_questions: copy };
    });
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-white/90" htmlFor="title">Title</Label>
            <Input id="title" value={draft.title} onChange={(e) => updateTitle(e.target.value)} />
          </div>
          <div className="space-y-1">Subject
            <div className="text-white/90">{draft.subject}</div>
          </div>
          <div className="space-y-1">Grade
            <div className="text-white/90">{draft.grade_level}</div>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <div className="flex items-center gap-3">
              <Switch id="publish" checked={isPublished} onCheckedChange={setIsPublished} />
              <Label htmlFor="publish" className="text-white/90">Publish for students</Label>
            </div>
            {isPublished ? (
              <div className="text-xs text-white/70">Students can access this quiz via: /q/{quiz.quiz_code ?? "CODE"}</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Choice Questions</h3>
        {draft.mcq_questions.map((q, qi) => (
          <Card key={qi}>
            <CardContent className="space-y-3 pt-6">
              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea value={q.question} onChange={(e) => updateMCQ(qi, { question: e.target.value })} />
              </div>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="grid grid-cols-[auto,1fr] items-center gap-2">
                    <Label className="text-muted-foreground">Option {oi + 1}</Label>
                    <Input value={opt} onChange={(e) => updateMCQOption(qi, oi, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Correct Answer (text or index)</Label>
                  <Input value={String(q.correct_answer)} onChange={(e) => updateMCQ(qi, { correct_answer: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input type="number" value={q.points} onChange={(e) => updateMCQ(qi, { points: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Descriptive Questions</h3>
        {draft.descriptive_questions.map((q, qi) => (
          <Card key={qi}>
            <CardContent className="space-y-3 pt-6">
              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea value={q.question} onChange={(e) => updateDesc(qi, { question: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Suggested Answer</Label>
                  <Textarea value={q.suggested_answer} onChange={(e) => updateDesc(qi, { suggested_answer: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input type="number" value={q.points} onChange={(e) => updateDesc(qi, { points: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave({ ...draft, is_published: isPublished })} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Quiz"}
        </Button>
      </div>
    </div>
  );
}

export default QuizEditor;


