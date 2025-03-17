import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Timer, Film, Award } from "lucide-react";

interface TriviaOption {
  id: string;
  text: string;
}

interface TriviaQuestionProps {
  question?: string;
  options?: TriviaOption[];
  correctAnswerId?: string;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  timeLimit?: number;
  points?: number;
  onAnswer?: (answerId: string, isCorrect: boolean) => void;
  onTimeUp?: () => void;
}

const TriviaQuestion = ({
  question = "Which film won the Academy Award for Best Picture in 2020?",
  options = [
    { id: "a", text: "Parasite" },
    { id: "b", text: "1917" },
    { id: "c", text: "Joker" },
    { id: "d", text: "Once Upon a Time in Hollywood" },
  ],
  correctAnswerId = "a",
  difficulty = "medium",
  category = "Academy Awards",
  timeLimit = 30,
  points = 100,
  onAnswer = () => {},
  onTimeUp = () => {},
}: TriviaQuestionProps) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAnswered(true);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });

      setProgress((timeRemaining / timeLimit) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, timeLimit, isAnswered, onTimeUp]);

  const handleSelectAnswer = (answerId: string) => {
    if (isAnswered) return;

    setSelectedAnswerId(answerId);
    setIsAnswered(true);

    const isCorrect = answerId === correctAnswerId;
    onAnswer(answerId, isCorrect);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getAnswerButtonClass = (answerId: string) => {
    if (!isAnswered) return "hover:bg-slate-100";

    if (answerId === correctAnswerId) {
      return "bg-green-100 border-green-500 text-green-800";
    }

    if (answerId === selectedAnswerId && answerId !== correctAnswerId) {
      return "bg-red-100 border-red-500 text-red-800";
    }

    return "opacity-60";
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Film size={14} />
              <span>{category}</span>
            </Badge>
            <Badge className={`${getDifficultyColor()} capitalize`}>
              {difficulty}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">{question}</CardTitle>
          <CardDescription className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <Timer size={16} className="text-slate-500" />
              <span>{timeRemaining}s remaining</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={16} className="text-amber-500" />
              <span>{points} points</span>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Progress value={progress} className="h-2 mb-6" />

          <div className="grid gap-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={isAnswered}
                className={`p-4 text-left border-2 rounded-lg transition-all ${getAnswerButtonClass(option.id)}`}
              >
                <span className="font-medium">{option.text}</span>
              </button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          {isAnswered && (
            <div className="w-full text-center">
              {selectedAnswerId === correctAnswerId ? (
                <p className="text-green-600 font-medium">
                  Correct! You earned {points} points.
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  Incorrect. The correct answer was:{" "}
                  {options.find((o) => o.id === correctAnswerId)?.text}
                </p>
              )}
              <Button className="mt-4 w-full" variant="outline">
                Continue
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TriviaQuestion;
