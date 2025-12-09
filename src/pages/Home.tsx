import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { CheckCircle2, Clock, TrendingUp, Calendar, Loader2, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();

  const today = new Date().toISOString().split('T')[0];
  
  const { completedTasks, dueTodayTasks, upcomingTasks, overdueTasks, completionRate } = useMemo(() => {
    const completed = tasks.filter(t => t.completed);
    const dueToday = tasks.filter(t => t.deadline === today && !t.completed);
    const upcoming = tasks.filter(t => t.deadline > today && !t.completed);
    const overdue = tasks.filter(t => t.deadline < today && !t.completed);
    const rate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    
    return {
      completedTasks: completed,
      dueTodayTasks: dueToday,
      upcomingTasks: upcoming,
      overdueTasks: overdue,
      completionRate: rate,
    };
  }, [tasks, today]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader 
          title={getGreeting()} 
          description="Here's your productivity overview"
          action={
            <Button onClick={() => navigate("/add-task")} className="gap-2 shadow-soft hover:shadow-elegant">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Due Today" 
            value={dueTodayTasks.length} 
            icon={Clock}
            className="animate-fade-in"
          />
          <StatsCard 
            title="Completed" 
            value={completedTasks.length} 
            icon={CheckCircle2}
            className="animate-fade-in animation-delay-100"
          />
          <StatsCard 
            title="Upcoming" 
            value={upcomingTasks.length} 
            icon={Calendar}
            className="animate-fade-in animation-delay-200"
          />
          <StatsCard 
            title="Completion" 
            value={`${completionRate}%`} 
            icon={TrendingUp}
            trend={completionRate >= 70 ? "On track" : undefined}
            trendUp={completionRate >= 70}
            className="animate-fade-in animation-delay-300"
          />
        </div>

        {/* Overdue Alert */}
        {overdueTasks.length > 0 && (
          <Card className="mb-6 border-destructive/30 bg-destructive/5 animate-fade-in">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/10 p-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Review and update your deadlines to stay on track
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                  View Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Due Today */}
          <Card className="shadow-soft border-border/50 animate-fade-in animation-delay-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                Due Today
                {dueTodayTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">{dueTodayTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
              {dueTodayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No tasks due today</p>
              ) : (
                dueTodayTasks.slice(0, 5).map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors cursor-pointer"
                    onClick={() => navigate(`/edit-task/${task.id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm line-clamp-1">{task.title}</p>
                      <Badge 
                        variant={task.priority === "high" ? "destructive" : "secondary"} 
                        className="text-xs flex-shrink-0"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="shadow-soft border-border/50 animate-fade-in animation-delay-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="rounded-lg bg-success/10 p-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                Recently Completed
                {completedTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">{completedTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
              {completedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No completed tasks yet</p>
              ) : (
                completedTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="p-3 rounded-lg bg-success/5 border border-success/20">
                    <p className="font-medium text-sm line-through text-muted-foreground line-clamp-1">
                      {task.title}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="shadow-soft border-border/50 animate-fade-in animation-delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="rounded-lg bg-accent/10 p-1.5">
                  <Calendar className="h-4 w-4 text-accent" />
                </div>
                Upcoming
                {upcomingTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">{upcomingTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No upcoming tasks</p>
              ) : (
                upcomingTasks.slice(0, 5).map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors cursor-pointer"
                    onClick={() => navigate(`/edit-task/${task.id}`)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm line-clamp-1">{task.title}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
