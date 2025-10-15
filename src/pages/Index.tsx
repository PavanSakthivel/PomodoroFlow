import { useState, useEffect } from "react";
import { Timer } from "@/components/Timer";
import { Stats } from "@/components/Stats";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer as TimerIcon, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Session {
  date: string;
  pomodoros: number;
  shortBreaks: number;
  longBreaks: number;
}

const Index = () => {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPomodoroTime(settings.pomodoro);
      setShortBreakTime(settings.shortBreak);
      setLongBreakTime(settings.longBreak);
    }

    const savedSessions = localStorage.getItem("pomodoroSessions");
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handleSaveSettings = (pomodoro: number, shortBreak: number, longBreak: number) => {
    setPomodoroTime(pomodoro);
    setShortBreakTime(shortBreak);
    setLongBreakTime(longBreak);
    localStorage.setItem(
      "pomodoroSettings",
      JSON.stringify({ pomodoro, shortBreak, longBreak })
    );
    toast.success("Settings saved successfully!");
  };

  const handleSessionComplete = (mode: "pomodoro" | "shortBreak" | "longBreak") => {
    const today = new Date().toDateString();
    const todaySession = sessions.find((s) => new Date(s.date).toDateString() === today);

    let updatedSessions: Session[];
    if (todaySession) {
      updatedSessions = sessions.map((s) =>
        new Date(s.date).toDateString() === today
          ? {
              ...s,
              pomodoros: mode === "pomodoro" ? s.pomodoros + 1 : s.pomodoros,
              shortBreaks: mode === "shortBreak" ? s.shortBreaks + 1 : s.shortBreaks,
              longBreaks: mode === "longBreak" ? s.longBreaks + 1 : s.longBreaks,
            }
          : s
      );
    } else {
      updatedSessions = [
        ...sessions,
        {
          date: new Date().toISOString(),
          pomodoros: mode === "pomodoro" ? 1 : 0,
          shortBreaks: mode === "shortBreak" ? 1 : 0,
          longBreaks: mode === "longBreak" ? 1 : 0,
        },
      ];
    }

    setSessions(updatedSessions);
    localStorage.setItem("pomodoroSessions", JSON.stringify(updatedSessions));

    if (mode === "pomodoro") {
      toast.success("Great work! Time for a break.", {
        description: "You've completed a pomodoro session!",
      });
    } else {
      toast.success("Break's over! Ready to focus?", {
        description: "Time to start another pomodoro.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TimerIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">PomodoroFlow</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <TimerIcon className="h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="mt-0">
            <Timer
              pomodoroTime={pomodoroTime}
              shortBreakTime={shortBreakTime}
              longBreakTime={longBreakTime}
              onSessionComplete={handleSessionComplete}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <Stats sessions={sessions} />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        pomodoroTime={pomodoroTime}
        shortBreakTime={shortBreakTime}
        longBreakTime={longBreakTime}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default Index;
