import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, Layers, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome to SAHAYAK
          </h1>
          <p className="text-xl text-muted-foreground">Your AI-Powered Teaching Assistant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 backdrop-blur-xl bg-white/70 border-white/50 hover:shadow-xl transition-all">
            <BookOpen className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-2">AI Lesson Planner</h3>
            <p className="text-muted-foreground mb-4">Generate comprehensive lesson plans in seconds</p>
            <Link to="/lesson-planner">
              <Button>Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 backdrop-blur-xl bg-white/70 border-white/50 hover:shadow-xl transition-all">
            <ClipboardList className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Quiz Generator</h3>
            <p className="text-muted-foreground mb-4">Create assessments with AI assistance</p>
            <Link to="/quiz-generator">
              <Button>Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 backdrop-blur-xl bg-white/70 border-white/50 hover:shadow-xl transition-all">
            <Layers className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Adaptive Studio</h3>
            <p className="text-muted-foreground mb-4">Generate differentiated learning materials</p>
            <Link to="/adaptive-studio">
              <Button>Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 backdrop-blur-xl bg-white/70 border-white/50 hover:shadow-xl transition-all">
            <MessageCircle className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Teaching Assistant</h3>
            <p className="text-muted-foreground mb-4">Get expert teaching advice instantly</p>
            <Link to="/chat">
              <Button>Get Started</Button>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
