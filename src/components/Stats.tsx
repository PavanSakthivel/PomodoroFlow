import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, Target, TrendingUp } from "lucide-react";

interface Session {
  date: string;
  pomodoros: number;
  shortBreaks: number;
  longBreaks: number;
}

interface StatsProps {
  sessions: Session[];
}

export const Stats = ({ sessions }: StatsProps) => {
  const today = new Date().toDateString();
  const todaySession = sessions.find((s) => new Date(s.date).toDateString() === today);
  
  const totalPomodoros = sessions.reduce((sum, s) => sum + s.pomodoros, 0);
  const totalTime = sessions.reduce((sum, s) => sum + s.pomodoros * 25, 0);
  
  const last7Days = sessions.slice(-7).map((session) => ({
    date: new Date(session.date).toLocaleDateString("en-US", { weekday: "short" }),
    sessions: session.pomodoros,
  }));

  const avgPomodorosPerDay = sessions.length > 0 ? Math.round(totalPomodoros / sessions.length) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Pomodoros</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaySession?.pomodoros || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(todaySession?.pomodoros || 0) * 25} minutes focused
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pomodoros</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPomodoros}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalTime} minutes total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgPomodorosPerDay}</div>
            <p className="text-xs text-muted-foreground mt-1">
              sessions per day
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Your pomodoro sessions over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Time Stats</CardTitle>
          <CardDescription>Your productivity journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="space-y-4 mt-4">
              {sessions.slice(-5).reverse().map((session, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="font-medium">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.pomodoros} pomodoros, {session.shortBreaks} short breaks,{" "}
                      {session.longBreaks} long breaks
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{session.pomodoros * 25}m</p>
                    <p className="text-xs text-muted-foreground">focused</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="all" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">{totalPomodoros}</p>
                  <p className="text-sm text-muted-foreground">Total Pomodoros</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">{Math.round(totalTime / 60)}h</p>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">{sessions.length}</p>
                  <p className="text-sm text-muted-foreground">Days Active</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">{avgPomodorosPerDay}</p>
                  <p className="text-sm text-muted-foreground">Avg Per Day</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
