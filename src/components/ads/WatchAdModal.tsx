import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Ticket, X } from "lucide-react";

interface WatchAdModalProps {
  onComplete?: (pointsEarned: number) => void;
  trigger?: React.ReactNode;
}

const WatchAdModal = ({
  onComplete = () => {},
  trigger,
}: WatchAdModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adState, setAdState] = useState<
    "ready" | "playing" | "completed" | "error"
  >("ready");
  const [progress, setProgress] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [adTime, setAdTime] = useState(15); // 15 seconds ad

  // Simulate ad playback
  useEffect(() => {
    if (adState !== "playing") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / adTime;
        if (newProgress >= 100) {
          clearInterval(interval);
          setAdState("completed");
          // Random points between 20-50
          const points = Math.floor(Math.random() * 31) + 20;
          setPointsEarned(points);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [adState, adTime]);

  const handleStartAd = () => {
    setAdState("playing");
    setProgress(0);
  };

  const handleComplete = () => {
    onComplete(pointsEarned);
    setIsOpen(false);
    // Reset for next time
    setTimeout(() => {
      setAdState("ready");
      setProgress(0);
      setPointsEarned(0);
    }, 300);
  };

  const handleClose = () => {
    if (adState === "playing") {
      // If ad is playing, just cancel it
      setAdState("ready");
      setProgress(0);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Watch Ad for Points
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Watch Ad for Points</span>
            {adState !== "playing" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {adState === "ready" && "Watch a short ad to earn movie points"}
            {adState === "playing" &&
              "Please watch the entire ad to earn points"}
            {adState === "completed" &&
              `Congratulations! You've earned ${pointsEarned} points`}
            {adState === "error" && "There was an error playing the ad"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          {adState === "ready" && (
            <div className="text-center space-y-4">
              <div className="bg-primary/10 p-6 rounded-full mx-auto">
                <Ticket className="h-12 w-12 text-primary" />
              </div>
              <p>Watch a short ad to earn between 20-50 movie points</p>
              <Button onClick={handleStartAd}>Start Watching</Button>
            </div>
          )}

          {adState === "playing" && (
            <div className="w-full space-y-4">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Ad is playing...</p>
                  <p className="text-sm text-muted-foreground">
                    (This is a simulated ad for demo purposes)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ad progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {adState === "completed" && (
            <div className="text-center space-y-4">
              <div className="bg-green-100 p-6 rounded-full mx-auto">
                <Ticket className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-green-600">
                  +{pointsEarned} Points
                </p>
                <p className="text-sm text-muted-foreground">
                  Thanks for watching! Points have been added to your account.
                </p>
              </div>
            </div>
          )}

          {adState === "error" && (
            <div className="text-center space-y-4">
              <div className="bg-red-100 p-6 rounded-full mx-auto">
                <X className="h-12 w-12 text-red-600" />
              </div>
              <p>There was an error playing the ad. Please try again later.</p>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>

        {adState === "completed" && (
          <DialogFooter>
            <Button onClick={handleComplete}>Claim Points</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WatchAdModal;
