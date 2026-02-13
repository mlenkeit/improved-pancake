export interface Question {
  id: string;
  text: string;
  tags: string[];
}

export const questions: Question[] = [
  {
    id: "q1",
    text: "What exactly is the real problem — and how would I know it is solved?",
    tags: ["clarity", "perspective"]
  },
  {
    id: "q2",
    text: "What part of this situation is within my control?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q3",
    text: "What assumptions am I making right now?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q4",
    text: "What would I do if I were not afraid of making a mistake?",
    tags: ["fear", "decision"]
  },
  {
    id: "q5",
    text: "What options exist beyond the obvious ones?",
    tags: ["perspective", "decision"]
  },
  {
    id: "q6",
    text: "What is the worst realistic outcome — and how likely is it?",
    tags: ["fear", "perspective"]
  },
  {
    id: "q7",
    text: "Which of my strengths can I consciously apply here?",
    tags: ["people", "performance"]
  },
  {
    id: "q8",
    text: "What would an objective outsider notice?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q9",
    text: "What small step could improve this situation today?",
    tags: ["performance", "decision"]
  },
  {
    id: "q10",
    text: "What long-term story do I want to tell about how I handled this?",
    tags: ["perspective", "passion"]
  },
  {
    id: "q11",
    text: "What is the cost of not acting?",
    tags: ["decision", "fear"]
  },
  {
    id: "q12",
    text: "What am I avoiding?",
    tags: ["fear", "clarity"]
  },
  {
    id: "q13",
    text: "If this were easy, what would it look like?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q14",
    text: "What matters most in this situation?",
    tags: ["clarity", "decision"]
  },
  {
    id: "q15",
    text: "What is the decision I already know I need to make?",
    tags: ["decision", "clarity"]
  }
];
