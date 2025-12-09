import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const categories = [
  { value: "general", label: "General" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "learning", label: "Learning" },
];

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        toast.error("Task not found");
        navigate("/tasks");
        return;
      }

      setTitle(data.title);
      setDescription(data.description || "");
      setPriority(data.priority);
      setCategory(data.category || "general");
      setDeadline(data.deadline);
      setLoading(false);
    };

    if (!authLoading) {
      fetchTask();
    }
  }, [id, navigate, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    if (!deadline) {
      toast.error("Please select a deadline");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("tasks")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        category,
        deadline,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update task");
      console.error(error);
    } else {
      toast.success("Task updated successfully!");
      navigate("/tasks");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    setDeleting(false);

    if (error) {
      toast.error("Failed to delete task");
    } else {
      toast.success("Task deleted");
      navigate("/tasks");
    }
  };

  if (authLoading || loading) {
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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/tasks")} 
            className="mb-4 gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tasks
          </Button>

          <PageHeader 
            title="Edit Task" 
            description="Update your task details"
            action={
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your task.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }
          />

          <Card className="shadow-elegant border-border/50 animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Task Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 transition-smooth focus:shadow-soft"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add more details about this task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-24 transition-smooth focus:shadow-soft resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-11 transition-smooth focus:shadow-soft">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="h-11 transition-smooth focus:shadow-soft">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-sm font-medium">
                    Deadline <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="h-11 transition-smooth focus:shadow-soft"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    className="flex-1 h-11 font-medium shadow-soft hover:shadow-elegant"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/tasks")}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditTask;
