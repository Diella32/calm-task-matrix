import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  deadline: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
      toast.success(currentStatus ? "Task reopened" : "Task completed!");
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

  return {
    tasks,
    loading,
    fetchTasks,
    toggleComplete,
    deleteTask,
  };
};
