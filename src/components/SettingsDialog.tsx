import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  onSave: (pomodoro: number, shortBreak: number, longBreak: number) => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  onSave,
}: SettingsDialogProps) => {
  const [pomodoro, setPomodoro] = useState(pomodoroTime);
  const [shortBreak, setShortBreak] = useState(shortBreakTime);
  const [longBreak, setLongBreak] = useState(longBreakTime);

  const handleSave = () => {
    onSave(pomodoro, shortBreak, longBreak);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Customize your pomodoro timer durations (in minutes)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pomodoro">Pomodoro Duration</Label>
            <Input
              id="pomodoro"
              type="number"
              min="1"
              max="60"
              value={pomodoro}
              onChange={(e) => setPomodoro(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortBreak">Short Break Duration</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="30"
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="longBreak">Long Break Duration</Label>
            <Input
              id="longBreak"
              type="number"
              min="1"
              max="60"
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
