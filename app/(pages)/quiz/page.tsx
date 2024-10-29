"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import AnimatedResultBar from "./progress-bar.animated";
import { o } from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";

interface Option {
  text: string;
  producerScore: number;
  coopScore: number;
}

interface Question {
  id: number;
  text: string;
  weight: number;
  options: Option[];
}

interface Answer {
  [key: number]: number;
}

interface Result {
  recommendedRole: "Producer" | "Co-op";
  producerPercentage: string;
  coopPercentage: string;
}
const CustomRadioGroup: React.FC<{
  options: Option[];
  onChange: (index: number) => void;
  selectedIndex: number | null;
  questionId: number;
}> = ({ options, onChange, selectedIndex, questionId }) => {
  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`q${questionId}-o${index}`}
            name={`question-${questionId}`}
            checked={selectedIndex === index}
            onChange={() => onChange(index)}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor={`q${questionId}-o${index}`}
            className="text-sm font-medium text-gray-700"
          >
            {option.text}
          </label>
        </div>
      ))}
    </div>
  );
};
const questions: Question[] = [
  {
    id: 1,
    text: "Do you already run a farmer's market stand?",
    weight: 3,
    options: [
      { text: "Yes, regularly", producerScore: 1, coopScore: 4 },
      { text: "Occasionally", producerScore: 2, coopScore: 3 },
      { text: "No, but I'm interested", producerScore: 3, coopScore: 2 },
      { text: "No, and I'm not interested", producerScore: 4, coopScore: 1 },
    ],
  },
  {
    id: 2,
    text: "Are you comfortable with people visiting your property and/or farmer's market stand?",
    weight: 2,
    options: [
      { text: "Very comfortable", producerScore: 1, coopScore: 4 },
      { text: "Somewhat comfortable", producerScore: 2, coopScore: 3 },
      { text: "Not very comfortable", producerScore: 3, coopScore: 2 },
      { text: "Not at all comfortable", producerScore: 4, coopScore: 1 },
    ],
  },
  {
    id: 3,
    text: "How interested are you in handling customer interactions?",
    weight: 1,
    options: [
      { text: "Very interested", producerScore: 1, coopScore: 4 },
      { text: "Somewhat interested", producerScore: 2, coopScore: 3 },
      { text: "Not very interested", producerScore: 3, coopScore: 2 },
      { text: "Not at all interested", producerScore: 4, coopScore: 1 },
    ],
  },
];

const RoleSuitabilityTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [result, setResult] = useState<Result | null>(null);
  const [showingResult, setShowingResult] = useState(false);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    let producerScore = 0;
    let coopScore = 0;

    questions.forEach((question) => {
      const answerIndex = answers[question.id];
      if (answerIndex !== undefined) {
        const selectedOption = question.options[answerIndex];
        producerScore += selectedOption.producerScore * question.weight;
        coopScore += selectedOption.coopScore * question.weight;
      }
    });

    const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
    const producerPercentage = (producerScore / (4 * totalWeight)) * 100;
    const coopPercentage = (coopScore / (4 * totalWeight)) * 100;

    setResult({
      recommendedRole:
        producerPercentage > coopPercentage ? "Producer" : "Co-op",
      producerPercentage: producerPercentage.toFixed(2),
      coopPercentage: coopPercentage.toFixed(2),
    });
    setShowingResult(true);
  };
  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const areAllQuestionsAnswered =
    Object.keys(answers).length === questions.length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className={`${o.className} w-full max-w-2xl mx-auto border-none`}>
      <CardHeader>
        {!showingResult && (
          <CardTitle>EZ Homesteading Role Suitability Test</CardTitle>
        )}
        {!showingResult && <Progress value={progress} className="w-full" />}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
        {!showingResult ? (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {currentQuestionData.text}
            </h3>
            <CustomRadioGroup
              options={currentQuestionData.options}
              onChange={(index) => handleAnswer(currentQuestionData.id, index)}
              selectedIndex={answers[currentQuestionData.id] ?? null}
              questionId={currentQuestionData.id}
            />
          </div>
        ) : result ? (
          <div className="text-center w-full">
            <AnimatedResultBar
              recommendedRole={result.recommendedRole}
              coopPercentage={parseFloat(result.coopPercentage)}
              producerPercentage={parseFloat(result.producerPercentage)}
            />
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showingResult && (
          <>
            <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>
            {isLastQuestion && (
              <Button
                onClick={calculateResult}
                disabled={!areAllQuestionsAnswered}
              >
                Calculate Result
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoleSuitabilityTest;
