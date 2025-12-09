import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Calendar, Tag } from "lucide-react";
import { Task } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: { variant: "destructive" as const, label: "High" },
  medium: { variant: "default" as const, label: "Medium" },
  low: { variant: "secondary" as const, label: "Low" },
};

const categoryColors: Record<string, string> = {
  work: "bg-blue-500/10 text-blue-600 border-blue-200",
  personal: "bg-purple-500/10 text-purple-600 border-purple-200",
  health: "bg-green-500/10 text-green-600 border-green-200",
  finance: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  learning: "bg-pink-500/10 text-pink-600 border-pink-200",
  general: "bg-muted text-muted-foreground border-border",
};

export const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  const navigate = useNavigate();
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const categoryStyle = categoryColors[task.category] || categoryColors.general;
  
  const isOverdue = !task.completed && new Date(task.deadline) < new Date(new Date().toDateString());
  const isToday = task.deadline === new Date().toISOString().split('T')[0];

  return (
    <Card className={cn(
      "shadow-soft border-border/50 transition-all duration-300 hover:shadow-elegant group",
      task.completed && "opacity-70 bg-muted/30",
      isOverdue && !task.completed && "border-l-4 border-l-destructive"
    )}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id, task.completed)}
            className="mt-1 h-5 w-5 transition-all duration-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-base leading-tight",
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                )}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Badge variant={priority.variant} className="text-xs font-medium">
                  {priority.label}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(`/edit-task/${task.id}`)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className={cn(
                "flex items-center gap-1.5",
                isOverdue && !task.completed ? "text-destructive font-medium" : "text-muted-foreground",
                isToday && !task.completed && !isOverdue && "text-primary font-medium"
              )}>
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {isOverdue && !task.completed ? "Overdue: " : isToday ? "Today" : ""}
                  {!isToday && new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs", categoryStyle)}>
                <Tag className="h-3 w-3" />
                <span className="capitalize">{task.category}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
