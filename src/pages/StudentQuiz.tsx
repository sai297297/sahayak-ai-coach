import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function StudentQuiz() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [descAnswers, setDescAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTs] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [submittedSummary, setSubmittedSummary] = useState<null | { totalMcq: number; correct: number }>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setError(null);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("quizzes")
          .select("*")
          .eq("quiz_code", code)
          .eq("is_published", true)
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error("Quiz not found or not published.");
        if (!active) return;
        setQuiz(data);
        // Initialize timer if duration is set
        if (typeof data.duration === "number" && data.duration > 0) {
          setTimeLeft(data.duration * 60);
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load quiz.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [code]);

  const mcqs = useMemo(() => Array.isArray(quiz?.mcq_questions) ? quiz.mcq_questions : [], [quiz]);
  const descs = useMemo(() => Array.isArray(quiz?.descriptive_questions) ? quiz.descriptive_questions : [], [quiz]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      // Auto-submit when time is up
      handleSubmit(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  function computeMcqScore(): { totalMcq: number; correct: number } {
    const totalMcq = mcqs.length;
    let correct = 0;
    for (let i = 0; i < mcqs.length; i++) {
      const ans = mcqAnswers[i];
      // correct_answer in generation is a string (we store as text). We compare by index string.
      const correctAnswer = String(mcqs[i].correct_answer ?? "");
      if (ans != null && String(ans) === correctAnswer) correct++;
    }
    return { totalMcq, correct };
  }

  async function handleSubmit(auto = false) {
    if (!quiz) return;
    if (!studentName.trim()) {
      if (!auto) setError("Please enter your name.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const timeTakenSec = Math.floor((Date.now() - startTs) / 1000);

      const payload = {
        quiz_id: quiz.id,
        student_name: studentName.trim(),
        student_roll: studentRoll.trim() || null,
        mcq_answers: mcqs.map((_: any, i: number) => mcqAnswers[i] ?? null),
        descriptive_answers: descs.map((_: any, i: number) => descAnswers[i] ?? ""),
        time_taken: timeTakenSec,
      };

      const { error } = await supabase.from("quiz_responses").insert(payload);
      if (error) throw error;
      const summary = computeMcqScore();
      setSubmittedSummary(summary);
    } catch (e: any) {
      setError(e.message ?? "Failed to submit responses.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="max-w-2xl mx-auto p-4 text-red-600">{error}</div>;
  if (!quiz) return null;

  // Post-submit feedback screen
  if (submittedSummary) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4 text-center">
        <h2 className="text-2xl font-semibold">Thanks for submitting!</h2>
        <p className="text-muted-foreground">Your MCQ score: {submittedSummary.correct} / {submittedSummary.totalMcq}</p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div>{quiz.subject} • Grade {quiz.grade_level}</div>
          {quiz.duration ? (
            <div className="flex items-center gap-3">
              <span>Duration: {quiz.duration} min</span>
              {typeof timeLeft === "number" ? (
                <span className="font-medium text-foreground">
                  Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="space-y-1">
            <Label htmlFor="student_name">Name</Label>
            <Input id="student_name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="student_roll">Roll (optional)</Label>
            <Input id="student_roll" value={studentRoll} onChange={(e) => setStudentRoll(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {mcqs.length > 0 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Multiple Choice Questions</h3>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">Question {currentIndex + 1} of {mcqs.length}</div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}>Prev</Button>
                <Button variant="outline" disabled={currentIndex >= mcqs.length - 1} onClick={() => setCurrentIndex((i) => Math.min(mcqs.length - 1, i + 1))}>Next</Button>
              </div>
            </div>
            {(() => {
              const q = mcqs[currentIndex];
              const qi = currentIndex;
              return (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="font-medium">Q{qi + 1}. {q.question}</div>
                    <div className="space-y-2">
                      {Array.isArray(q.options) ? q.options.map((opt: string, oi: number) => (
                        <label key={oi} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`q${qi}`}
                            value={String(oi)}
                            checked={mcqAnswers[qi] === String(oi)}
                            onChange={(e) => setMcqAnswers((s) => ({ ...s, [qi]: e.target.value }))}
                          />
                          <span>{opt}</span>
                        </label>
                      )) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
            <div className="flex flex-wrap gap-2 mt-3">
              {mcqs.map((_: any, i: number) => (
                <Button key={i} variant={i === currentIndex ? "default" : "outline"} onClick={() => setCurrentIndex(i)}>{i + 1}</Button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {descs.length > 0 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Descriptive Questions</h3>
          {descs.map((q: any, qi: number) => (
            <Card key={qi}>
              <CardContent className="pt-6 space-y-3">
                <div className="font-medium">Q{qi + 1}. {q.question}</div>
                <Textarea value={descAnswers[qi] ?? ""} onChange={(e) => setDescAnswers((s) => ({ ...s, [qi]: e.target.value }))} />
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      {error ? <div className="text-red-600">{error}</div> : null}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
      </div>
    </div>
  );
}


