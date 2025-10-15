import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerProps {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  onSessionComplete: (mode: TimerMode) => void;
  onOpenSettings: () => void;
}

export const Timer = ({
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  onSessionComplete,
  onOpenSettings,
}: TimerProps) => {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = {
    pomodoro: pomodoroTime * 60,
    shortBreak: shortBreakTime * 60,
    longBreak: longBreakTime * 60,
  };

  useEffect(() => {
    setTimeLeft(totalTime[mode]);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    onSessionComplete(mode);
    
    if (mode === "pomodoro") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      if (newCount % 4 === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      setMode("pomodoro");
    }

    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'pomodoro' ? 'Time for a break!' : 'Time to focus!',
      });
    }
  };

  const toggleTimer = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime[mode]);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(totalTime[newMode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((totalTime[mode] - timeLeft) / totalTime[mode]) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="flex gap-2">
        <Button
          variant={mode === "pomodoro" ? "default" : "outline"}
          onClick={() => changeMode("pomodoro")}
          disabled={isRunning}
        >
          Pomodoro
        </Button>
        <Button
          variant={mode === "shortBreak" ? "default" : "outline"}
          onClick={() => changeMode("shortBreak")}
          disabled={isRunning}
        >
          Short Break
        </Button>
        <Button
          variant={mode === "longBreak" ? "default" : "outline"}
          onClick={() => changeMode("longBreak")}
          disabled={isRunning}
        >
          Long Break
        </Button>
      </div>

      <div className="relative">
        <svg className="w-80 h-80 transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
            className={cn(
              "text-primary transition-all duration-1000",
              isRunning && "timer-glow"
            )}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn("text-7xl font-bold tabular-nums", isRunning && "timer-tick")}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-muted-foreground mt-2 capitalize">{mode.replace(/([A-Z])/g, ' $1').trim()}</div>
          {mode === "pomodoro" && (
            <div className="text-sm text-muted-foreground mt-1">
              Session {completedPomodoros + 1}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button size="lg" onClick={toggleTimer} className="w-32">
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
        <Button size="lg" variant="outline" onClick={resetTimer}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button size="lg" variant="outline" onClick={onOpenSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};
