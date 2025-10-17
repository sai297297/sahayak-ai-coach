import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Material = {
  id: string;
  title: string;
  content_type: string;
  difficulty_level: string;
};

export function MaterialsList({ materials, isLoading, onSelectMaterial }: {
  materials: Material[] | undefined;
  isLoading: boolean;
  onSelectMaterial: (m: Material) => void;
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
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <Card className="text-center py-10">
        <CardHeader>
          <CardTitle>No materials yet</CardTitle>
          <CardDescription>Generate differentiated content for your class</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((m) => (
        <Card key={m.id}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">{m.title}</CardTitle>
            <CardDescription className="flex gap-2">
              <Badge variant="secondary">{m.content_type}</Badge>
              <Badge>{m.difficulty_level}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => onSelectMaterial(m)}>View</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MaterialsList;


