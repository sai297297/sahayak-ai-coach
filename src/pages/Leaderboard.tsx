import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center backdrop-blur-xl bg-white/70 border-white/50">
          <Trophy className="w-20 h-20 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Leaderboards Coming Soon!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Student quiz data and performance tracking will appear here. Create quizzes to get
            started!
          </p>
          <Link to="/quiz-generator">
            <Button size="lg">Go to Quiz Generator</Button>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;