export interface Reflection {
  id: string;
  questionId: string;
  questionText: string;
  reflectionText: string;
  createdAt: string; // ISO date string
}

const STORAGE_KEY = 'phoch3_reflections';

export function saveReflection(reflection: Omit<Reflection, 'id' | 'createdAt'>): Reflection {
  const newReflection: Reflection = {
    ...reflection,
    id: generateId(),
    createdAt: new Date().toISOString()
  };

  const reflections = getReflections();
  reflections.unshift(newReflection);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));

  return newReflection;
}

export function getReflections(): Reflection[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getReflectionById(id: string): Reflection | undefined {
  return getReflections().find(r => r.id === id);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
