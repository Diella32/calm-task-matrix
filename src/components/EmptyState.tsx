import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  type: "no-tasks" | "no-results" | "all-done";
  onClearFilters?: () => void;
}

export const EmptyState = ({ type, onClearFilters }: EmptyStateProps) => {
  const navigate = useNavigate();

  const content = {
    "no-tasks": {
      icon: Plus,
      title: "No tasks yet",
      description: "Create your first task to get started with your productivity journey.",
      action: (
        <Button onClick={() => navigate("/add-task")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create First Task
        </Button>
      ),
    },
    "no-results": {
      icon: Search,
      title: "No matching tasks",
      description: "Try adjusting your search or filters to find what you're looking for.",
      action: onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ),
    },
    "all-done": {
      icon: CheckCircle2,
      title: "All caught up!",
      description: "You've completed all your tasks. Great job!",
      action: (
        <Button onClick={() => navigate("/add-task")} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add More Tasks
        </Button>
      ),
    },
  };

  const { icon: Icon, title, description, action } = content[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
};
