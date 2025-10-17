import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Material = {
  id: string;
  title: string;
  content_type: string;
  difficulty_level: "beginner" | "intermediate" | "advanced" | string;
  content?: string;
  instructions?: string;
  duration?: number | string | null;
  questions?: Array<{ question: string; type?: string; options?: string[]; answer?: string }> | null;
};

function difficultyGradient(level: string) {
  if (level === "beginner") return "from-green-500 to-emerald-600";
  if (level === "intermediate") return "from-yellow-500 to-amber-600";
  if (level === "advanced") return "from-rose-500 to-red-600";
  return "from-slate-600 to-slate-700";
}

export function MaterialViewer({ material, onBack }: { material: Material; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Card className={`bg-gradient-to-r ${difficultyGradient(material.difficulty_level)} text-white`}>
        <CardHeader>
          <CardTitle className="text-white">{material.title}</CardTitle>
        </CardHeader>
      </Card>

      {material.instructions ? (
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{material.instructions}</div>
          </CardContent>
        </Card>
      ) : null}

      {material.content ? (
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{material.content}</div>
          </CardContent>
        </Card>
      ) : null}

      {Array.isArray(material.questions) && material.questions.length > 0 ? (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Questions</h3>
          {material.questions!.map((q, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="font-medium">Q{i + 1}. {q.question}</div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}

export default MaterialViewer;


