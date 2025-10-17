import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  BookOpen,
  ClipboardList,
  Layers,
  Trophy,
  MessageCircle,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "AI Lesson Planner", url: "/lesson-planner", icon: BookOpen },
  { title: "Quiz Generator", url: "/quiz-generator", icon: ClipboardList },
  { title: "Adaptive Studio", url: "/adaptive-studio", icon: Layers },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Teaching Assistant", url: "/chat", icon: MessageCircle },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />

        <Sidebar className="backdrop-blur-xl bg-white/70 border-r-white/50">
          <SidebarContent>
            {/* Header */}
            <div className="p-4">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white shadow-glow">
                <Sparkles className="w-6 h-6 animate-float" />
                <span className="font-bold text-lg">SAHAYAK</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-4">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className={isActive ? "bg-white shadow-md scale-105" : ""}>
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={isActive ? "font-semibold" : ""}>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                    {user?.email?.[0].toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.email?.split("@")[0] || "Teacher"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b backdrop-blur-xl bg-white/70 border-white/50 flex items-center px-4">
            <SidebarTrigger />
          </header>

          <main className="flex-1 p-6 overflow-auto relative z-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}