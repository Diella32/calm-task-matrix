import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  deadline: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Review Q4 reports", description: "Analyze quarterly performance", completed: false, priority: "high", deadline: "2025-10-26" },
    { id: 2, title: "Team meeting prep", description: "Prepare presentation slides", completed: false, priority: "medium", deadline: "2025-10-25" },
    { id: 3, title: "Client presentation", description: "Present new features", completed: false, priority: "high", deadline: "2025-10-28" },
    { id: 4, title: "Update documentation", description: "API docs update", completed: true, priority: "low", deadline: "2025-10-24" },
  ]);

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    toast.success("Task status updated");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">All Tasks</h1>
            <p className="text-muted-foreground">Manage and organize your tasks</p>
          </div>
          <Button onClick={() => navigate("/add-task")} className="gap-2 transition-smooth hover:shadow-soft">
            <Plus className="h-4 w-4" />
            Add New Task
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <Card key={task.id} className="shadow-soft border-border/50 transition-smooth hover:shadow-elegant">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority)} className="capitalize">
                          {task.priority}
                        </Badge>
                        <Button variant="ghost" size="icon" className="transition-smooth hover:bg-secondary">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteTask(task.id)}
                          className="transition-smooth hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Due: {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
