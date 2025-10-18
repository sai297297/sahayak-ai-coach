import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Quiz = {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  duration: number | null;
  total_points: number | null;
  quiz_code: string | null;
  is_published: boolean | null;
};

export function QuizList({ quizzes, isLoading, onCreateNew, onEdit, onTogglePublish }: {
  quizzes: Quiz[] | undefined;
  isLoading: boolean;
  onCreateNew: () => void;
  onEdit: (quiz: Quiz) => void;
  onTogglePublish: (quiz: Quiz) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0,1,2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <Card className="text-center py-10">
        <CardHeader>
          <CardTitle>No quizzes yet</CardTitle>
          <CardDescription>Create your first quiz using AI</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCreateNew} size="lg">Create Your First Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              {quiz.is_published ? (
                <Badge variant="default">{quiz.quiz_code ?? "CODE"}</Badge>
              ) : null}
            </div>
            <CardDescription>
              {quiz.subject} • Grade {quiz.grade_level}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Duration: {quiz.duration ?? 0} min</span>
              <span>Total Points: {quiz.total_points ?? 0}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => onEdit(quiz)}>Edit</Button>
              <Button size="sm" onClick={() => onTogglePublish(quiz)}>
                {quiz.is_published ? "Unpublish" : "Publish"}
              </Button>
              {quiz.is_published && quiz.quiz_code ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const origin = window.location.origin;
                    const url = `${origin}/q/${quiz.quiz_code}`;
                    navigator.clipboard.writeText(url).then(() => {
                      toast.success("Link copied", { description: url });
                    }).catch(() => {
                      toast.error("Failed to copy link");
                    });
                  }}
                >
                  Copy Link
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default QuizList;


