export interface Question {
  id: string;
  text: string;
  tags: string[];
}

export const questions: Question[] = [
  {
    id: "q1",
    text: "Was genau ist das eigentliche Problem — und woran erkenne ich, dass es gelöst ist?",
    tags: ["clarity", "perspective"]
  },
  {
    id: "q2",
    text: "Was liegt in dieser Situation in meinem Einflussbereich?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q3",
    text: "Welche Annahmen treffe ich gerade?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q4",
    text: "Was würde ich tun, wenn ich keine Angst hätte, einen Fehler zu machen?",
    tags: ["fear", "decision"]
  },
  {
    id: "q5",
    text: "Welche Optionen gibt es jenseits der offensichtlichen?",
    tags: ["perspective", "decision"]
  },
  {
    id: "q6",
    text: "Was ist das schlimmste realistische Ergebnis — und wie wahrscheinlich ist es?",
    tags: ["fear", "perspective"]
  },
  {
    id: "q7",
    text: "Welche meiner Stärken kann ich hier bewusst einsetzen?",
    tags: ["people", "performance"]
  },
  {
    id: "q8",
    text: "Was würde ein neutraler Außenstehender beobachten?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q9",
    text: "Welchen kleinen Schritt könnte ich heute noch gehen?",
    tags: ["performance", "decision"]
  },
  {
    id: "q10",
    text: "Welche Geschichte möchte ich später darüber erzählen, wie ich das gemeistert habe?",
    tags: ["perspective", "passion"]
  },
  {
    id: "q11",
    text: "Was kostet es mich, nicht zu handeln?",
    tags: ["decision", "fear"]
  },
  {
    id: "q12",
    text: "Was vermeide ich gerade?",
    tags: ["fear", "clarity"]
  },
  {
    id: "q13",
    text: "Wenn das einfach wäre — wie sähe es dann aus?",
    tags: ["perspective", "clarity"]
  },
  {
    id: "q14",
    text: "Was ist in dieser Situation am wichtigsten?",
    tags: ["clarity", "decision"]
  },
  {
    id: "q15",
    text: "Welche Entscheidung weiß ich eigentlich schon, dass ich sie treffen muss?",
    tags: ["decision", "clarity"]
  }
];
