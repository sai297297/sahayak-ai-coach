import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LessonPlanner from "./pages/LessonPlanner";
import QuizGenerator from "./pages/QuizGenerator";
import AdaptiveStudio from "./pages/AdaptiveStudio";
import Leaderboard from "./pages/Leaderboard";
import ChatAssistant from "./pages/ChatAssistant";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import StudentQuiz from "./pages/StudentQuiz"; // fixed import

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/q/:code" element={<StudentQuiz />} /> {/* fixed route */}
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/lesson-planner" element={<ProtectedRoute><LessonPlanner /></ProtectedRoute>} />
          <Route path="/quiz-generator" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
          <Route path="/adaptive-studio" element={<ProtectedRoute><AdaptiveStudio /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
