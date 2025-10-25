import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, TrendingUp, Calendar } from "lucide-react";

const Home = () => {
  const [tasks] = useState([
    { id: 1, title: "Review Q4 reports", dueToday: true, completed: false, priority: "high" },
    { id: 2, title: "Team meeting prep", dueToday: true, completed: false, priority: "medium" },
    { id: 3, title: "Client presentation", dueToday: false, completed: false, priority: "high" },
    { id: 4, title: "Update documentation", dueToday: false, completed: true, priority: "low" },
  ]);

  const completedTasks = tasks.filter(t => t.completed);
  const dueTodayTasks = tasks.filter(t => t.dueToday && !t.completed);
  const upcomingTasks = tasks.filter(t => !t.dueToday && !t.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Good morning</h1>
          <p className="text-muted-foreground">Here's your productivity overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft border-border/50 transition-smooth hover:shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Today</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{dueTodayTasks.length}</p>
                </div>
                <div className="rounded-full bg-accent/10 p-3">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50 transition-smooth hover:shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{completedTasks.length}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50 transition-smooth hover:shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{upcomingTasks.length}</p>
                </div>
                <div className="rounded-full bg-secondary p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50 transition-smooth hover:shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {Math.round((completedTasks.length / tasks.length) * 100)}%
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Due Today */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Due Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dueTodayTasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-secondary/50 border border-border transition-smooth hover:bg-secondary">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{task.title}</p>
                    <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="font-medium text-sm line-through text-muted-foreground">{task.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-secondary/50 border border-border transition-smooth hover:bg-secondary">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{task.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
