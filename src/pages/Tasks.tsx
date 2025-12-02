import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  deadline: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchTasks();
    };
    checkAuthAndFetch();
  }, [navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("deadline", { ascending: true });

    if (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update task");
    } else {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !currentStatus } : task
      ));
      toast.success("Task status updated");
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete task");
    } else {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success("Task deleted");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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

        {tasks.length === 0 ? (
          <Card className="shadow-soft border-border/50 p-8 text-center">
            <p className="text-muted-foreground">No tasks yet. Create your first task!</p>
            <Button onClick={() => navigate("/add-task")} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task.id} className="shadow-soft border-border/50 transition-smooth hover:shadow-elegant">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleComplete(task.id, task.completed)}
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
                          <Badge variant={getPriorityColor(task.priority) as any} className="capitalize">
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
        )}
      </main>
    </div>
  );
};

export default Tasks;