import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskFilters } from "@/components/TaskFilters";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

const Tasks = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, toggleComplete, deleteTask } = useTasks();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Priority filter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      // Category filter
      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = !task.completed;
      if (statusFilter === "completed") matchesStatus = task.completed;
      if (statusFilter === "overdue") matchesStatus = !task.completed && task.deadline < today;
      
      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, categoryFilter, statusFilter, today]);

  const hasActiveFilters = searchQuery || priorityFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => !t.completed);
  const getEmptyStateType = () => {
    if (tasks.length === 0) return "no-tasks";
    if (filteredTasks.length === 0 && hasActiveFilters) return "no-results";
    if (activeTasks.length === 0 && tasks.length > 0) return "all-done";
    return "no-results";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader 
          title="All Tasks" 
          description={`${tasks.length} total · ${activeTasks.length} active`}
          action={
            <Button onClick={() => navigate("/add-task")} className="gap-2 shadow-soft hover:shadow-elegant">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          }
        />

        {tasks.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <TaskFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        {filteredTasks.length === 0 ? (
          <EmptyState 
            type={getEmptyStateType()} 
            onClearFilters={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <TaskCard
                  task={task}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
