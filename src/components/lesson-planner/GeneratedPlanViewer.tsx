import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Edit, Save, Star, Target, Package, Lightbulb, CheckCircle, Users, Home } from "lucide-react";

interface GeneratedPlanViewerProps {
  plan: any;
  onSave: (plan: any) => void;
  onBack: () => void;
}

const GeneratedPlanViewer = ({ plan, onSave, onBack }: GeneratedPlanViewerProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState(plan);

  const handleSave = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      onSave(editedPlan);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 backdrop-blur-xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white border-0 shadow-glow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editMode ? (
              <Input
                value={editedPlan.title}
                onChange={(e) => setEditedPlan({ ...editedPlan, title: e.target.value })}
                className="text-3xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/70 mb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold mb-2">{editedPlan.title}</h1>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/20">
                {plan.subject}
              </Badge>
              <Badge variant="secondary" className="bg-white/20">
                Grade {plan.grade_level}
              </Badge>
              <Badge variant="secondary" className="bg-white/20">
                <Clock className="w-3 h-3 mr-1" />
                {plan.duration} min
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="bg-white/20 hover:bg-white/30"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Objectives */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Learning Objectives</h2>
        </div>
        {editMode ? (
          <div className="space-y-2">
            {editedPlan.objectives.map((obj: string, idx: number) => (
              <Input
                key={idx}
                value={obj}
                onChange={(e) => {
                  const newObjectives = [...editedPlan.objectives];
                  newObjectives[idx] = e.target.value;
                  setEditedPlan({ ...editedPlan, objectives: newObjectives });
                }}
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {editedPlan.objectives.map((obj: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Materials Needed */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Materials Needed</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {editedPlan.materials_needed.map((material: string, idx: number) => (
            <Badge key={idx} variant="outline">
              {material}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Introduction */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Introduction</h2>
        </div>
        {editMode ? (
          <Textarea
            value={editedPlan.introduction}
            onChange={(e) => setEditedPlan({ ...editedPlan, introduction: e.target.value })}
            rows={4}
          />
        ) : (
          <p className="text-muted-foreground">{editedPlan.introduction}</p>
        )}
      </Card>

      {/* Main Activities */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Main Activities</h2>
        </div>
        <div className="space-y-4">
          {editedPlan.main_activities.map((activity: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{activity.activity}</h3>
                <Badge variant="secondary">{activity.time} min</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Assessment */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Assessment</h2>
        </div>
        {editMode ? (
          <Textarea
            value={editedPlan.assessment}
            onChange={(e) => setEditedPlan({ ...editedPlan, assessment: e.target.value })}
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground">{editedPlan.assessment}</p>
        )}
      </Card>

      {/* Differentiation */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Differentiation</h2>
        </div>
        {editMode ? (
          <Textarea
            value={editedPlan.differentiation}
            onChange={(e) => setEditedPlan({ ...editedPlan, differentiation: e.target.value })}
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground">{editedPlan.differentiation}</p>
        )}
      </Card>

      {/* Closure */}
      <Card className="p-6 backdrop-blur-xl bg-white/70 border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Closure</h2>
        </div>
        {editMode ? (
          <Textarea
            value={editedPlan.closure}
            onChange={(e) => setEditedPlan({ ...editedPlan, closure: e.target.value })}
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground">{editedPlan.closure}</p>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          Back to Form
        </Button>
        <Button onClick={handleSave} size="lg" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {editMode ? "Apply Changes" : "Save Lesson Plan"}
        </Button>
      </div>
    </div>
  );
};

export default GeneratedPlanViewer;